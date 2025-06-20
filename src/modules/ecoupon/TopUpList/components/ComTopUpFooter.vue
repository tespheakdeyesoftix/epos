<template>
    <ion-footer>
        
        <ion-toolbar  >
            <div style="display: flex; justify-content: center;gap: 10px;"> 
            <ion-button routerLink="/home"> {{ t('Home') }}</ion-button>
            <ion-button :disabled="!topUpCouponInfo" color="danger"  @click="onCalcel"> {{ t('Cancel') }}</ion-button>
            <ion-button > {{ t('Quick Pay') }}</ion-button>
            <ion-button color="success" @click="onPaymentClick"> {{ t('Payment') }}</ion-button>
            </div>
           
        </ion-toolbar>
    </ion-footer>
</template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon"
const  {onPayment,saleDoc,initSaleDoc,topUpCouponInfo,topUpSaleProduct } = useSaleCoupon()
const t = window.t;

function onCalcel(){
initSaleDoc();
 topUpSaleProduct.value ={product_code:""}
saleDoc.value.sale_products = [ topUpSaleProduct.value]

topUpCouponInfo.value = null
}

async function onPaymentClick(){
    if(saleDoc.value.sale_products[0].product_code ==""){
        await app.showWarning("Please select top up amount")
        return
    }
    
    await onPayment()
    
}
</script>