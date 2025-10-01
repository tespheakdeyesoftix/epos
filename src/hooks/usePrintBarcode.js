import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
 import { ref, computed } from 'vue';

 // Conversion constants
const PPI = 96; // Standard screen pixels per inch (can vary)
const DPI = 203; // Your printer's resolution

// Conversion formula
function pixelsToDots(pixels) {
  return Math.round((pixels / PPI) * DPI);
}

export function usePrintBarcode() {
    const printObjects = ref([
        {type:"text",  value:"Product Label", x:20,y:20},
        {type:"currency",  value:25, x:20,y:20},
        {type:"barcode",  value:"123456", x:20,y:20},

    ])

    

async function findBluetoothPrinter(){
  // Optional: listen to scan results
  CapacitorThermalPrinter.addListener('discoverDevices', (devices) => {
    
  });

  // Start scanning
  await CapacitorThermalPrinter.startScan();
}

async function connectBluetoothPrinter(){
 
  const result = await CapacitorThermalPrinter.connect({ address:"DC:0D:30:6F:9C:B4" });
 
 

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

 
 async function onPrintLabel() {
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


  const elements = ref([
    { x: 50, y: 30, width: 100, height: 40, type: 'text', content: 'Product' },
    {  x: 100, y: 80, width: 150, height: 60, type: 'barcode', content: 'SKU123' }
  ]);

  // Convert all element positions to dots
  const printerElements = computed(() => {
    return elements.value.map(el => ({
      ...el,
      x: pixelsToDots(el.x),
      y: pixelsToDots(el.y),
      width: pixelsToDots(el.width),
      height: pixelsToDots(el.height)
    }));
  });

  // Generate TSPL from dragged elements
  const generateTspl = computed(() => {
    return printerElements.value.map(el => {
      if (el.type === 'text') {
        return `TEXT ${el.x},${el.y},"3",0,1,1,"${el.content}"`;
      } else if (el.type === 'barcode') {
        return `BARCODE ${el.x},${el.y},"128",${el.height},1,0,2,2,"${el.content}"`;
      }
    }).join('\n');
  });
 
 

    return {
        printObjects,
        elements, 
        printerElements,
        generateTspl ,
        onPrintLabel
    }
}
