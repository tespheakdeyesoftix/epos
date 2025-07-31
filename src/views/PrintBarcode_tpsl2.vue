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

async function onConnectPrinter() {
  const result = await CapacitorThermalPrinter.connect({ address: "DC:0D:30:6F:9C:B4" })
  console.log('Connected:', result)
}
 

async function printLabel() {
    
const tsplLabel = `
  SIZE 51 mm,25 mm
  GAP 2 mm,0
  DENSITY 8
  DIRECTION 1
  CLS
  TEXT 100,50,"TSS24.BF2",0,1,1,"សួស្តីពិភពលោក"
  BARCODE 100,150,"128",100,1,0,2,2,"1234567890"
  PRINT 1
`;
 
 

  // 5. Send to printer
  try {

    const encoder = new TextEncoder();
    const bytes = encoder.encode(tsplLabel);
 
    await CapacitorThermalPrinter.begin()
      .raw(bytes)
      .write();
    
    alert('Label printed successfully!');
  } catch (error) {
    console.error('Printing error:', error);
    alert('Printing failed: ' + error.message);
  }  
}
 
</script>

 