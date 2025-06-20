<template>
    <ion-footer>
        
        <ion-toolbar  >
            <div style="display: flex; justify-content: center;gap: 10px;"> 
            <ion-button routerLink="/home"> {{ t('Home') }}</ion-button>
            
            <ion-button :disabled="!topUpCouponInfo" color="danger"  @click="onClearData"> {{ t('Cancel') }}
 

            </ion-button>
            <ComQuickPayButton/>
            <ion-button color="success" @click="onPaymentClick"> {{ t('Payment') }}</ion-button>
            </div>
           
        </ion-toolbar>
    </ion-footer>
</template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon"
import ComQuickPayButton from "@/modules/ecoupon/sale-coupon/components/ComQuickPayButton.vue"
const  {onPayment,saleDoc ,onClearData,topUpCouponInfo} = useSaleCoupon()
const t = window.t;

 
async function onPaymentClick(){
    if(saleDoc.value.sale_products[0].product_code ==""){
        await app.showWarning("Please select top up amount")
        return
    }
    
    await onPayment()
    
}
</script>