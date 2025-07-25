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
    </div>

    <div class="canvas-container">
      <canvas
        ref="canvasRef"
        :width="canvasWidthPx"
        :height="canvasHeightPx"
        class="barcode-canvas"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="drag"
        @touchend="endDrag"
      ></canvas>
    </div>

    <div v-if="tsplCommand" class="tspl-output">
      <h3>Generated TSPL2 Command:</h3>
      <pre>{{ tsplCommand }}</pre>
    </div>
  </ion-content>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import JsBarcode from 'jsbarcode'
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer'

const DPI = 203
const canvasWidthMM = ref(35)
const canvasHeightMM = ref(25)
const canvasWidthPx = ref(Math.round(canvasWidthMM.value * (DPI / 25.4)))
const canvasHeightPx = ref(Math.round(canvasHeightMM.value * (DPI / 25.4)))
const barcodeData = ref('123456789012')
const tsplCommand = ref('')
const resizeHandleSize = 28
const canvasRef = ref(null)

const elements = reactive([
  { id: 'label', type: 'text', text: 'ផលិតផល A', x: 20, y: 30, width: 200, height: 30 },
  { id: 'price', type: 'text', text: '$5.00', x: 20, y: 160, width: 100, height: 30 }
])

let selected = null, offsetX = 0, offsetY = 0

function updateCanvasSizeFromMM() {
  canvasWidthPx.value = Math.round(canvasWidthMM.value * (DPI / 25.4))
  canvasHeightPx.value = Math.round(canvasHeightMM.value * (DPI / 25.4))
  drawCanvas(true)
}

function resetPositions() {
  elements.forEach(el => { el.x = 10; el.y = 10 })
  drawCanvas(true)
}

function drawHandles(ctx, el) {
  ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)'
  ctx.strokeRect(el.x, el.y, el.width, el.height)
  ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'
  ctx.fillRect(el.x + el.width - resizeHandleSize, el.y + el.height - resizeHandleSize, resizeHandleSize, resizeHandleSize)
}

async function drawCanvas(showHandles = true) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  elements.forEach(el => {
    if (el.type === 'text') {
      ctx.font = `${Math.max(12, el.height)}px Khmer OS Content, sans-serif`
      ctx.fillStyle = 'black'
      ctx.fillText(el.text, el.x, el.y + el.height - 5)
      if (showHandles) drawHandles(ctx, el)
    }
  })
}

function getXY(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const touch = e.touches?.[0] || e
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
}

function isInResizeHandle(el, x, y) {
  const handleX = el.x + el.width - resizeHandleSize
  const handleY = el.y + el.height - resizeHandleSize
  return x >= handleX && x <= handleX + resizeHandleSize && y >= handleY && y <= handleY + resizeHandleSize
}

function startDrag(e) {
  e.preventDefault()
  const { x, y } = getXY(e)
  selected = null
  for (const el of elements.slice().reverse()) {
    if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
      if (isInResizeHandle(el, x, y)) el.isResizing = true
      else { el.isDragging = true; offsetX = x - el.x; offsetY = y - el.y }
      selected = el; break
    }
  }
}

function drag(e) {
  if (!selected) return
  e.preventDefault()
  const { x, y } = getXY(e)
  if (selected.isDragging) { selected.x = x - offsetX; selected.y = y - offsetY }
  else if (selected.isResizing) {
    selected.width = Math.max(30, x - selected.x)
    selected.height = Math.max(20, y - selected.y)
  }
  drawCanvas(true)
}

function endDrag() {
  if (selected) { selected.isDragging = false; selected.isResizing = false }
  selected = null
}

async function onFindPrinter() {
  CapacitorThermalPrinter.addListener('discoverDevices', (devices) => {
    console.log('Discovered printers:', devices)
  })
  await CapacitorThermalPrinter.startScan()
}

async function onConnectPrinter() {
  const result = await CapacitorThermalPrinter.connect({ address: "DC:0D:30:6F:9C:B4" })
  console.log('Connected:', result)
}
 function getTSPL2BitmapFromCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const width = canvas.width;
  const height = canvas.height;
  const bytesPerRow = Math.ceil(width / 8);
  const bitmap = new Uint8Array(bytesPerRow * height).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = imgData.data[idx];
      const g = imgData.data[idx + 1];
      const b = imgData.data[idx + 2];
      // Convert to grayscale and check if pixel should be "on"
      const isBlack = (r * 0.299 + g * 0.587 + b * 0.114) < 128;
      
      if (isBlack) {
        const byteIndex = y * bytesPerRow + Math.floor(x / 8);
        const bitPosition = 7 - (x % 8); // TSPL uses MSB first
        bitmap[byteIndex] |= (1 << bitPosition);
      }
    }
  }

  // Convert to hexadecimal string
  let hexString = '';
  for (let i = 0; i < bitmap.length; i++) {
    hexString += ('0' + bitmap[i].toString(16)).slice(-2);
  }

  return {
    widthBytes: bytesPerRow,
    height,
    hexData: hexString,
  };
}
 

async function printLabel() {
  // 1. First draw the canvas without handles
  await drawCanvas(false);
  
  // 2. Get canvas data and convert properly
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  // Get image data and process it
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  // Calculate bytes per row (8 pixels per byte)
  const bytesPerRow = Math.ceil(canvas.width / 8);
  const bitmapData = new Uint8Array(bytesPerRow * canvas.height);
  
  // Process pixels to create bitmap
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const pixelIndex = (y * canvas.width + x) * 4;
      const r = pixels[pixelIndex];
      const g = pixels[pixelIndex + 1];
      const b = pixels[pixelIndex + 2];
      
      // Convert to grayscale and check if pixel should be printed (black)
      const grayscale = (r * 0.3 + g * 0.59 + b * 0.11);
      const isBlack = grayscale < 128;
      
      if (isBlack) {
        const byteIndex = y * bytesPerRow + Math.floor(x / 8);
        const bitPosition = 7 - (x % 8); // MSB first
        bitmapData[byteIndex] |= (1 << bitPosition);
      }
    }
  }
  
  // 3. Convert bitmap to hexadecimal string
  let hexString = '';
  for (let i = 0; i < bitmapData.length; i++) {
    hexString += ('00' + bitmapData[i].toString(16)).slice(-2);
  }
  
  // 4. Generate proper TSPL2 commands
const tsplLabel = `
SIZE 51 mm, 25 mm
GAP 2 mm, 0 mm
CLS
TEXT 20,20,"2",0,1,0.8,"ហេលលោ"
TEXT 20,40,"2",0,1,0.8,"port and chicken"
BARCODE 30,60,"128",60,1,0,2,2,"SKU123456"
TEXT 204,100,"3",0,1,1,"SKU123456xxx"
PRINT 1
`;
 
  // 5. Send to printer
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(tsplLabel);
    
    await CapacitorThermalPrinter.begin()
      .raw(Array.from(bytes))
      .write();
    
    alert('Label printed successfully!');
  } catch (error) {
    console.error('Printing error:', error);
    alert('Printing failed: ' + error.message);
  } finally {
    // Redraw with handles
    drawCanvas(true);
  }
}

onMounted(() => drawCanvas(true))
</script>

<style scoped>
ion-content { padding: 16px; background: #f5f5f5; }
.canvas-container { display: flex; justify-content: center; margin-top: 12px; }
.controls { margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.controls input { margin-left: 6px; padding: 4px; width: 120px; }
.barcode-canvas { border: 1px solid #ccc; background-color: white; touch-action: none; }
.tspl-output { margin-top: 20px; padding: 10px; background: #eee; font-family: monospace; white-space: pre-wrap; word-break: break-word; }
</style>
