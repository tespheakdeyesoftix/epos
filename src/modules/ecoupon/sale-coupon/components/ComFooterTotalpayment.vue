<template>
    <div class="fixed-payment" >
<ion-list class="ion-no-border ion-no-padding">
    <ion-item v-if="totalPaymentAmount > 0" >
      <ion-label>{{ t("Total Payment") }}</ion-label>
      <ion-label slot="end"><ComCurrency :value="totalPaymentAmount" /></ion-label>
    </ion-item>

    <ion-item v-if="paymentBalance > 0">
      <ion-label>{{ t("Balance") }} ({{ mainCurrency }})</ion-label>
      <ion-label slot="end"><ComCurrency :value="paymentBalance" /></ion-label>
    </ion-item>

    <ion-item v-if="paymentBalance > 0">
      <ion-label>{{ t("Balance") }} ({{ secondCurrency }})</ion-label>
      <ion-label slot="end">
        <ComCurrency :value="paymentBalance * exchangeRate" :currency="secondCurrency" />
      </ion-label>
    </ion-item>

    <ion-item v-if="changeAmount > 0">
      <ion-label>{{ t("Change Amount") }} ({{ mainCurrency }})</ion-label>
      <ion-label slot="end">
        <ComCurrency :value="changeAmount" :currency="mainCurrency" />
      </ion-label>
    </ion-item>

    <ion-item v-if="changeAmount > 0">
      <ion-label>{{ t("Change Amount") }} ({{ secondCurrency }})</ion-label>
      <ion-label slot="end">
        <ComCurrency :value="changeAmount * changeExchangeRate" :currency="secondCurrency" />
      </ion-label>
    </ion-item>
  </ion-list>
</div>
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
 
import { ref } from "vue";
const t = window.t;
const {grandTotal,grandTotalSecondCurrency,totalPaymentAmount,paymentBalance,changeAmount, saleDoc} = useSaleCoupon()
const secondCurrency = app.setting.second_currency;
const mainCurrency = app.setting.currency;
const mainExchangeRateCurrency = app.setting.exchange_rate_main_currency;
const exchangeRateInput = app.setting.exchange_rate_input;
const exchangeRate = app.setting.exchange_rate;
const changeExchangeRate = app.setting.change_exchange_rate;
const plateform = ref(app.utils.getPlateform())
let exchangeCurrency = app.setting.second_currency;
if(exchangeCurrency == mainExchangeRateCurrency){
    exchangeCurrency = app.setting.currency
}

 

</script>

<style scoped>
ion-label{
  margin: 0;
}
</style>