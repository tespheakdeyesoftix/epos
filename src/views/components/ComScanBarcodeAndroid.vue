<template>
<BaseModal :title="t('Scan Barcode')">
  <template #end>
    <ComPopOver>
      <ion-button>
        <ion-icon :icon="cameraOutline" slot="icon-only" />
      </ion-button>
      <template #content>
        <ion-list>
          <ion-item lines="full" v-for="(d, index) in cameraList" @click="startScanner(d)">
              <ion-label>
                {{ d.label }}
              </ion-label>
          </ion-item>
        </ion-list>
      </template>
    </ComPopOver>
  </template>
    <div id="reader" style="width: 100%"></div>
 </BaseModal>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import beep from '/assets/beep.mp3'
import { cameraOutline } from 'ionicons/icons';
const emit = defineEmits();
const result = ref('')
let scanner = null
const t = window.t;
const selectedCameraId = ref('')
const cameraList = ref([])

const beepSound = new Audio(beep)
const isScanning = ref(false)

const getCameraConfig = () => ({
  fps: 30,
  qrbox: 250,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true
  }
})

const startScanner = async (camera=null) => {
  if(camera){
    selectedCameraId.value = camera.id;
  }
  // Stop previous scanner if active
  if (scanner) {
    await scanner.stop().catch(() => {})
  }

  app.storageService.setItem('selectedCameraId', selectedCameraId.value)

  scanner = new Html5Qrcode('reader')
  scanner.start(
    selectedCameraId.value,
    getCameraConfig(),
    (decodedText) => {
      if (isScanning.value) return
      isScanning.value = true

      beepSound.currentTime = 0
      beepSound.play()
      result.value = decodedText
      
      scanner.stop()
      emit("onScanBarcode", result.value)
      setTimeout(() => {
        isScanning.value = false
      }, 1000)
    },
    (errorMessage) => {
      // You may log or ignore scan errors here
    }
  )
}

onMounted(async () => {
  const devices = await Html5Qrcode.getCameras()
  if (devices && devices.length) {
    cameraList.value = devices

    const savedCameraId = app.storageService.getItem('selectedCameraId')
    if (savedCameraId && savedCameraId !== 'undefined') {
      selectedCameraId.value = savedCameraId.toString()
    } else {
      selectedCameraId.value = devices[0].id
    }
  }

  await startScanner()
})

onBeforeUnmount(() => {
  if (scanner) {
    scanner.stop().catch(console.error)
  }
})
</script>

<style scoped>
#reader{
  border-radius: 20px;
  overflow: hidden;
  height: calc(100vh-10px);
  
}
</style>