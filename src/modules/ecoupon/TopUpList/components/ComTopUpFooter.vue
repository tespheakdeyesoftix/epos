<template>
    <ion-footer>
        
        <ion-toolbar  v-if="plateform !== 'mobile'">
            <div class="mr-3" style="display: flex; justify-content: center;gap: 10px;"> 
            <ion-button shape="round" @click="onGoHome"> {{ t('Home') }} </ion-button>
            
            <ion-button shape="round" :disabled="!topUpCouponInfo" color="danger"  @click="onClearData"> {{ t('Cancel') }}
 

            </ion-button>
            <ComQuickPayButton/>
            <ion-button shape="round" color="success" @click="onPaymentClick"> {{ t('Payment') }}</ion-button>
            </div>
           
        </ion-toolbar>
        <ion-toolbar v-else>
            <div style="display: flex; justify-content: center;gap: 5px;"> 
         
            
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
import { ref } from "vue";
const  {onPayment,saleDoc ,onClearData,topUpCouponInfo} = useSaleCoupon()
const t = window.t;
const plateform = ref(app.utils.getPlateform());
 
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