<template>
    <BaseModal title="Your Order" :hideFooter="false">
       
            <ComCustomerCard v-if="saleDoc?.customer"/>
            <ComSaleProductMobile />
 
 
            <template #footer>
                <ComPaymentButton @onPayment="onPayment"/>
            </template>
            
        
    </BaseModal>
</template>

<script setup>

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"
import ComSaleProductMobile from "@/modules/ecoupon/sale-coupon/components/ComSaleProductMobile.vue"
import ComPaymentButton from "@/modules/ecoupon/sale-coupon/components/ComPaymentButton.vue"
 
const { saleDoc } = useSaleCoupon()

  import { modalController } from '@ionic/vue';

function onPayment(result){
 
    if(result){
      
        setTimeout(function(){
        
modalController.dismiss(true, 'confirm')
        },500)
        
    }
}
</script>

<style scoped>
 
</style>