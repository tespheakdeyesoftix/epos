<template>
    <div class="p-3">
        <div class="image-container" v-if="previewUrl">
            <img :src="previewUrl" class="image"/>
            <button class="overlay-button" @click="onRemovefile" v-if="previewUrl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 
                        .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 
                        1 0V6z"/>
                <path fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 
                        1-2-2V4h-.5a1 1 0 0 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 
                        1 1 1h2.5a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 
                        0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 
                        3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11z"/>
                </svg>
            </button>
        </div>
        <div class="image-container" v-else>
            <Img :src="doc?.photo" class="image" v-if="doc?.photo"/>
            <Img src="/files/placeholder.jpg" alt="Preview" v-else style="width:300px" class="image" />
            <button class="overlay-button" @click="onRemovefile" v-if="doc?.photo">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 
                        .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 
                        1 0V6z"/>
                <path fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 
                        1-2-2V4h-.5a1 1 0 0 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 
                        1 1 1h2.5a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 
                        0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 
                        3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11z"/>
                </svg>
            </button>
        </div>
        <stack row equal>
            <ion-button   style="margin-top: 10px;margin-bottom: 10px;" expand="block" @click="triggerFileInput('brows')">
            {{ t("Upload Photo") }}
        </ion-button>
        
            <ion-button   style="margin-top: 10px;margin-bottom: 10px;" expand="block" @click="triggerFileInput('camera')">
                
            {{ t("Take Photo") }}
        </ion-button>

      
        </stack>
        
  
        <input ref="fileInput"   type="file" accept="image/*" @change="handleFileChange" style="display: none" />
        <input ref="fileInputCamera"  capture="environment" type="file" accept="image/*" @change="handleFileChange" style="display: none" />
        <div>
            <com-input class="input-field" :label="t('Product Code')" v-model="doc.product_code" type="BarcodeScanerInput" label-placement="floating" fill="outline" @ionChange="onProductCodeChange" @onBarcodeChange="onProductCodeChange" />
            <div v-if="warningMessage" >
                <Message v-if="warningMessage" severity="error"  style="margin-top: 5px;margin-bottom:-5px;display: flex;justify-content: center;">
                    <div style="font-size: 14px;">{{ warningMessage }}</div>
                </Message>
            </div>
            <ion-input class="input-field" :label="t('Product Name En')" v-model="doc.product_name_en"
                label-placement="floating" fill="outline">
            </ion-input>
            <ion-input class="input-field" :label="t('Product Name Kh')" v-model="doc.product_name_kh"
                label-placement="floating" fill="outline">
            </ion-input>

            <div class="input-field">
                <ComSelectInput docType="Product Category"  v-model="doc.product_category" :label="t('Product Category')" />
            </div>
            <div class="input-field">
                <ComSelectInput docType="Revenue Group"  v-model="doc.revenue_group" :label="t('Revenue Group')" />
            </div>
            <div class="input-field">
                <ComSelectInput docType="Unit Of Measurement"  v-model="doc.unit" :label="t('Unit')" />
            </div>
            
            <ion-input class="input-field" style="margin-top: 10px;" type="number" :readonly="doc.name" :label="t('Cost')" v-model="doc.cost" label-placement="floating" fill="outline"></ion-input>
            <ion-input class="input-field" type="number" :label="t('Price')" v-model="doc.price" label-placement="floating" fill="outline"></ion-input>
            <ion-textarea class="input-field" fill="outline" :label="t('Note')" label-placement="floating" rows="5" v-model="doc.note"></ion-textarea>
        </div>
    </div>
</template>
<style scoped>

.input-field{
    margin-top: 10px;
}
.image-container {
  position: relative;
  max-width: 250px;
  min-height: 250px;
  margin-bottom: 10px;
  margin: 0 auto;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
}

.image {
  width: 100%;
  height: 100%;
  min-height: 250px;
  max-width: 250px;
  display: block;
  border-radius: 8px;
  object-fit: cover;
}

.overlay-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #d2000f;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 10px;
  opacity: 90%;
}

.overlay-button:hover {
  background-color: #ff424f;
}

.overlay-button:active {
  background-color: #9e000b;
}
</style>
<script setup>

import { useAddProduct } from "@/hooks/useAddProduct.js"
import Stack from "@/views/components/public/Stack.vue";

const { previewUrl, warningMessage,
    handleFileChange, onProductCodeChange, startUpload, loadDoc, doc, selectedFile, onSave, navigation, resetDoc,
    onRemovefile
} = useAddProduct();

import Message from 'primevue/message';
import { ref } from "vue";
 
const fileInput = ref(null)
const fileInputCamera = ref(null)
const t = window.t;
const triggerFileInput = (type='brows') => {
    if(type=="brows"){
        fileInput.value.click()
    }else {
        fileInputCamera.value.click()
    }
    
}
</script>