<script setup>
import { ref, onBeforeUnmount,onMounted } from 'vue'
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial'
import html2canvas from "html2canvas";
import { nextTick } from 'vue'
import { showWarning } from "@/helpers/utils";
import JsBarcode from "jsbarcode";
const canvasEl = ref(null)
const captureArea = ref(null);
const barcode = ref(null);
let product = ref({"product_code":"123456","product_name_en":"test","price":"100"})
const devices = ref([])
const selectedDevice = ref(null)
const isScanning = ref(false)
const copies = ref(1)
onMounted(async () => {
  const loading = await app.showLoading();
  if (app.route.params.product_code) {
    await render(app.route.params.product_code)
  }
  await loading.dismiss();
})


onBeforeUnmount(() => {
  try { BluetoothSerial.disconnect() } catch (e) {}
})

async function ensureBluetoothPermissions() {
  return new Promise((resolve, reject) => {
    const permissions = cordova.plugins.permissions;
    const list = [
      permissions.BLUETOOTH_SCAN,
      permissions.BLUETOOTH_CONNECT,
    ];

    permissions.checkPermission(list[0], (status) => {
      if (!status.hasPermission) {
        permissions.requestPermissions(
          list,
          (res) => {
            if (res.hasPermission) {
              resolve(true);
            } else {
              reject("Bluetooth permission denied");
            }
          },
          (err) => reject(err)
        );
      } else {
        resolve(true);
      }
    });
  });
}


async function searchDevices() {
  isScanning.value = true;
  devices.value = [];

  try {
    // 🔑 Ask for Nearby Devices permission first
    await ensureBluetoothPermissions();

    const enabled = await BluetoothSerial.isEnabled();
    if (!enabled) {
      showWarning("Please turn on Bluetooth first");
      isScanning.value = false;
      return;
    }

    const found = await BluetoothSerial.list();
    devices.value = found;
  } catch (err) {
    console.error("Bluetooth scan error:", err);
    showWarning("Permission denied or error occurred");
  }

  isScanning.value = false;
}


function selectDevice(device) {
  selectedDevice.value = device
}

function imageToTSPLBitmap(canvas, x = 30, y = 5, mode = 0) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height).data;
  const widthBytes = Math.ceil(width / 8);
  const bitmap = new Uint8Array(widthBytes * height);
  for (let row = 0; row < height; row++) {
    for (let byte = 0; byte < widthBytes; byte++) {
      let b = 0;
      for (let bit = 0; bit < 8; bit++) {
        const xPixel = byte * 8 + bit;
        if (xPixel < width) {
          const idx = (row * width + xPixel) * 4;
          const pixel = imgData[idx];
          if (pixel === 0) { 
            b |= (0x80 >> bit);
          }
        }
      }
      bitmap[row * widthBytes + byte] = ~b & 0xFF;
    }
  }
  const header = `BITMAP ${x},${y},${widthBytes},${height},${mode},`;
  return { header, bitmap };
}

async function render(name) {
  const productRes = await app.getDoc("Product", name)
  if(productRes){
    product.value = productRes.data
  }
  JsBarcode(barcode.value, name, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 90,
    displayValue: false,
    margin: 0,
  })
  barcode.value.removeAttribute("width")
  barcode.value.removeAttribute("height")
  await nextTick()
  // Capture label block
  const srcCanvas = await html2canvas(captureArea.value, {
    backgroundColor: "white",
    useCORS: true,
  })

  const canvas = canvasEl.value
  const ctx = canvas.getContext("2d", { willReadFrequently: true })

  // 🔹 Fixed paper size (30mm x 20mm @ 8 dots/mm)
  const paperWidth = 30 * 8   // 240 dots
  const paperHeight = 20 * 8  // 160 dots
  canvas.width = paperWidth
  canvas.height = paperHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 🔹 Scale content if wider than paper
  let scale = 1
  if(srcCanvas.width > paperWidth || srcCanvas.height > paperHeight) {
    scale = Math.min(paperWidth/srcCanvas.width, paperHeight/srcCanvas.height)
  }

  const contentWidth = srcCanvas.width * scale
  const contentHeight = srcCanvas.height * scale

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 🔹 Center the content
  const offsetX = (canvas.width - contentWidth)/2
  const offsetY = (canvas.height - contentHeight)/2
  ctx.drawImage(srcCanvas, offsetX, offsetY, contentWidth, contentHeight)

  // Convert to black & white
  convertToBlackAndWhite(canvas, 150)
}

