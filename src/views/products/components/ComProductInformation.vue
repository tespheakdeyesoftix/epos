<template>

    <div>

        <div v-if="previewUrl">
            <img :src="previewUrl" alt="Preview" style="width:300px" />
        </div>
        <div v-else>
            <Img :src="doc?.photo" v-if="doc.photo" width="300px" />
        </div>
        <stack row :equal="true" gap="10px">
            <ion-button expand="block" @click="triggerFileInput">
                {{ t("Upload Photo") }}
            </ion-button>
            <ion-button expand="block" color="danger" @click="onRemovefile" :disabled="!doc.photo && !previewUrl">
                {{ t("Remove File") }}
            </ion-button>
        </stack>


        <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" style="display: none" />


        <stack class="ion-padding" gap="20px">
            <com-input label="Product Code" placeholder="Product Code" v-model="doc.product_code"
                    type="BarcodeScanerInput" 
                    label-placement="floating" fill="outline" 
                    @ionChange="onProductCodeChange"
                     @onBarcodeChange="onProductCodeChange" 
                    
                      />
                    <Message severity="error" style="margin-top: -10px;" v-if="warningMessage"> {{ warningMessage }}</Message>

                    <ion-input 
                        label="Product Name En" 
                        placeholder="Product Name En" 
                        v-model="doc.product_name_en"
                        label-placement="floating" 
                        fill="outline"

                    
                    >
                </ion-input>
                    <ion-input 
                    label="Product Name Kh" 
                    placeholder="Product Name Kh" 
                    v-model="doc.product_name_kh"
                    label-placement="floating" 
                    fill="outline">
                </ion-input>
 

                <ion-label>{{ t("Product Category") }}
                    <ComSelect docType="Product Category" clear v-model="doc.product_category" modalType="Dialog" />
                </ion-label>
                <!-- revenue group -->
                <ion-label>Revenue Group
                    <ComSelect docType="Revenue Group" clear v-model="doc.revenue_group" modalType="Dialog" />
                </ion-label>
                <!-- unit -->
                <ion-label>{{ t("Unit") }}
                    <ComSelect docType="Unit Of Measurement"
                     clear v-model="doc.unit" modalType="Dialog" />
                </ion-label>

                <!-- cost -->
                <ion-input type="number" :label="t('Cost')" :placeholder="t('Cost')" v-model="doc.cost"
                 label-placement="floating" 
                        fill="outline"
                ></ion-input>

                <ion-input type="number" label="Price" placeholder="Selling Price" v-model="doc.price"
                label-placement="floating" 
                fill="outline"></ion-input>

                <ion-textarea  fill="outline" label="Note" label-placement="floating" rows="5" v-model="doc.note"></ion-textarea>
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