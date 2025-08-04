<template>
    <BaseModal title="Your Order">
        <ion-content>
            <ComCustomerCard v-if="saleDoc?.customer"/>
            <ComSaleProductMobile />
        </ion-content>
    </BaseModal>
</template>

<script setup>

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"
import ComSaleProductMobile from "@/modules/ecoupon/sale-coupon/components/ComSaleProductMobile.vue"
const { saleDoc } = useSaleCoupon()
</script>