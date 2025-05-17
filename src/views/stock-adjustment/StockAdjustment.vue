<template>
  <ion-page>
    <ToolBar>{{ t("Stock Adjustment") }}
    </ToolBar>
    <ion-content class="ion-padding">

      <div class="product-select-with-scan">
        <!-- Custom Select -->

        <ComSelect csClass="search-by-product" ref="productSelect" docType="Product" v-model="selectedProduct"
          :filters="[['is_inventory_product','=',1],['disabled','=',0]]"
          @onSelected="onSelectProduct">
          <ion-icon class="magin-right" slot="icon-only" :icon="search"></ion-icon>
          <ion-text class="text-search" v-if="!productDoc?.product_name_en"> Search By Product Name ... </ion-text>
          <ion-text class="text-search" v-else> {{ productDoc?.product_code }} - {{ productDoc?.product_name_en.length >
            30
            ? productDoc?.product_name_en.slice(0, 30) + '...'
            : productDoc?.product_name_en }} </ion-text>
 <ion-button fill="clear"  @click.stop="onScanBarcode">
          <ion-icon class="border-round-xxl" slot="icon-only" :icon="scan"></ion-icon>
        </ion-button>
        </ComSelect>
        <!-- Scan Button -->
       
      </div>
      <div class="relative fixed-input mt-2">
        <div>
          <ComSelect csClass="search-by-product
                    " docType="Stock Location" :clear="false" v-model="doc.stock_location" modalType="Dialog"
            @onSelected="onSelectWarehouse">
            <ion-icon class="magin-right" slot="icon-only" :icon="storefrontOutline"></ion-icon>
            <span v-if="!doc?.stock_location" class=" text-search">
              {{ t('Pleas Select Stock Location') }}
            </span>
            <span class=" text-search">
              {{ doc?.stock_location }}
            </span>

          </ComSelect>
        </div>
      </div>
      <ion-card v-if="productDoc" class="mt-3 m-0">
        <div v-if="productDoc?.photo" class="flex justify-content-center m-2">
  <Img
    v-if="productDoc?.photo"
     class="w-full h-full object-cover max-image"
    :src="productDoc.photo"
    :key="productDoc.photo"
  />
</div>

        <ion-card-header class="pb-1 pt-3 px-3">
          <div>
            <strong>{{ productDoc?.product_name_en }}</strong>
          </div>
        </ion-card-header>

        <ion-card-content>
          <ion-item lines="none" class="product-row ion-no-padding">
            <ion-label class="col-label">
              <ion-text class="label-text" color="medium">Code</ion-text>
              <ion-text class="value-text">{{ productDoc?.product_code }}</ion-text>
            </ion-label>

            <ion-label class="col-label ion-text-end">
              <ion-text class="label-text" color="medium">Name Kh</ion-text>
              <ion-text class="value-text ellipsis-text">{{ productDoc?.product_name_kh }}</ion-text>
            </ion-label>
          </ion-item>
          <ion-item lines="none" class="product-row ion-no-padding">
            <ion-label class="col-label">
              <ion-text class="label-text" color="medium">Product Category</ion-text>
              <ion-text class="value-text">{{ productDoc?.product_category }}</ion-text>
            </ion-label>

            <ion-label class="col-label ion-text-end">
              <ion-text class="label-text" color="medium">Unit</ion-text>
              <ion-text class="value-text ellipsis-text">{{ productDoc?.unit }}</ion-text>
            </ion-label>
          </ion-item>
          <ion-item lines="none" class="product-row ion-no-padding">
            <ion-label class="col-label">
              <ion-text class="label-text" color="medium">Current Quantity</ion-text>
              <ion-text class="value-text"><ComNumber :value="doc?.current_quantity"/></ion-text>
            </ion-label>

            <ion-label class="col-label ion-text-end">
              <ion-text class="label-text" color="medium">Current Cost</ion-text>
              <ion-text class="value-text ellipsis-text"><ComCurrency :value="doc?.current_cost"/></ion-text>
            </ion-label>
          </ion-item>
  </ion-card-content>
</ion-card>
<ion-card v-if="doc.stock_location" class="mt-3 m-0">
<ion-card-content>
            <stack class="pt-3" gap="10px" v-if="doc.product_code">
            
            <com-input type="number" :label="t('New Quantity')"
             :placeholder="t('New Quantity')" v-model="doc.new_quantity"
             :minFractionDigits="_app.setting.float_precision"
                label-placement="floating" fill="outline" mode="md"  ></com-input>
             
                <Message severity="info" v-if="(_app.getNumber(doc.new_quantity - doc.current_quantity,_app.setting.float_precision))!=0" >{{ t("Different Quantity") }}: <ComNumber :value="doc.new_quantity - doc.current_quantity"/></Message>


            <com-input :minFractionDigits="_app.setting.currency_precision"  type="number" label="New Cost" placeholder="New Cost" v-model="doc.new_cost"
                label-placement="floating" fill="outline" mode="md"></com-input>
                <Message severity="info" v-if="(doc.new_cost - doc.current_cost)!=0" >{{ t("Different Cost") }}: <ComCurrency :value="doc.new_cost - doc.current_cost"/></Message>

            
               
          <ion-textarea fill="outline" label="Note" label-placement="floating" rows="5"
          :value="doc.note"
          @ionInput="e => doc.note = e.target.value" mode="md"></ion-textarea>
        </stack>

        </ion-card-content>
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
import {useStockAdjustment} from "@/hooks/useStockAdjustment.js"
 
import Message from 'primevue/message';
import { onMounted } from 'vue';

const t = window.t;
const _app = app;

const { doc, productDoc, loadData, getStockLocationProduct, onCancel, onSave } = useStockAdjustment()
async function onScanBarcode() {
  const result = await app.onScanBarcode();
  if(result){
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


onMounted(async ()=>{
   
  if(app.route.params.product_code){
    doc.value.product_code = app.route.params.product_code
    await loadData();
  }

})


 
</script>
<style scoped>
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
