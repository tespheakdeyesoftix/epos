<template>
    <BaseModal title="Your Order" :hideFooter="false" :footerHeight="120">
       
            <ComCustomerCard v-if="saleDoc?.customer"/>
            <ComSaleProductMobile />     
            <template #footer>         
                 <ion-grid class="h-full m-0 p-0">
  <ion-row>
    <ion-col class="flex flex-col gap-12">
      <ion-button shape="round" expand="block" @click="onSaveAsDraft">
        <ion-label>{{ t("Save") }}</ion-label>
      </ion-button>

      <ComQuickPayButton />
      <ComPrintBillButtonMobile />
      <ComSaleMoreActionButtonMobile />
    </ion-col>
  </ion-row>
</ion-grid>

                <ComPaymentButton @onPayment="onPayment"/>
            </template>
    </BaseModal>
</template>

<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"
import ComSaleProductMobile from "@/modules/ecoupon/sale-coupon/components/ComSaleProductMobile.vue"
import ComPaymentButton from "@/modules/ecoupon/sale-coupon/components/ComPaymentButton.vue"
import ComSaleMoreActionButtonMobile from "@/modules/ecoupon/sale-coupon/components/ComSaleMoreActionButtonMobile.vue" 
import ComQuickPayButton from "@/modules/ecoupon/sale-coupon/components/ComQuickPayButton.vue"
import ComPrintBillButtonMobile from "@/modules/ecoupon/sale-coupon/components/ComPrintBillButtonMobile.vue"
import { modalController } from '@ionic/vue';

const t = window.t
const { saleDoc } = useSaleCoupon()

function onPayment(result){
    if(result){
        setTimeout(function(){ 
modalController.dismiss(true, 'confirm')
        },500)   
    }
}
</script>
