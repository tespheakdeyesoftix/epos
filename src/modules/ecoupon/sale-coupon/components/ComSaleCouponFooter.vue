<template>
    <ion-footer>
        <ion-toolbar>
            <ion-grid>
                <ion-row>
                    <ion-col size="8">
                        <stack row equal>
                            <ion-button routerLink="/home" expand="full" size="large">{{ t("Home") }}</ion-button>
                            <ion-button expand="full" size="large" @click="onSaveAsDraft">{{ t("Save") }}</ion-button>
                        </stack>
                    </ion-col>
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

const { saleDoc,onSaveAsDraft } = useSaleCoupon()

const t = window.t
 

</script>