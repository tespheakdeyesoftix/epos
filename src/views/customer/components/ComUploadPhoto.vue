<template>
  <ion-button color="primary" @click="triggerFileInput('brows')">{{ t("Upload Photo") }}</ion-button> 
  <!-- <ion-button color="primary" @click="triggerFileInput('camera')" :disabled="true">{{ t("Take Photo") }}</ion-button>  -->

  <input type="file" ref="fileInput" style="display: none" @change="onFileChange($event, 'brows')" />
  <input type="file" ref="fileInputCamera" style="display: none" accept="image/*" capture="environment" @change="onFileChange($event, 'camera')" />
</template>

<script setup>
import { ref } from 'vue'
const t = window.t;

const props = defineProps({
  customerName: String 
});
const emit = defineEmits(["uploaded"])

const fileInput = ref(null)
const fileInputCamera = ref(null)

const triggerFileInput = (type = 'brows') => {
  if (type === 'brows') fileInput.value?.click()
  else fileInputCamera.value?.click()
}

defineExpose({ triggerFileInput })

const onFileChange = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result;

    const loading = await app.showLoading("Uploading...");
    const res = await app.updateDoc("Customer", props.customerName, { photo: base64 });

    await loading.dismiss();

    if (res?.data) {
      app.showSuccess(t("Photo updated successfully"));
      emit("uploaded", res.data.photo); 
    } else {
      app.showWarning(t("Failed to upload photo"));
    }
  };

  reader.readAsDataURL(file);
}
</script>
