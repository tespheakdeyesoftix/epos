<template>
  <ion-page>
    <ToolBar>
      <template v-if="!doc.name">
        {{ t("Add Product") }}
      </template>
      <template v-else>
        {{ doc.name  }} - {{ doc.product_name_en }}
      </template>
      

      <template #end>
       
        <ion-button v-if="doc.name" @click="onOpenActionMenu($event)">
          <ion-icon :icon="ellipsisVertical" slot="icon-only" />
        </ion-button>
      </template>
    </ToolBar>
    <ion-content color="light">
     
      <ion-segment style="margin-top: 10px;">
        <ion-segment-button value="product_information" content-id="product_information">
          <ion-label>{{ t("Product Information") }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="product_price" content-id="product_price">
          <ion-label>{{ t("Prices") }}</ion-label>
        </ion-segment-button>

      </ion-segment>
      <ion-segment-view>
        <ion-segment-content id="product_information">
          <ComProductInformation />
        </ion-segment-content>
        <ion-segment-content id="product_price">
          <ComProductPrice />
        </ion-segment-content>
      </ion-segment-view>
    </ion-content>
    <ion-footer>
      <ion-toolbar color="tranparency">
        <stack row :equal="true" gap="10px">
          <ion-button :disabled="!doc.name"  @click="onDelete" shape="round" color="danger" expand="full">{{ t("Delete")
          }}</ion-button>
        <ion-button   @click="onSave" shape="round" color="success" expand="full">{{ t("Save")
          }}</ion-button>
        </stack>
     
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import { useAddProduct } from "@/hooks/useAddProduct.js"

import ComProductInformation from '@/views/products/components/ComProductInformation.vue';
import ComProductPrice from '@/views/products/components/ComProductPrice.vue';
import { ellipsisVertical } from 'ionicons/icons'
import { useRouter } from 'vue-router';
import ComProductActionMenu from "@/views/products/components/ComProductActionMenu.vue"
const vue_router = useRouter();

import { useIonRouter } from '@ionic/vue';

import { useRoute } from 'vue-router';
const route = useRoute();

const ionRouter = useIonRouter();
const t = window.t;



const { previewUrl, handleFileChange, startUpload, loadDoc, doc, selectedFile, onSave, navigation, resetDoc,
  onRemovefile, router,
  onDelete
} = useAddProduct();
navigation.value = ionRouter
router.value = vue_router;


function onOpenActionMenu($event){
  app.openPopOver({
    component:ComProductActionMenu,
    componentProps:{
      product: doc.value
    }
  }, $event)
}

 

onMounted(async () => {

   
 
  if (route.params?.name) {
    await loadDoc(route.params?.name)
  }




})

onUnmounted(() => {
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