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
    <img :src="myImg"/>
  </ion-content>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
 
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer'
            
async function onFindPrinter() {
  CapacitorThermalPrinter.addListener('discoverDevices', (devices) => {
    console.log('Discovered printers:', devices)
  })
  await CapacitorThermalPrinter.startScan()
}
const myImg = ref(null)
async function onConnectPrinter() {
  const result = await CapacitorThermalPrinter.connect({ address: "DC:0D:30:6F:9C:B4" })
  console.log('Connected:', result)
}
  async function printLabel() {
  // Printer resolution (203 DPI = 8 dots/mm)
  const DPI = 203;
  const MM_TO_DOTS = DPI / 25.4;
  
  // Label size in mm (adjust to your label size)
  const labelWidthMM = 30;
  const labelHeightMM = 20;
  
  // Convert to dots
  const width = Math.floor(labelWidthMM * MM_TO_DOTS);
  const height = Math.floor(labelHeightMM * MM_TO_DOTS);

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fill white background (CRUCIAL)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Draw black text
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px "Khmer OS System", Arial, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('សួស្តីពិភពលោក', 10, 10);

  // Convert to 1-bit monochrome bitmap
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const bytesPerRow = Math.ceil(width / 8);
  const bitmapData = new Uint8Array(bytesPerRow * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const isBlack = (r + g + b) < 384; // Threshold for black (384 = 128*3)

      if (isBlack) {
        const bytePos = Math.floor(x / 8);
        const bitPos = 7 - (x % 8);
        bitmapData[y * bytesPerRow + bytePos] |= (1 << bitPos);
      }
    }
  }

  // Convert to hex string
  const hexString = Array.from(bitmapData)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join('');

  // TSPL Commands (XPrinter compatible)
  const tsplCommands = [
    'SIZE 30 mm,20 mm',
    'GAP 2 mm,0 mm',
    'DIRECTION 1',      // Try 0 or 1 based on your printer
    'REFERENCE 0,0',
    'CLS',
    `BITMAP 0,0,${bytesPerRow},${height},0,${hexString}`,
    'PRINT 1'
  ].join('\n');

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(tsplCommands);
    await CapacitorThermalPrinter.begin().raw(data).write();
    console.log('Printed successfully!');
  } catch (error) {
    console.error('Print error:', error);
    alert('Print failed: ' + error.message);
  }
}

</script>

 