<template>
  <ToolBar>Print Barcode</ToolBar>
  <ion-content>
    <div class="controls">
      <label>Barcode Value:
        <input v-model="barcodeData" />
      </label>

      <label>
        Canvas Width (mm):
        <input
          type="number"
          v-model.number="canvasWidthMM"
          @change="updateCanvasSizeFromMM"
          min="10"
        />
      </label>

      <label>
        Canvas Height (mm):
        <input
          type="number"
          v-model.number="canvasHeightMM"
          @change="updateCanvasSizeFromMM"
          min="10"
        />
      </label>

      <ion-button @click="drawCanvas">Refresh</ion-button>
      <ion-button @click="onFindPrinter">Find Printer</ion-button>
      <ion-button @click="onConnectPrinter">Connect Printer</ion-button>
      <ion-button @click="resetPositions">Reset Positions</ion-button>
      <ion-button @click="printLabel">Print Label</ion-button>
      <ion-button @click="sendToPrinter">Print HTML</ion-button>
    </div>

    <canvas id="canvas" ></canvas>
  </ion-content>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
 
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer'
            
async function onFindPrinter() {
  CapacitorThermalPrinter.addListener('discoverDevices', (devices) => {
    // .log('Discovered printers:', devices)
  })
  await CapacitorThermalPrinter.startScan()
}

async function onConnectPrinter() {
  const result = await CapacitorThermalPrinter.connect({ address: "DC:0D:30:6F:9C:B4" })
  // log('Connected:', result)
}
 
 
async function printLabel() {
      const img = new Image();
    img.src = './assets/img.jpg';  // path to local asset

    img.onload = async () => {
      // Assuming 8 dots per mm: 30mm x 20mm = 240x160 dots
      const targetWidth = 240;
      const targetHeight = 160;

      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw resized image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imageData.data;

      const bytesPerRow = Math.ceil(targetWidth / 8);
      const totalBytes = bytesPerRow * targetHeight;
      const tsplBitmap = new Uint8Array(totalBytes);

      for (let y = 0; y < targetHeight; y++) {
        for (let xByte = 0; xByte < bytesPerRow; xByte++) {
          let byte = 0;
          for (let bit = 0; bit < 8; bit++) {
            const x = xByte * 8 + bit;
            if (x >= targetWidth) continue;

            const idx = (y * targetWidth + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const avg = (r + g + b) / 3;

            // 1-bit: black if < threshold
            const bitValue = avg < 128 ? 1 : 0;
            byte |= bitValue << (7 - bit);
          }
          tsplBitmap[y * bytesPerRow + xByte] = byte;
        }
      }

      const hexData = Array.from(tsplBitmap)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join('');

 
 const tsplLabel = `
  SIZE 30 mm,20 mm
  GAP 2 mm,0
  DENSITY 8
  DIRECTION 0
  CLS
BITMAP 20,20,${bytesPerRow},${targetHeight},0,${hexData}
  PRINT 1
`;
 

      const encoder = new TextEncoder();
      const rawData = encoder.encode(tsplLabel);

      try {
        await CapacitorThermalPrinter.begin().raw(rawData).write();
        // .log("Print sent!");
      } catch (e) {
        console.error("Printing error:", e);
        alert("Failed to print: " + e.message);
      }
    };

    img.onerror = () => {
      alert("Failed to load image.");
    };
  }
 
</script>

 