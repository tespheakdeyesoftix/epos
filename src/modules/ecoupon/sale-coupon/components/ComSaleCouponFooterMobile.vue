<template>
<ion-footer>
    <ion-card @click="onViewSelectedSaleProduct">
        <ion-card-content>
            {{ lastSelectedProduct }}
Quantity:     {{ totalQuantity }}
    {{t('Total')}} ({{ t(mainCurrency) }}) :  <ComCurrency :value="grandTotal"/> 

        </ion-card-content>
    </ion-card>
    
</ion-footer>
</template>
<script setup>
const t = window.t;
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { computed, ref } from "vue";
import  ComViewSelectedSaleProductMobile from "@/modules/ecoupon/sale-coupon/components/ComViewSelectedSaleProductMobile.vue";
 
const {grandTotal, totalQuantity, grandTotalSecondCurrency, saleDoc } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
const mainExchangeRateCurrency = ref(app.setting.exchange_rate_main_currency);
const exchangeRate = app.setting.exchange_rate_input

const lastSelectedProduct  = computed(()=>{
    if(!saleDoc.value) return {}
    return saleDoc.value.sale_products[saleDoc.value.sale_products.length-1]
})
 
if(second_currency.value == mainCurrency.value){
    second_currency.value = app.setting.currency
}
 
 
async function onViewSelectedSaleProduct(){
    const result = await app.openModal({
        component:ComViewSelectedSaleProductMobile
    })
}
</script>
<style scoped>
.big-chip{
    font-size: 20px;
}
.title-payment{
    font-size: 24px;
}
.small-chip{
    font-size: 12px;
}
</style>