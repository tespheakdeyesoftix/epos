<template>
    <ComFooter>
        <ion-button @click="onBack" shape="round" >{{ t("Home") }}</ion-button>
        <ComQuickPayButton />
      
          <ion-button :disabled="saleDoc?.sale_products?.length==0" shape="round" color="success" @click="onPaymentClick"> {{ t('Payment') }}</ion-button>
    </ComFooter>

</template>
<script setup>
import ComQuickPayButton from "@/modules/ecoupon/RedeemList/components/ComQuickPayButton.vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon"

const  {onPayment,saleDoc} = useSaleCoupon()
const t = window.t;

async function onPaymentClick(){
    if(saleDoc.value.sale_products.length==0){
        await app.showWarning("Please scan coupon to redeem")
        return
    }
    
    await onPayment()
    
}

function onBack(){
    app.router.back();
}


</script>