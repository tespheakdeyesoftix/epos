<template>
    <ion-footer>
        
        <ion-toolbar  >
            <div class="mr-3" style="display: flex; justify-content: center;gap: 10px;"> 
            <ion-button shape="round" @click="onGoHome"> {{ t('Home') }} </ion-button>
            
            <ion-button shape="round" :disabled="!topUpCouponInfo" color="danger"  @click="onClearData"> {{ t('Cancel') }}
 

            </ion-button>
            <ComQuickPayButton/>
            <ion-button shape="round" color="success" @click="onPaymentClick"> {{ t('Payment') }}</ion-button>
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
function onGoHome(){
    if(window.history.length>1){
app.router.back()
    }else {
        app.ionRouter.navigate("/home","back","replace")
    }
   
    
}

</script>