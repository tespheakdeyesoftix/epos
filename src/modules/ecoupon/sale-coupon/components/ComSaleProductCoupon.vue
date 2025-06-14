<template>
  
<div  v-if="saleDoc.sale_products.length>0">
<ComSaleProductCouponCard v-for="(sp,index) in saleDoc.sale_products" :key="index"  :data="sp" :index="index"/>
<ion-list>
    <ion-item>
        <ion-label>{{ t("Total Coupon") }}</ion-label>
        <ion-label slot="end">{{ totalQuantity }}</ion-label>
    </ion-item>
</ion-list>
</div>
<div v-else>
    Pls show empty template
</div>

</template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import ComSaleProductCouponCard from "@/modules/ecoupon/sale-coupon/components/ComSaleProductCouponCard.vue"

const {saleDoc,totalQuantity} = useSaleCoupon()

const t = window.t;

</script>