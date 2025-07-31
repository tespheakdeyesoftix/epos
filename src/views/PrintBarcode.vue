<template>
  <ion-page>
    

  <ToolBar>Print Barcode</ToolBar>
  <ion-content>
    
     
      <ion-button @click="onFindPrinter">Find Printer</ion-button>
      <ion-button @click="onConnectPrinter">Connect Printer</ion-button>
 
      <ion-button @click="printLabel">Print Label</ion-button>
  
   
  </ion-content>
    </ion-page>
</template>

<script setup>
 
 import { ref } from 'vue';
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';

const printerAddress = ref('DC:0D:30:6F:9C:B4');
const labelWidth = 30; // mm
const labelHeight = 20; // mm
const dpi = 203; // Common thermal printer DPI

// Convert mm to pixels
const mmToPixels = (mm) => Math.round((mm * dpi) / 25.4);

// Create monochrome bitmap data from canvas
const canvasToBitmapData = (canvas) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Create image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Calculate bytes per row (must be divisible by 8)
  const bytesPerRow = Math.ceil(width / 8);
  
  // Create bitmap array
  const bitmap = new Uint8Array(bytesPerRow * height);
  
  // Convert to 1-bit monochrome
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Convert to grayscale and check if pixel should be "on"
      const grayscale = (r + g + b) / 3;
      const isBlack = grayscale < 128; // Threshold for black/white
      
      if (isBlack) {
        const byteIndex = Math.floor(x / 8) + y * bytesPerRow;
        const bitIndex = 7 - (x % 8);
        bitmap[byteIndex] |= (1 << bitIndex);
      }
    }
  }
  
  return {
    data: bitmap,
    width,
    height,
    bytesPerRow
  };
};

// Generate TSPL commands for the bitmap
const createBitmapCommands = (bitmapData) => {
  const commands = [
    'SIZE 30,20',
    'GAP 2,0',
    'CLS',
    'DIRECTION 1',
    
    // BITMAP command format: BITMAP x,y,width,height,0,data...
    `BITMAP 0,0,${bitmapData.bytesPerRow * 8},${bitmapData.height},0,${Array.from(bitmapData.data).join(',')}`,
    
    'PRINT 1'
  ];
  
  return commands.join('\n');
};

const printLabel = async () => {
  try {
    // 1. Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size in pixels
    const width = mmToPixels(labelWidth);
    const height = mmToPixels(labelHeight);
    canvas.width = width;
    canvas.height = height;
    
    // 2. Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // 3. Draw Khmer text at top
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial, "Khmer OS"'; // Fallback to Arial if Khmer OS not available
    const text1 = 'អក្សរខ្មែរ'; // Khmer text
    const text2 = 's-m 7mm'; // English text
    
    // Center text horizontally
    const text1Width = ctx.measureText(text1).width;
    const text2Width = ctx.measureText(text2).width;
    
    ctx.fillText(text1, (width - text1Width) / 2, 20);
    ctx.fillText(text2, (width - text2Width) / 2, 40);
    
    // 4. Draw barcode below (simulated)
    for (let i = 0; i < 20; i++) {
      const lineHeight = 10 + Math.random() * 10;
      ctx.fillRect(50 + (i * 5), 60, 3, lineHeight);
    }
    
    // 5. Convert canvas to bitmap data
    const bitmapData = canvasToBitmapData(canvas);
    
    // 6. Generate TSPL commands
    const tsplCommands = createBitmapCommands(bitmapData);
    
    // 7. Connect to printer
    const connection = await CapacitorThermalPrinter.connect({
      address: printerAddress.value
    });
    
    if (!connection) {
      throw new Error('Failed to connect to printer');
    }
    
    // 8. Convert commands to Uint8Array
    const encoder = new TextEncoder();
    const rawData = encoder.encode(tsplCommands);
    
    // 9. Send raw commands to printer
    await CapacitorThermalPrinter.begin()
      .raw(rawData)
      .write();
    
    console.log('Label with Khmer text printed successfully');
  } catch (error) {
    console.error('Printing error:', error);
    alert(`Printing failed: ${error.message}`);
  }
};
 
</script>

 