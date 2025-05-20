<script setup>
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const videoRef = ref(null);
const code = ref('');
const devices = ref([]);
const selectedDeviceId = ref(null);

let codeReader;

const initScanner = async (deviceId = null) => {
  if (codeReader) {
    codeReader.reset();
  }

  codeReader = new BrowserMultiFormatReader();

  try {
    await codeReader.decodeFromVideoDevice(deviceId, videoRef.value, (result, err) => {
      if (result) {
        code.value = result.getText();
      }
    });
  } catch (error) {
    console.error('Error starting scanner:', error);
  }
};

const getCameras = async () => {
  const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
  devices.value = videoInputDevices;
  if (videoInputDevices.length > 0) {
    selectedDeviceId.value = videoInputDevices[0].deviceId;
    await initScanner(selectedDeviceId.value);
  }
};

const changeCamera = async () => {
  await initScanner(selectedDeviceId.value);
};

onMounted(async () => {
  await getCameras();
});

onBeforeUnmount(() => {
  codeReader?.reset();
});
</script>

<template>
  <div>
    <label>Select Camera:</label>
    <select v-model="selectedDeviceId" @change="changeCamera">
      <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
        {{ device.label || 'Camera ' + device.deviceId }}
      </option>
    </select>

    <video ref="videoRef" style="width: 100%; margin-top: 10px;"></video>
    <p>Scanned Code: {{ code }}</p>
  </div>
</template>
