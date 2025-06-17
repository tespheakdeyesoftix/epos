<template>
    <div  v-if="saleDoc.sale_products.length>0">
<ComSaleProductCouponCard v-for="(sp,index) in saleDoc.sale_products" :key="index"  :data="sp" :index="index"/>

</div>
<div  v-else>
    Pls show empty template
</div>
<ComSaleSummary/>
</template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import ComSaleProductCouponCard from "@/modules/ecoupon/sale-coupon/components/ComSaleProductCouponCard.vue"
import ComSaleSummary from "@/modules/ecoupon/sale-coupon/components/ComSaleSummary.vue";

const {saleDoc,totalQuantity,subTotal,totalSaleProductDiscount,saleDiscoutableAmount,totalSaleDiscountAmount} = useSaleCoupon()

const t = window.t;

</script>