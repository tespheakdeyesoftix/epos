<template>
   
    <div v-if="plateform == 'mobile'" row equal>
       <ion-chip class="multi-line">
  <ion-text class="mr-2">{{ t("Exchange Rate") }}:</ion-text>
  <div style="font-weight: 600;">
    <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> =
    <ComCurrency :value="exchangeRateInput" :currency="exchangeCurrency" />
  </div>
</ion-chip>

        <ion-chip class="multi-line-chip">
                <ion-text style="font-size: 17px;font-weight: 400;">
                 {{t("Total Amount")}}
                 </ion-text>   
            <div class="flex gap-8 mt-2 " style="font-weight: 600;">
             <ComCurrency :value="grandTotal" />
            <ComCurrency :value="grandTotalSecondCurrency" :currency="secondCurrency" />
          </div>
        </ion-chip>
    </div>
    <div v-else>
        <ion-card>
            <ion-card-content>
                <div class="w-full flex justify-content-center">
                    <ion-text class="text-center">
                        {{ t("Total Amount") }}
                    </ion-text>

                </div>

                <div class="w-full flex justify-content-between">
                    <div>
                        <ion-chip>
                            <ComCurrency :value="grandTotal" />
                            <span class="mx-2"> | </span>

                            <ComCurrency :value="grandTotalSecondCurrency" :currency="secondCurrency" />
                        </ion-chip>

                    </div>
                    <div>
                        <ion-chip>
                            {{ t("Exchange Rate") }}:
                            <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> =
                            <ComCurrency :value="exchangeRateInput" :currency="exchangeCurrency" />
                        </ion-chip>

                    </div>
                </div>
            </ion-card-content>
        </ion-card>

    </div>
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { ref } from "vue";
const plateform = ref(app.utils.getPlateform())
const t = window.t;
const { grandTotal, grandTotalSecondCurrency } = useSaleCoupon()
const secondCurrency = app.setting.second_currency;

const mainExchangeRateCurrency = app.setting.exchange_rate_main_currency;
const exchangeRateInput = app.setting.exchange_rate_input;


let exchangeCurrency = app.setting.second_currency;
if (exchangeCurrency == mainExchangeRateCurrency) {
    exchangeCurrency = app.setting.currency
}



</script>
<style scoped>
.fixed-payment {
    position: absolute;
    bottom: -20px;
    width: 100%;
}
.multi-line-chip {
  display: flex;
  flex-direction: column;
    background-color: #ec9595;
}
.multi-line {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 4px 8px;
  gap: 6px;
}

 
</style>