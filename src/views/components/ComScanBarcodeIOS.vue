
<template>
  <div>
    <label>Select Camera:</label>
    <select v-model="selectedDeviceId" @change="switchCamera">
      <option
        v-for="device in devices"
        :key="device.deviceId"
        :value="device.deviceId"
      >
        {{ device.label || 'Camera' }}
      </option>
    </select>

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

<script setup>
import { BrowserMultiFormatReader   } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library' 
import { ref, onMounted, onBeforeUnmount } from 'vue';
import beep from '/assets/beep.mp3'

const hints = new Map()
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    

  ])

const videoRef = ref(null);
const code = ref('');
const devices = ref([]);
const selectedDeviceId = ref(null);
const beepSound = new Audio(beep)
let codeReader = new BrowserMultiFormatReader(hints);
let currentStream = null;

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

  try {
    const constraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        facingMode: 'environment',
    width: { ideal: 640 },
    height: { ideal: 480 },
      }
    };

    await codeReader.decodeFromConstraints(constraints, videoRef.value, (result) => {
      if (result) {
        code.value = result.getText();
        beepSound.currentTime = 0
        beepSound.play()
      }
    });

    currentStream = videoRef.value?.srcObject;
  } catch (err) {
    console.error('Failed to start scanner:', err);
  }
};

const getCameras = async () => {
  const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
  devices.value = videoDevices;

  // Default to back camera if available
  const backCamera = videoDevices.find(device =>
    device.label.toLowerCase().includes('back') ||
    device.label.toLowerCase().includes('environment')
  );

  selectedDeviceId.value = backCamera?.deviceId || videoDevices[0]?.deviceId;

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
