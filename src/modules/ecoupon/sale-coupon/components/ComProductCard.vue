<template>

<ion-card button  @click="onSelectProduct(data)">
      <ion-card-content>
    <div v-if="plateform == 'mobile'" style="display: flex; align-items: center; gap: 10px;">
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
    <div v-else style="position: relative;" >
      <img :src="data.photo" class="img-product" alt="Image"/>
      <div class="price-tag" >
        <ion-text class="ion-text-bold">
          <ComCurrency :value="data.price" />
        </ion-text>
     
      </div>
      <div style="text-align: center;">
        <ion-card-subtitle>
          <div class="name-product">
<ion-text>
            {{ data.name }} - {{ data.product_name_en }}</ion-text>
          </div>
          
          </ion-card-subtitle>
      </div>
    </div>
  </ion-card-content>
</ion-card>
    </template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const t = window.t;
import { onMounted, onUnmounted, ref } from "vue"
const plateform = ref(app.utils.getPlateform())
import ComCurrency from "@/views/components/public/ComCurrency.vue"
const props = defineProps({
    data:Object
})

const {onSelectProduct} = useSaleCoupon()
 

</script>
<style scoped>
.img-product{
width: 100%;
max-height: 180px;
min-height: 180px;
border-radius: 20px;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.price-tag{
  position: absolute; 
  right:0; 
  top: 0; 
  padding:5px 20px;
  border-radius: 10px;
  background-color: var(--ion-color-danger);
  font-weight: bold;
  color: white;
  font-size: 18px;
}
.name-product{
  background-color: var(--ion-color-light-shade);
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
}

</style>