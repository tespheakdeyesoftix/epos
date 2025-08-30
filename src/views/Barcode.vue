<script setup>
import { ref, onBeforeUnmount,onMounted } from 'vue'
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial'
import html2canvas from "html2canvas";
const canvasEl = ref(null)
const captureArea = ref(null);
const barcode = ref(null);
import JsBarcode from "jsbarcode";
let name = ref("")
let product = ref({})
const devices = ref([])
const selectedDevice = ref(null)
const isScanning = ref(false)
onMounted(async () => {
  const loading = await app.showLoading();
  if (app.route.params.product_code) {
    name.value = app.route.params.product_code
  }
  await loading.dismiss();
})

onBeforeUnmount(() => {
  try { BluetoothSerial.disconnect() } catch (e) {}
})

async function searchDevices() {
  isScanning.value = true
  devices.value = []
  try {
    const found = await BluetoothSerial.list()
    devices.value = found // Array of { id, address, class, name }
  } catch (err) {
    console.error("Scan failed:", err)
  }
  isScanning.value = false
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

async function printLabel() {
  const productRes = await app.getDoc("Product",name.value)
  if(productRes){
    product.value = productRes.data
  }
  JsBarcode(barcode.value, name.value, {
    format: "CODE128",
    lineColor: "#000",
    width: 2.5,
    height: 110,
    displayValue: false,
  });
   const srcCanvas = await html2canvas(captureArea.value, {
    backgroundColor: "white",
    useCORS: true,
  });
  const canvas = canvasEl.value;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = 200;
  canvas.height = 170;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(srcCanvas, 0, 0, canvas.width, canvas.height);
  convertToBlackAndWhite(canvas, 200);
  printTSPL(selectedDevice.value).then().catch(err => console.error("Print failed", err));
}

async function printTSPL(macAddress) {
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
            await new Promise(res => setTimeout(res, 50)); // small pause
          }
          await BluetoothSerial.write("\nPRINT 1\n");
          await new Promise(res => setTimeout(res, 300));
          await BluetoothSerial.disconnect();
        } catch (err) {
          console.error("Print failed:", err);
        }
      },
      error: err => console.error("Print failed:", err)
    });
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
    <div >
      <div ref="captureArea" style="background-color: transparent; padding:-5px; width:200px; height:170px; display:flex; align-items:center; justify-content:center;flex-direction: column; gap: 0px; ">
        <div style="font-size: 20px;color: black;font-family: Khmer OS Battambang;margin-bottom: -5px;">{{ product?.product_name_en }}</div>
        <svg ref="barcode" style="width:100%; height:100%;margin: -5px;"></svg>
        <div class="flex justify-between w-full" style="width: 100%">
          <div class="text-left" style="font-size: 15px; color: black; font-family: Khmer OS Battambang; margin-left: 20px;width: 50%;">
            {{ product?.product_code }}
          </div>
          <div class="text-right" style="font-size: 15px; color: black; font-family: Khmer OS Battambang; margin-right: 20px;width: 50%;">
            {{ product?.price }}
          </div>
        </div>
      </div>
      <button @click="searchDevices" :disabled="isScanning">{{ isScanning ? 'Scanning...' : 'Search Printers' }}</button>
      <ul v-if="devices.length > 0">
        <li v-for="d in devices" :key="d.address" @click="selectDevice(d)" style="cursor:pointer; margin:4px 0;">
          <span :style="{ fontWeight: selectedDevice?.address === d.address ? 'bold' : 'normal' }">
            {{ d.name || 'Unknown' }} ({{ d.address }})
          </span>
        </li>
      </ul>
      <button @click="printLabel">Print</button>
      <div style="visibility: hidden;">
            <canvas ref="canvasEl"></canvas>
      </div>
    </div>
  </ion-page>
  
</template>
