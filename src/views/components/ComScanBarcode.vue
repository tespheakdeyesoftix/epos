<template>
  <BaseModal>
    <ion-select
      @ionChange="startScanner"
      label="Select Camera"
      placeholder="Select Camera"
      v-model="selectedCameraId"
    >
      <ion-select-option
        v-for="(d, index) in cameraList"
        :key="index"
        :value="d.id"
      >
        {{ d.label }}
      </ion-select-option>
    </ion-select>
    <div id="reader" style="width: 100%"></div>
    <p>Scanned Result: {{ result }}</p>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { modalController } from '@ionic/vue'
import beep from '/assets/beep.mp3'

const result = ref('')
let scanner = null

const selectedCameraId = ref('')
const cameraList = ref([])

const beepSound = new Audio(beep)
const isScanning = ref(false)

const getCameraConfig = () => ({
  fps: 30,
  qrbox: 350,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true
  }
})

const startScanner = async () => {
  // Stop previous scanner if active
  if (scanner) {
    await scanner.stop().catch(() => {})
  }

  window.storageService.setItem('selectedCameraId', selectedCameraId.value)

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
      modalController.dismiss(result.value, 'confirm')

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

    const savedCameraId = window.storageService.getItem('selectedCameraId')
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
