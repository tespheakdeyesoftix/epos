<template>

    <div v-if="plateform == 'mobile'" row equal>
        
        <ion-chip class="multi-line-chip">
            <ion-text style="font-size: 17px;font-weight: 400;" color="dark">
                {{ t("Total Amount") }}
            </ion-text>
            <div class="flex gap-8 mt-2 " style="font-weight: 600; font-size: x-large;">
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

                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-button expand="full" size="large" shape="round" fill="outline" color="primary">
                                <ComCurrency :value="grandTotal" />


                            </ion-button>
                        </ion-col>

                        <ion-col>
                            <ion-button expand="full" size="large" shape="round" fill="outline" color="primary">
                                <ComCurrency :value="grandTotalSecondCurrency" :currency="secondCurrency" />
                            </ion-button>
                        </ion-col>

                    </ion-row>
                </ion-grid>




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
    background-color: #98b9ff;
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