<template>
    
<ComRedeemCouponCard v-for="(sp,index) in saleDoc?.sale_products" :key="index"  :data="sp"/>
      
        
</template>
<script setup>
import ComRedeemCouponCard from "@/modules/ecoupon/RedeemList/components/ComRedeemCouponCard.vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const {saleDoc} = useSaleCoupon();

</script>
