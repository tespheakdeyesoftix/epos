<template>
    <BaseModal> 
        <ion-select  @ionChange="startScanner" label="Select Camerar" placeholder="Select Camerar" v-model="selectedCameraId">
        <ion-select-option v-for="(d, index) in cameraList"  :key="index" :value="d.id" >{{ d.label }}</ion-select-option>
        
      </ion-select>
      <div id="reader" style="width: 100%"></div>
      <p>Scanned Result: {{ result }}</p>
      
    </BaseModal>
  </template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { modalController } from "@ionic/vue"
const result = ref('')
let scanner: Html5Qrcode
const selectedCameraId = ref('')
const cameraList = ref([])
import beep from '/assets/beep.mp3';
import { apps } from 'ionicons/icons'
const beepSound = new Audio(beep)
const isScanning =ref(false)
const noiseReductionLevel = ref('2');
const lowLightMode = ref(true);
const getCameraConfig = () => ({
  fps: 30,
  qrbox: 350,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true
  },
  // videoConstraints: {
  //   facingMode: { ideal: 'environment' },
  //   width: { ideal: 1920 },
  //   height: { ideal: 1080 },
  //   advanced: [
  //     { zoom: 1.0 }
  //   ]
  // }
});


const startScanner = async () => {
     
  // Stop previous scanner if active


  if (scanner) {
    
    await scanner?.stop().catch(() => {})
 
  }


  window.storageService.setItem("selectedCameraId",selectedCameraId.value);
  scanner = new Html5Qrcode('reader')
  scanner.start(
    selectedCameraId.value,
    getCameraConfig(),
    (decodedText) => {
      if (isScanning.value) return 
      isScanning.value = true 
      beepSound.currentTime = 0 // rewind to start
      beepSound.play()
      result.value = decodedText
      scanner.stop()
      // app.showSuccess(result.value)    
      modalController.dismiss(result.value, 'confirm')
      setTimeout(() => {
      isScanning.value = false
    }, 1000)
    },
    (errorMessage) => {
      // console.warn(`Scan error: ${errorMessage}`)
    }
  )
}



onMounted(async () => {
    const devices = await Html5Qrcode.getCameras()
  if (devices && devices.length) {
    cameraList.value = devices;
    selectedCameraId.value = window.storageService.getItem("selectedCameraId")
 
    if(selectedCameraId.value && selectedCameraId.value.toString() !== "undefined"){
    
        selectedCameraId.value = window.storageService.getItem("selectedCameraId")?.toString() // default to first camera
    }else {
       
        selectedCameraId.value = devices[0].id // default to first camera
    }

  }
 await startScanner();

})

onBeforeUnmount(() => {
  scanner?.stop().catch(console.error)
})
</script>


