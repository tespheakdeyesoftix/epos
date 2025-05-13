<template>
  <ion-page>
    <ToolBar>{{ t("Add Product") }}</ToolBar>
    <ion-content>
      
      <div>
       
        <div v-if="previewUrl" >
          <img :src="previewUrl" alt="Preview" style="width:300px" />
        </div>
        <div v-else>
          <Img :src="doc?.photo" v-if="doc.photo"  width="300px"/>
        </div>
        <div class="button-row">
    <ion-button expand="block" @click="triggerFileInput">
      {{ t("Upload Photo") }}
    </ion-button>
    <ion-button expand="block" color="danger" @click="onRemovefile" :disabled="!doc.photo && !previewUrl">
      {{ t("Remove File") }}
    </ion-button>
  </div>
  <input
    ref="fileInput"
    type="file"
    accept="image/*"
    @change="handleFileChange"
    style="display: none"
  />


        <ion-list>
          <ion-item>
           <com-input label="Product Code" placeholder="Product Code" v-model="doc.product_code" type="BarcodeScanerInput" />

          </ion-item>
          <ion-item>
            <ion-input label="Product Name En" placeholder="Product Name En" v-model="doc.product_name_en"
              label-placement="fixed"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input label="Product Name Kh" placeholder="Product Name Kh" v-model="doc.product_name_kh"
              label-placement="fixed"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>{{ t("Product Category") }}
              <ComSelect docType="Product Category" clear v-model="doc.product_category" modalType="Dialog" />
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Revenue Group
              <ComSelect docType="Revenue Group" clear v-model="doc.revenue_group" modalType="Dialog" />
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-input type="number" label="Price" placeholder="Selling Price" v-model="doc.price"
              label-placement="fixed"></ion-input>
          </ion-item>
        </ion-list>
         
      </div>
     
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button class="ion-margin" @click="onSave" shape="round" expand="full" size="large">{{ t("Save")
          }}</ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import { useAddProduct } from "@/hooks/useAddProduct.js"
import ComSelect from '../components/ComSelect.vue';

import { useIonRouter } from '@ionic/vue';
 
import { useRoute } from 'vue-router';
const route = useRoute();
const fileInput = ref(null)
const ionRouter = useIonRouter();
const t = window.t;

const { previewUrl, handleFileChange, startUpload, loadDoc, doc, selectedFile, onSave, navigation,resetDoc,
  onRemovefile
 } = useAddProduct();
navigation.value = ionRouter

const triggerFileInput = () => {
  fileInput.value.click()
}

onMounted(async () => {
  if (route.params?.name) {
    await loadDoc(route.params?.name)
  }

})

onUnmounted(()=>{
  resetDoc()
})



</script>
<style scoped>
.wide-label {
  --label-width: 140px;
}
.button-row {
  display: flex;
  gap: 8px;
}
.button-row ion-button {
  flex: 1;
}

</style>