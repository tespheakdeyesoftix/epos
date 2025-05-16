<template>
    <ion-page>
        <ToolBar>{{ t("Stock Adjustment") }}</ToolBar>
        <ion-content class="ion-padding">
 
            <ComSelect docType="Product" @onSelected="onSelectProduct" >
                select 
            </ComSelect>
            
           
            <ion-button  @click="onScanBarcode"  >
                Scan Barcode
      <ion-icon slot="icon-only"  :icon="scan"></ion-icon>
    </ion-button>

    <hr/>
   
        <div class="relative fixed-input">
                <ion-input :label="t('Stock Location')" value="value" label-placement="floating" fill="outline">
                </ion-input>
                <div class="selected_value">
                    <ComSelect docType="Stock Location" :clear="false" v-model="doc.stock_location" modalType="Dialog" @onSelected="onSelectWarehouse" />
                </div>
            </div> 
            <stack class="pt-3" gap="20px" v-if="doc.product_code">
            <com-input :label="t('Product Code')" placeholder="Product Code" v-model="doc.product_code"
                 label-placement="floating" fill="outline"  readonly/>
          
            <ion-input :label="t('Product Name En')" placeholder="Product Name En" v-model="productDoc.product_name_en"
                label-placement="floating" fill="outline" readonly >
            </ion-input>
            <ion-input label="Product Name Kh" placeholder="Product Name Kh" v-model="productDoc.product_name_kh"
                label-placement="floating" fill="outline" readonly>
            </ion-input>
            <ion-input label="Product Category" placeholder="Product Category" v-model="productDoc.product_category"
                label-placement="floating" fill="outline" readonly>
            </ion-input>
            <ion-input label="Unit" placeholder="Unit" v-model="productDoc.unit"
                label-placement="floating" fill="outline" readonly>
            </ion-input>
             
            <ion-input type="Number" :label="t('Current Quantity')" :placeholder="t('Current Quantity')" v-model="doc.current_quantity"
                label-placement="floating" fill="outline" readonly></ion-input>
                
            <ion-input type="Number" :label="t('New Quantity')"
             :placeholder="t('New Quantity')" v-model="doc.new_quantity"
                label-placement="floating" fill="outline"  ></ion-input>

            <ion-input type="Number" label="Current Cost" placeholder="Current Cost" v-model="doc.current_cost"
                label-placement="floating" fill="outline" readonly></ion-input>
                

            <ion-input type="Number" label="New Cost" placeholder="New Cost" v-model="doc.new_cost"
                label-placement="floating" fill="outline"></ion-input>

            <ion-textarea fill="outline" label="Note" label-placement="floating" rows="5"
                v-model="doc.note"></ion-textarea>
        </stack>

        </ion-content>
        <ion-footer>
      <ion-toolbar color="tranparency">
        <stack row :equal="true" gap="10px">
          <ion-button @click="onCancel"  shape="round" color="danger" expand="full">{{ t("Cancel")
          }}</ion-button>
        <ion-button @click="onSave"   shape="round" color="success" expand="full">{{ t("Save")
          }}</ion-button>
        </stack>
     
      </ion-toolbar>
    </ion-footer>
    </ion-page>

</template>
<script setup>
import { scan } from 'ionicons/icons';
import {useStockAdjustment} from "@/hooks/useStockAdjustment.js"
 
const t = window.t;

const {doc,productDoc,loadData,getStockLocationProduct,onCancel,onSave} = useStockAdjustment()
async function onScanBarcode() {
  const result = await app.onScanBarcode();
  doc.value.product_code = result
  await loadData();

}



async function onSelectWarehouse(data){
    

    doc.value.stock_location = data.name

    if(doc.value.product_code){
        const loading = await app.showLoading();
        await getStockLocationProduct();
        await loading.dismiss();
    }
}

async function onSelectProduct(data){
    doc.value.product_code = data.name
    await loadData();
}


 
</script>
