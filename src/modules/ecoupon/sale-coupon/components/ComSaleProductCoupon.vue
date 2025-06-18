<template>
    <div  v-if="saleDoc.sale_products.length>0">
<ComSaleProductCouponCard v-for="(sp,index) in saleDoc.sale_products" :key="index"  :data="sp" :index="index"/>

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
import { bagAddOutline, bagHandleOutline } from "ionicons/icons";

const {saleDoc,totalQuantity,subTotal,totalSaleProductDiscount,saleDiscoutableAmount,totalSaleDiscountAmount} = useSaleCoupon()

const t = window.t;

</script>