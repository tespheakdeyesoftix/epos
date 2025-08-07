<template>
   
    <stack v-if="plateform == 'mobile'" row equal>
        <ion-chip>
            <ComCurrency :value="grandTotal" />
            <span class="mx-2"> | </span>

            <ComCurrency :value="grandTotalSecondCurrency" :currency="secondCurrency" />
        </ion-chip>

        <ion-chip>
            {{ t("Exchange Rate") }}:
            <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> =
            <ComCurrency :value="exchangeRateInput" :currency="exchangeCurrency" />
        </ion-chip>


    </stack>
    <div v-else>

        <ion-card>
            <ion-card-content>
                <div class="w-full flex justify-content-center">
                    <ion-text>
                        <h2>{{ t("Total Amount") }}</h2>
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
</style>