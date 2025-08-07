<template>
<ion-footer >
  
    <ion-card @click="onViewSelectedSaleProduct" color="danger" class="ion-no-margin ion-no-padding">
        <ion-card-content>

            <ion-label>{{ lastSelectedCouponAndProduct }}</ion-label>
        
            <ion-grid class="ion-no-padding">
                <ion-row>
                    <ion-col size="9">
                        {{t("Quantity")}}
                    </ion-col>
                    <ion-col size="3">
                        {{ totalQuantity }}
                    </ion-col>
                </ion-row>
               
                <ion-row >
                    <ion-col size="9">
                        {{t('Total')}} ({{ t(mainCurrency) }})
                    </ion-col>
                    <ion-col size="3">
                        <ComCurrency :value="grandTotal"/>
                    </ion-col>
                </ion-row>

            </ion-grid>      
        </ion-card-content>
    </ion-card>
    
</ion-footer>
</template>
<script setup>
const t = window.t;
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { computed, ref,watch } from "vue";
import  ComViewSelectedSaleProductMobile from "@/modules/ecoupon/sale-coupon/components/ComViewSelectedSaleProductMobile.vue";
import dayjs from "dayjs";
 
const {grandTotal, totalQuantity, grandTotalSecondCurrency, saleDoc } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
const mainExchangeRateCurrency = ref(app.setting.exchange_rate_main_currency);
const exchangeRate = app.setting.exchange_rate_input

const lastSelectedCouponAndProduct = computed(() => {
  let products = saleDoc.value?.sale_products || []
  if (!products.length) return ''

  products = products.sort((a, b) => {
    return dayjs(b.creation).valueOf() - dayjs(a.creation).valueOf()
    })



  const last = products[0]
  const coupon = last.product_code || ''
  const productName = last.product_name || ''
  const productQty = last.quantity ?? ''
  return `${coupon} - ${productName} (${productQty})`.trim()
})

watch(() => saleDoc.value.sale_products, (newVal) => {
  console.log('Updated sale products:', newVal)
}, { deep: true })

 
if(second_currency.value == mainCurrency.value){
    second_currency.value = app.setting.currency
}
 
 
async function onViewSelectedSaleProduct(){
    if (saleDoc.value.sale_products.length == 0) {
        app.showWarning("No product selected.")
        return
    }
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