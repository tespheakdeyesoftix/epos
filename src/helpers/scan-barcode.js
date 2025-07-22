import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
 import beep from '/assets/beep.mp3'
const beepSound = new Audio(beep)
let isSupported = false;
let isModuleAvailable = false;

// Initialize scanner (call this once when app starts)
export async function initializeScanner() {
  try {
    const supported = await BarcodeScanner.isSupported();
    isSupported = supported.supported;
    
    if (isSupported) {
      await checkAndInstallModule();
    }
    return isSupported;
  } catch (error) {
    app.showWarning("Scan barcode is not supported")
   
    return false;
  }
}

async function checkAndInstallModule() {
  try {
    const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    isModuleAvailable = available;
    
    if (!available) {
 
      await BarcodeScanner.installGoogleBarcodeScannerModule();
      isModuleAvailable = true;
 
    }
  } catch (error) {
   app.showWarning("Install google scanning module error.")
    throw error;
  }
}

async function requestPermissions() {
  const { camera } = await BarcodeScanner.requestPermissions();
  return camera === 'granted' || camera === 'limited';
}

function formatBarcodeType(type) {
  const types = {
    0: 'Unknown',
    1: 'Contact Info',
    2: 'Email',
    3: 'ISBN',
    4: 'Phone',
    5: 'Product',
    6: 'SMS',
    7: 'Text',
    8: 'URL',
    9: 'WiFi',
    10: 'Geographic Coordinates',
    11: 'Calendar Event',
    12: 'Driver License',
    13: 'PDF417',
  };
  return types[type] || `Type ${type}`;
}
 
 
export async function onScanBarcodeAndroid() {
  if (!isSupported) {
  
    return null;
  }

  try {
    if (!isModuleAvailable) {
      await checkAndInstallModule();
    }

    const granted = await requestPermissions();
    if (!granted) {
     
      return null;
    }

    const { barcodes } = await BarcodeScanner.scan();
    
    if (barcodes.length > 0) {
      const result = {
        format: formatBarcodeType(barcodes[0].format),
        rawValue: barcodes[0].rawValue
      };
     beepSound.currentTime = 0
      beepSound.play()
      return result;
    } else {
      
      return false;
    }
  } catch (error) {
  
    app.showWarning("User cancell scanning")

 
    return null;
  }
}