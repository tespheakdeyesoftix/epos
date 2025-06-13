<template>
 
  
 
<div v-for="(g,index) in Object.keys(groupSaleProducts)" :key="index" v-if="saleDoc.sale_products.length>0">
<ComSaleProductCouponCard  :data="groupSaleProducts[g]"/>
 
<ion-list>
    <ion-item>
        <ion-label>{{ t("Total Coupon") }}</ion-label>
        <ion-label slot="end">{{ saleDoc.sale_products.length }}</ion-label>
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

const {saleDoc,groupSaleProducts} = useSaleCoupon()
 
const t = window.t;
 
</script>