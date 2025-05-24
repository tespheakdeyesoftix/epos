<template>
  <ion-page>
    <ToolBar>{{ t("Stock Adjustment") }}
      <template #end>
        <ComPopOver>
          <ion-button>
            <ion-icon :icon="ellipsisVertical" slot="icon-only" />
          </ion-button>
          <template #content="{ close }">
            <ion-list>
              <ion-item button :router-link="'/stock-adjustment-history'" @click="close">
                {{ t("Stock Adjustment History") }}
              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
      </template>
    </ToolBar>
    <ion-content class="ion-padding">
      <div class="product-select-with-scan">
        <!-- Custom Select -->
        <ComSelect csClass="search-by-product justify-content-between" 
        ref="productSelect" docType="Product"
          v-model="selectedProduct" @onSelected="onSelectProduct"
           :filters="[['is_inventory_product','=',1]]">
          <div class="flex align-item-center">
            <ion-icon class="magin-right" slot="icon-only" :icon="search"></ion-icon>
            <ion-text class="text-search" v-if="!productDoc?.product_name_en">
              {{ t('Search By Product Name') }}</ion-text>
            <ion-text class="text-black text-sm ml-2" v-else> {{ productDoc?.product_code }} - {{
              productDoc?.product_name_en.length >
                30
                ? productDoc?.product_name_en.slice(0, 30) + '...'
                : productDoc?.product_name_en }} </ion-text>
          </div>

          <ion-button fill="clear" @click.stop="onScanBarcode">
            <ion-icon class="border-round-xxl" slot="icon-only" :icon="scan"></ion-icon>
          </ion-button>
        </ComSelect>
        <!-- Scan Button -->

      </div>
      <div class="relative fixed-input mt-2">
        <div>
          <ComSelect csClass="search-by-product" docType="Stock Location" :clear="false" v-model="doc.stock_location"
            modalType="Dialog" @onSelected="onSelectWarehouse">
            <ion-icon class="magin-right" slot="icon-only" :icon="storefrontOutline"></ion-icon>
            <span v-if="!doc?.stock_location" class=" text-search">
              {{ t('Stock Location') }}
            </span>
            <span class="text-black text-sm ml-2">
              {{ doc?.stock_location }}
            </span>

          </ComSelect>
        </div>
      </div>
      <ion-card v-if="productDoc" class="mt-3 m-0">
        <div v-if="productDoc?.photo" class="flex justify-content-center m-2">
          <div style="padding: 5px;">
            <Img width="100%" v-if="productDoc?.photo" :src="productDoc.photo" :key="productDoc.photo" />
          </div>
        </div>
         <div style="font-size: 18px;text-align: center;margin-top: -25px;">
            <p>{{ productDoc?.product_code }} - {{ productDoc?.product_name_en }}</p>
          </div>
           <div style="font-size: 18px;text-align: center;margin-top: -10px;margin-bottom: -10px;">
            <p><ComNumber :value="doc?.current_quantity"/> {{ productDoc?.unit }} / <ComCurrency :value="doc?.current_cost"/></p>
          </div>
        
</ion-card>
<ion-card v-if="doc.stock_location && doc.product_code" class="mt-3 m-0">
<ion-card-content>
<div style="display: flex;" class="pt-3" gap="10px" v-if="doc.product_code">
  <div style="margin-right: 15px;margin-top: -10px;">
    <com-input type="number" :label="t('New Quantity')" :placeholder="t('New Quantity')" v-model="doc.new_quantity" :minFractionDigits="_app.setting.float_precision" label-placement="floating" fill="outline" mode="md"  ></com-input>  
     

      <div class="diff-message" v-if="(_app.getNumber(doc.new_quantity - doc.current_quantity,_app.setting.float_precision))!=0">
        {{ t("Different") }}: <ComNumber :value="doc.new_quantity - doc.current_quantity"/>
      </div>
  </div>
  <div style="margin-right: 5px;margin-top: -10px;">
    <com-input :minFractionDigits="_app.setting.currency_precision"  type="number" :label="t('New Cost')" :placeholder="t('New Cost')" v-model="doc.new_cost" label-placement="floating" fill="outline" mode="md"></com-input> 
      <div  v-if="(doc.new_cost - doc.current_cost)!=0" class="diff-message">
        {{ t("Different") }}: <ComCurrency :value="doc.new_cost - doc.current_cost"/>
      </div>
  </div>
</div>
</ion-card-content>
<div style="margin-left: 15px;margin-right: 15px;margin-bottom: 15px;">
  <ion-textarea fill="outline" :label="$t('Note')" label-placement="floating" rows="5" :value="doc.note" @ionInput="e => doc.note = e.target.value" mode="md"></ion-textarea>
</div>
</ion-card>
    
      

    </ion-content>
    <ion-footer>
      <ion-toolbar color="tranparency">
        <stack row :equal="true" gap="10px">
          <ion-button @click="onCancel" shape="round" color="danger" expand="full">{{ t("Cancel")
          }}</ion-button>
          <ion-button @click="onSave" shape="round" color="success" expand="full">{{ t("Save")
          }}</ion-button>
        </stack>

      </ion-toolbar>
    </ion-footer>
  </ion-page>

</template>
<script setup>
import { scan, search, storefront, storefrontOutline } from 'ionicons/icons';
import { useStockAdjustment } from "@/hooks/useStockAdjustment.js"

import Message from 'primevue/message';
import { onMounted } from 'vue';

import { ellipsisVertical, timeOutline } from 'ionicons/icons'
const t = window.t;
const _app = app;

const { doc, productDoc, loadData, getStockLocationProduct, onCancel, onSave } = useStockAdjustment()
async function onScanBarcode() {
  const result = await app.onScanBarcode();
  if (result) {
    doc.value.product_code = result
    await loadData();
  }


}



async function onSelectWarehouse(data) {


  doc.value.stock_location = data.name

  if (doc.value.product_code) {
    const loading = await app.showLoading();
    await getStockLocationProduct();
    await loading.dismiss();
  }
}

async function onSelectProduct(data) {
  doc.value.product_code = data.name
  await loadData();
}


onMounted(async () => {

  if (app.route.params.product_code) {
    doc.value.product_code = app.route.params.product_code
    await loadData();
  }

})



</script>
<style scoped>
.diff-message {
  font-size: 14px;
  text-align: center;
  color: #00aaff;
  margin-top: 2px;
  margin-bottom: -5px;
}

.product-select-with-scan {
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-by-product {
  width: 100%;
  display: flex !important;
  padding: 0;
  height: 34px;
  border-radius: 53px;
  padding-left: 12px;
  background: #e7e7e7;
  align-content: center;
  align-items: center;
  border: 1px solid #afafaf;
}

.text-search {
  margin-left: 6px;
  font-size: 12px;
  color: #808080;
}


.product-row {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  margin: 0;
}

.col-label {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 1px !important;
  margin-top: 3px !important;
  min-width: 0;
}

.max-image {
  max-height: 150px;
  object-fit: contain;
}

.label-text {
  font-size: 12px;
  line-height: 1;
}

.value-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.2;
}

.ellipsis-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
