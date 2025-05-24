<template>
    <ion-card v-for="(p, index) in doc.product_price" :key="index">
        <ion-card-header>
            <div style="display: flex;width: 100%;margin-bottom: 5px;">
                <div style="width: 100%;margin-top: 10px;">
                    <ion-card-title>{{ t("Product Price") }}: {{ index + 1 }}</ion-card-title>
                </div>
                <div>
                    <button class="overlay-button" @click="DeletePrice(index)" v-if="doc?.photo">
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
            </div>
           
        </ion-card-header>
        <ion-card-content>
            <Stack gap="5px">
                <com-input label="Barcode" placeholder="Product Code" v-model="p.barcode" type="BarcodeScanerInput"
                    label-placement="floating" fill="outline" />
                <!-- price rule -->
                <ComSelectInput docType="Price Rule"  v-model="p.price_rule" :label="t('Price Rule')" />
                 <!-- unit -->
                <ComSelectInput docType="Unit Of Measurement"  v-model="p.unit" :label="t('Unit')" />
                <!-- ocnversion factor -->
                <ion-input type="number" :label="t('Conversion Factor')" :placeholder="t('Conversion Factor')"
                    v-model="p.conversion_factor" label-placement="floating" fill="outline"></ion-input>
                <!-- price -->
                <ion-input style="margin-bottom: 5px;" type="number" :label="t('Price')" :placeholder="t('Price')" v-model="p.price"
                    label-placement="floating" fill="outline"></ion-input>
            </Stack>
        </ion-card-content>
    </ion-card>

    <ion-button shape="round" class="ion-margin" expand="full" @click="AddPrice">{{ t("Add Price") }}</ion-button>

</template>
<style scoped>
.overlay-button {
  position: absolute;
  top: 15px;
  right: 15px;
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
import Stack from "@/views/components/public/Stack.vue"
const { doc } = useAddProduct();


const t = window.t;
function AddPrice() {
    doc.value.product_price.push({
        portion: "Normal",
        conversion_factor: 1,
        unit: 'Unit',
        price: 0
    })
}
function DeletePrice(index) {
    doc.value.product_price.splice(index, 1)
}


</script>