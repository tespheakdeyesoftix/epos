<template>

<ion-card button  @click="onSelectProduct(data)">
      <ion-card-content>
    <div style="display: flex; align-items: center; gap: 16px;">
      <img :src="data.photo" alt="Image" style="width: 100px; height: 60px;" />

      <div>
        <ion-card-subtitle>{{ data.name }}</ion-card-subtitle>
        <ion-card-subtitle>{{ data.product_name_en }}</ion-card-subtitle>
        <ion-card-subtitle>
             {{t("Price")}}
            <ComCurrency :value="data.price" />
        </ion-card-subtitle>
      </div>
    </div>
  </ion-card-content>
</ion-card>
    </template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const t = window.t;
import ComCurrency from "@/views/components/public/ComCurrency.vue"
const props = defineProps({
    data:Object
})

const {onSelectProduct} = useSaleCoupon()
 

</script>
