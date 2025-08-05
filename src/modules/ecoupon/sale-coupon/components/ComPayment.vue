<template>
<BaseModal :title="t('Payment')" :hideFooter="false">
   
   <ComPaymentFooter/> <ComPaymentAmountInfo v-if="plateform=='mobile'"/>
    <ion-grid class="h-full">
        <ion-row class="h-full">
            <ion-col size="12" size-md="4" >
                <ComPaymentInput />
            </ion-col>
            <ion-col size="12" size-md="4">
                <ComPaymentSelectPaymentType/>
            </ion-col>
            <ion-col size="12" size-md="4" class="h-full relative"  >
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
import ComPaymentAmountInfo from "@/modules/ecoupon/sale-coupon/components/ComPaymentAmountInfo.vue"
import { ref } from "vue"
const t = window.t;
const plateform = ref(app.utils.getPlateform())

</script>