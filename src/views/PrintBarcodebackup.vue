<template>
    <ion-page>
        <ToolBar>{{ t("Print Barcode") }}</ToolBar>
        <ion-content class="ion-padding">
             <ion-button @click="onFindPrinter">fine printer</ion-button>
      <!-- <ion-button @click="printReceipt">Print me</ion-button> -->
      <ion-button @click="onConnectPrinter">ConnectPrinter</ion-button>
      <ion-button @click="printLabel">Print labe</ion-button>
      <ion-button routerLink="/print-barcode">open print barcode</ion-button>
      
       <div class="label-design" ref="labelDiv" :style="labelStyle">
      <h3>{{ productName }}</h3>
      <div class="price">{{ price }}</div>
      <div class="barcode">{{ barcodeData }}</div>
    </div>
                <!-- Canvas Area -->
                <div class="designer-canvas" ref="canvas" @dragover.prevent @drop="handleDrop">
                    <div v-for="element in elements" :key="element.id" class="design-element" :style="{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`
                    }" draggable @dragstart="startDrag($event, element.id)" @dragend="stopDrag">
                        {{ element.content }}
                    </div>
                </div>

                <!-- TSPL Preview -->
                <div style="clear: both;"></div>
                <textarea class="tspl-preview" :value="generateTspl"></textarea>
          
        </ion-content>
    </ion-page>
</template>
<script setup>
const t = window.t;
import {usePrintBarcode}  from "@/hooks/usePrintBarcode.js"
const { elements, generateTspl } =  usePrintBarcode();
 
 
 import {CapacitorThermalPrinter } from 'capacitor-thermal-printer';
 
async function onFindPrinter(){
  // Optional: listen to scan results
  CapacitorThermalPrinter.addListener('discoverDevices', (devices) => {
    console.log('Discovered printers:', devices);
  });

  // Start scanning
  await CapacitorThermalPrinter.startScan();
}

async function onConnectPrinter(){
 
  const result = await CapacitorThermalPrinter.connect({ address:"DC:0D:30:6F:9C:B4" });
  console.log('Connected:', result);
 

}
async function printReceipt() {
  
  try {
        const response = await app.getApi("epos_restaurant_2023.api.printing.convertimg");
    const base64Image = response.data;
    const printerWidthMM = (576 * 25.4) / 200; // ≈73mm for 200dpi

    await CapacitorThermalPrinter.begin()
     .dpi(200) // Set DPI to match your calculation
  .limitWidth(printerWidthMM) // Set width in millimeters
    .align('center')

      .image(base64Image)
      .cutPaper()
      .write();

    console.log('✅ Printed image successfully');
  } catch (err) {
    console.error('❌ Failed to print image:', err);
  }
}
 
const tsplLabel = `
SIZE 51 mm, 25 mm
GAP 2 mm, 0 mm
CLS
TEXT 20,20,"2",0,1,0.8,"Fried rice beef with"
TEXT 20,40,"2",0,1,0.8,"port and chicken"
BARCODE 30,60,"128",60,1,0,2,2,"SKU123456"
TEXT 204,100,"3",0,1,1,"SKU123456xxx"
PRINT 1
`;

import html2canvas from 'html2canvas';
 async function printLabel() {
   try {
   const encoder = new TextEncoder();
const bytes = encoder.encode(tsplLabel);

      await CapacitorThermalPrinter
        .begin()
        .raw(Array.from(bytes)) 
        .write();
      
    } catch (error) {
     
      console.error(error);
    }
}

 

</script>
<style scoped>


.designer-canvas {
    flex: 1;
    position: relative;
    border: 1px dashed #ccc;
    background-color: #f9f9f9;
}

.design-element {
    position: absolute;
    border: 1px solid #42b983;
    background-color: rgba(66, 185, 131, 0.2);
    padding: 5px;
    cursor: move;
}

.tspl-preview {
    width: 300px;
    height: 100%;
    font-family: monospace;
}
</style>