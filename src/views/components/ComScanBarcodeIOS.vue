<script setup>
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const videoRef = ref(null);
const code = ref('');
const devices = ref([]);
const selectedDeviceId = ref(null);

let codeReader = new BrowserMultiFormatReader();
let currentStream = null;

const emit = defineEmits()

const stopStream = () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
};

const startScanner = async (deviceId) => {
  stopStream();
  app.storageService.setItem('selectedCameraId', deviceId)

  try {
    const constraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
      }
    };

    await codeReader.decodeFromConstraints(constraints, videoRef.value, (result) => {
      if (result) {
        code.value = result.getText();
        
        emit("onScanBarcode",  code.value)

      }
    });

    currentStream = videoRef.value?.srcObject;
  } catch (err) {
    alert('Failed to start scanner:' +  err.toString());
  }
};

const getCameras = async () => {
  const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
  devices.value = videoDevices;

 

 
  const savedCameraId = app.storageService.getItem('selectedCameraId')
    if (savedCameraId && savedCameraId !== 'undefined') {
      selectedDeviceId.value = savedCameraId.toString()
    } else {
      selectedDeviceId.value = videoDevices[0]?.deviceId;
    }


  if (selectedDeviceId.value) {
    await startScanner(selectedDeviceId.value);
  }
};

const switchCamera = async () => {
  if (selectedDeviceId.value) {
    await startScanner(selectedDeviceId.value);
  }
};

onMounted(async () => {
  await getCameras();
});

onBeforeUnmount(() => {
  stopStream();
});
</script>

<template>
  <div>
     
    <ion-select
      @ionChange="switchCamera"
      label="Select Camera"
      placeholder="Select Camera"
    v-model="selectedDeviceId"
    >
      <ion-select-option
        v-for="(d, index) in devices"
        :key="index"
        :value="d.deviceId"
      >
      {{ d.label || 'Camera' }}
      </ion-select-option>
    </ion-select>

    <video
      ref="videoRef"
      autoplay
      muted
      playsinline
      style="width: 100%; margin-top: 10px"
    ></video>

    <p>Scanned Code: {{ code }}</p>
  </div>
</template>
