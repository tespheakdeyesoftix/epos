<template>
   
    <div  v-if="saleDoc.sale_products.length>0">
      <div @click="toggle(index)" v-for="(sp,index) in saleDoc.sale_products"  :key="index" >
<ComSaleProductCouponCard  :activeIndex="activeIndex" :index="index"  :data="sp" />
</div>
</div>
<div  v-else>
  <div class="ion-text-center ion-justify-content-center ion-align-items-center" style="display: flex; flex-direction: column; height: 100%;">
    <ion-icon :icon="bagHandleOutline" size="large" color="medium"></ion-icon>
    <p>{{t("No Item")}}</p>
  </div>
</div>
</template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import ComSaleProductCouponCard from "@/modules/ecoupon/sale-coupon/components/ComSaleProductCouponCard.vue"
import {  bagHandleOutline } from "ionicons/icons";
import { ref } from 'vue'
const {saleDoc} = useSaleCoupon()
const activeIndex = ref(0)

const toggle = (index) => {
  if (activeIndex.value == index) {
    activeIndex.value = null
  } else {
    activeIndex.value = index
  }
}
const t = window.t;

</script>