<template>
    <div class="p-3">
        
        <div class="my-2 flex justify-content-center" v-if="previewUrl">
            <div class="border-1 p-2 border-round border-300">
                <img :src="previewUrl" alt="Preview" style="width:300px" />
            </div>
        </div>
        <div class="my-2 flex justify-content-center" v-else>
            <div class="border-1 p-2 border-round border-300">
                <Img class="border-round" :src="doc?.photo" v-if="doc.photo" width="300px" />
                <img src="/assets/placeholder.jpg" alt="Preview" v-else style="width:300px" />
            </div>
        </div>
        <stack row :equal="true" gap="10px">
            <ion-button expand="block" @click="triggerFileInput">
                {{ t("Upload Photo") }}
            </ion-button>
            <ion-button expand="block" color="danger" @click="onRemovefile" :disabled="!doc.photo && !previewUrl">
                {{ t("Remove File") }}
            </ion-button>
        </stack>
        <input ref="fileInput" type="file" accept="image/*"       
  
        @change="handleFileChange" style="display: none" />
        <stack class="pt-3" gap="20px">
            <com-input :label="t('Product Code')" placeholder="Product Code" v-model="doc.product_code"
                type="BarcodeScanerInput" label-placement="floating" fill="outline" @ionChange="onProductCodeChange"
                @onBarcodeChange="onProductCodeChange" />
            <Message severity="error" style="margin-top: -10px;" v-if="warningMessage"> {{ warningMessage }}</Message>

            <ion-input :label="t('Product Name En')" placeholder="Product Name En" v-model="doc.product_name_en"
                label-placement="floating" fill="outline">
            </ion-input>
            <ion-input :label="t('Product Name Kh')" placeholder="Product Name Kh" v-model="doc.product_name_kh"
                label-placement="floating" fill="outline">
            </ion-input>

            <ComSelectInput  docType="Product Category"  v-model="doc.product_category" 
            :label="t('Product Category')" placeholder="Product Category"
            />
            <ComSelectInput  docType="Revenue Group"  v-model="doc.revenue_group" 
            :label="t('Revenue Group')" placeholder="Revenue Group"
            />
            <ComSelectInput  docType="Unit Of Measurement"  v-model="doc.unit" 
            :label="t('Unit')" placeholder="Unit"
            />
                 
           
            <ion-input type="number" :readonly="doc.name" :label="t('Cost')" :placeholder="t('Cost')" v-model="doc.cost"
                label-placement="floating" fill="outline"></ion-input>
            <ion-input type="number" :label="t('Price')" placeholder="Selling Price" v-model="doc.price"
                label-placement="floating" fill="outline"></ion-input>
            <ion-textarea fill="outline" :label="t('Note')" label-placement="floating" rows="5"
                v-model="doc.note"></ion-textarea>
        </stack>
    </div>
</template>
<script setup>

import { useAddProduct } from "@/hooks/useAddProduct.js"

const { previewUrl, warningMessage,
    handleFileChange, onProductCodeChange, startUpload, loadDoc, doc, selectedFile, onSave, navigation, resetDoc,
    onRemovefile
} = useAddProduct();

import Message from 'primevue/message';
import { ref } from "vue";
 
const fileInput = ref(null)
const t = window.t;
const triggerFileInput = () => {
    fileInput.value.click()
}


</script>