<template>
    <ion-footer>
        <ion-toolbar>
            <ion-grid>
                <ion-row>
                    <ion-col size="8">hello</ion-col>
                    <ion-col size="4">
                        <ComPaymentButton />
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-toolbar>
    </ion-footer>

</template>
<script setup>
import { ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import  ComPaymentButton  from "@/modules/ecoupon/sale-coupon/components/ComPaymentButton.vue"

const { saleDoc } = useSaleCoupon()

const t = window.t
 

</script>