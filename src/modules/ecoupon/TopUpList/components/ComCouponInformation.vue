<template>
    {{ topUpCouponInfo }}
</template>
<script setup>
import {ref, onMounted}  from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const { topUpCouponInfo} = useSaleCoupon()
 
const t = window.t
</script>