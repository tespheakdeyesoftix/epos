<template>
    <ion-card v-for="(p, index) in doc.product_price" :key="index">
        <ion-card-header>
            <ion-card-title>{{ t("Product Price:") }} {{ index + 1 }}</ion-card-title>

        </ion-card-header>
        <ion-card-content>
            <Stack gap="10px">
                <com-input label="Barcode" placeholder="Product Code" v-model="p.barcode" type="BarcodeScanerInput"
                    label-placement="floating" fill="outline" />
                <!-- price rule -->
                <div class="relative fixed-input">
                    <ion-input :label="t('Price Rule')" value="value" label-placement="floating"
                        fill="outline"></ion-input>
                    <div class="selected_value">
                        <ComSelect docType="Price Rule" clear v-model="p.price_rule" modalType="Dialog" />
                    </div>
                </div>

                <!-- unit -->
                <div class="relative fixed-input">
                    <ion-input :label="t('Unit')" value="value" label-placement="floating" fill="outline"></ion-input>
                    <div class="selected_value">
                        <ComSelect docType="Unit Of Measurement" clear v-model="p.unit" modalType="Dialog" />
                    </div>
                </div>
                <!-- ocnversion factor -->
                <ion-input type="number" :label="t('Conversion Factor')" :placeholder="t('Conversion Factor')"
                    v-model="p.conversion_factor" label-placement="floating" fill="outline"></ion-input>
                <!-- price -->
                <ion-input type="number" :label="t('Price')" :placeholder="t('Price')" v-model="p.price"
                    label-placement="floating" fill="outline"></ion-input>
            </Stack>


        </ion-card-content>
        <ion-button shape="round" class="ion-margin" color="danger" fill="solid" @click="DeletePrice(index)">{{
            t("Delete Price") }}</ion-button>
    </ion-card>

    <ion-button shape="round" class="ion-margin" expand="full" @click="AddPrice">{{ t("Add Price") }}</ion-button>

</template>
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