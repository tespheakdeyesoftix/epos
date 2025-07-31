<template>

<ion-card button class="card-product" :style="{height:(userPreference?.sale_ui_setting?.product_card_height || '150') + 'px',background:'blue'}"  @click="onSelectProduct(data)">
      <ion-card-content class="content-product" >
    <div v-if="plateform == 'mobile'" style="display: flex; align-items: center; gap: 10px;">
      <Img :src="data.photo" alt="Image" style="width: 100%; height: 60px;" />
      <div>
        <ion-card-subtitle>{{ data.name }}</ion-card-subtitle>
        <ion-card-subtitle>{{ data.product_name_en }}</ion-card-subtitle>
        <ion-card-subtitle>
             {{t("Price")}}
            <ComCurrency :value="data.price" />
        </ion-card-subtitle>
      </div>
    </div>
    <div v-else style="position: relative; background: red;flex: 1;height: 100%; "  >
      <Img :src="data.photo" class="img-product" alt="Image" />
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
import { useApp } from "@/hooks/useApp";
const props = defineProps({
    data:Object
})
const {userPreference} =useApp()
const {onSelectProduct} = useSaleCoupon()
 

</script>
<style scoped>
.img-product{
width: 100%;

border-radius: 10px;
}
.price-tag{
  position: absolute; 
  left:0; 
  top: 0; 
  padding:5px 20px;
  border-radius: 10px;
  background-color: var(--ion-color-danger);
  font-weight: bold;
  color: var(--ion-color-light-shade);
  font-size: 14px;
  
}
.name-product{
  background-color: var(--ion-color-light-shade);
  padding: 5px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
position: absolute;
bottom: 10px;
left: 50%;
transform: translateX(-50%);
width: 95%;
}
.content-product{
  padding: 4px;
  min-height:100px;
  max-height: 300px;
  border-radius: 10px;
}
.card-product{
  margin: 2px;
  border-radius: 10px;
  background-color: var(--ion-color-light-shade);
   display: flex; flex-direction: column;
}
</style>