async function printLabel() {
  await render(app.route.params.product_code)
  await printTSPL(selectedDevice.value.address,copies.value)
}
async function printTSPL(macAddress, copies = 1) {
  const subscription = BluetoothSerial.connectInsecure(macAddress).subscribe({
    next: async () => {
      try {
        const wakeBytes = new Uint8Array([0x1B, 0x40]);
        await BluetoothSerial.write(wakeBytes.buffer);
        await BluetoothSerial.write("SIZE 30 mm,20 mm\n");
        await BluetoothSerial.write("GAP 2 mm,0\n");
        await BluetoothSerial.write("CLS\n");

        const { header, bitmap } = imageToTSPLBitmap(canvasEl.value);
        await BluetoothSerial.write(header);

        const chunkSize = 512;
        for (let i = 0; i < bitmap.length; i += chunkSize) {
          await BluetoothSerial.write(bitmap.slice(i, i + chunkSize));
          await new Promise(res => setTimeout(res, 50));
        }

        await BluetoothSerial.write(`\nPRINT ${copies}\n`);
        await new Promise(res => setTimeout(res, 300));
        await BluetoothSerial.disconnect();
      } catch (err) {
        console.error("Print failed:", err);
      }
    },
    error: err => console.error("Print failed:", err)
  });
}

function copiesChanged(e) {
  copies.value = e.target.value
}

function convertToBlackAndWhite(canvas, threshold = 128) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const v = gray < threshold ? 0 : 255;
    data[i] = data[i + 1] = data[i + 2] = v; // black or white
  }
  ctx.putImageData(imgData, 0, 0);
}
</script>
<template>
  <ion-page>
     <ToolBar>{{("Print Barcode")}}</ToolBar>
    <ion-content>
    <div style="align-items: center; justify-content: center; display: flex; flex-direction: column; gap: 0px; height: 100%;">
      <div style="border-width: 1px; border-color: black; border-style: solid; padding: 5px;border-radius: 12px;margin-bottom: 5px;">
        <div ref="captureArea" style="background-color: transparent; padding:px; width:200px; height:170px; display:flex; align-items:center; justify-content:center;flex-direction: column; gap: 0px; ">
          <div style="font-size: 15px;color: black;font-family: 'Khmer OS Battambang';text-align: center;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;">{{ product?.product_name_en }}</div>
            <svg ref="barcode" style="width:100%; height:100%;flex: 1;"></svg>
            <div class="flex justify-between w-full" style="width: 100%">
              <div class="text-left" style="font-size: 15px; color: black; font-family: Khmer OS Battambang; margin-left: 5px;width: 60%;">
                {{ product?.product_code }}
              </div>
              <div class="text-right" style="font-size: 15px; color: black; font-family: Khmer OS Battambang; margin-right: 5px;width: 40%;">
                {{ product?.price }}$
              </div>
            </div>
        </div>
      </div>
      <ion-button shape="round" size="large" expand="full" @click="searchDevices" :disabled="isScanning" style="font-size: 15px;" class="save-button">
        {{ isScanning ? 'Scanning...' : 'Search Printers' }}
      </ion-button>
      <ul v-if="devices.length > 0">
        <li v-for="d in devices" :key="d.address" @click="selectDevice(d)" style="cursor:pointer; margin:4px 0;">
          <span :style="{ fontWeight: selectedDevice?.address === d.address ? 'bold' : 'normal' }" style="font-size: 20px;">
            {{ d.name || 'Unknown' }} ({{ d.address }})
          </span>
        </li>
      </ul>
      <div style="display: flex; flex-direction: row; gap: 10px; align-items: center;">
        Copies: <ion-input value="1" type="number" placeholder="Print Number" @ionInput="copiesChanged" style="align-content: center;align-items: center;width: 120px;text-align: center;"></ion-input>
        <ion-button shape="round" size="large" expand="full" @click="printLabel"  style="width: 100%;;margin-top: 10px;font-size: 15px;" class="save-button">Print</ion-button>
      </div>
      <div style="visibility: hidden;">
          <canvas ref="canvasEl"></canvas>
      </div>
    </div>
    </ion-content>
  </ion-page>
</template>
