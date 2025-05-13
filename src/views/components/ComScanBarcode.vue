<template>
    <BaseModal>
      
        <ion-select  @ionChange="startScanner" label="Select Camerar" placeholder="Select Camerar" v-model="selectedCameraId">
        <ion-select-option v-for="(d, index) in cameraList"  :key="index" :value="d.id" >{{ d.label }}</ion-select-option>
        
      </ion-select>
      <div id="reader" style="width: 100%; height: 100%"></div>
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


const startScanner = async () => {
     
  // Stop previous scanner if active


  if (scanner) {
    
    await scanner?.stop().catch(() => {})
 
  }


  window.storageService.setItem("selectedCameraId",selectedCameraId.value);
  scanner = new Html5Qrcode('reader')
  scanner.start(
    selectedCameraId.value,
    {
      fps: 10,
      qrbox: 350
    },
    (decodedText) => {
      result.value = decodedText
      scanner.stop()
         
      modalController.dismiss(result.value, 'confirm')

    },
    (errorMessage) => {
      // console.warn(`Scan error: ${errorMessage}`)
    }
  )
}



onMounted(async () => {
    const devices = await Html5Qrcode.getCameras()
  if (devices && devices.length) {
    cameraList.value = devices
    if(window.storageService.getItem("selectedCameraId")){
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


