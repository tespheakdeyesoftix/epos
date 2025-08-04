<template>
    <ion-page>
        <ToolBar>{{ t("New Sale") }}</ToolBar>
        <ion-content>
            <ComCustomerCard v-if="saleDoc?.customer"/>
        
            <ComCouponListMobile />
             
        </ion-content>
        <ComSaleCouponFooterMobile />
    </ion-page>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCouponListMobile from "@/modules/ecoupon/sale-coupon/components/ComCouponListMobile.vue"
import ComSaleCouponFooterMobile from "@/modules/ecoupon/sale-coupon/components/ComSaleCouponFooterMobile.vue"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"


import { useApp } from "@/hooks/useApp";
import { onBeforeRouteLeave } from 'vue-router'
const { saleDoc, initSaleDoc, getSaleDoc, saleType, pageRoute } = useSaleCoupon()
const t = window.t;
</script>