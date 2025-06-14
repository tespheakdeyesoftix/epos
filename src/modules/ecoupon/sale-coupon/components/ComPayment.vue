<template>
<BaseModal :title="t('Payment')" :hideFooter="false">
    <ion-grid>
        <ion-row>
            <ion-col>
                <ComPaymentInput />
            </ion-col>
            <ion-col>
                <ComPaymentSelectPaymentType/>
            </ion-col>
            <ion-col>
                <ComPaymentList/>
            </ion-col>
        </ion-row>
    </ion-grid>
    <template #footer>
       <ComPaymentFooter/>
    </template>
</BaseModal>
</template>
<script setup>
import ComPaymentInput from "@/modules/ecoupon/sale-coupon/components/ComPaymentInput.vue"
import ComPaymentSelectPaymentType from "@/modules/ecoupon/sale-coupon/components/ComPaymentSelectPaymentType.vue"
import ComPaymentList from "@/modules/ecoupon/sale-coupon/components/ComPaymentList.vue"
import ComPaymentFooter from "@/modules/ecoupon/sale-coupon/components/ComPaymentFooter.vue"
const t = window.t;

</script>