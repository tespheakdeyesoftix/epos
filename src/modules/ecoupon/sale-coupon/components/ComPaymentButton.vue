<template>
    <ion-footer v-if="plateform=='desktop'">
                <ion-card class="p-0 m-0 card-height" color="tertiary" button @click="onPayment">
                <ion-card-content>
                    <stack row equal >
                    <stack row>
                        <span class="title-payment">
                            {{ t('Payment') }} 
                            </span>
                            <ion-chip class="small-chip" color="primary">
                        <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> <span class="mx-2">=</span>   
                    <ComCurrency :value="exchangeRate" :currency="second_currency" /> 
                            </ion-chip>
                    </stack>
                                <stack>
            <ion-label class="big-chip">
                    {{t('Total')}} ({{ t(mainCurrency) }}) :  <ComCurrency :value="grandTotal"/> 
                    </ion-label>
                    <ion-label class="big-chip">
                    {{t('Total')}} ({{ t(second_currency) }}) : <ComCurrency :value="grandTotalSecondCurrency || 0" :currency="second_currency"/> 
                    </ion-label>
                    </stack>
                            </stack>
                </ion-card-content>
            </ion-card>
    </ion-footer>
    <ion-footer v-if="plateform=='mobile'" >
               
                <ion-card class="p-0 m-0 card-height" color="tertiary" button @click="onPayment">
                <ion-card-content class="ion-no-padding" >
                    <ion-grid>
                        <ion-row>
                        <ion-col size="7">
                            <span class="title-payment font ml-3" >
                            {{ t('Payment') }} 
                            </span>
                            <ion-chip class="small-chip" color="primary">
                                <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> <span class="mx-2">=</span>   
                                <ComCurrency :value="exchangeRate" :currency="second_currency" /> 
                            </ion-chip>
                        </ion-col>
                        <ion-col size="5" >
                            <div>
                                <ion-label class="big-chip font">
                                {{t('Total')}} ({{ t(mainCurrency) }}) :  <ComCurrency :value="grandTotal"/> 
                            </ion-label>
                            </div>
                            <ion-label class="big-chip font">
                                {{t('Total')}} ({{ t(second_currency) }}) : <ComCurrency :value="grandTotalSecondCurrency || 0" :currency="second_currency"/> 
                            </ion-label>
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
const plateform = ref(app.utils.getPlateform())
import { desktop } from "ionicons/icons";
import { ref } from "vue";
 
const {grandTotal, grandTotalSecondCurrency, onPayment } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
const mainExchangeRateCurrency = ref(app.setting.exchange_rate_main_currency);
const exchangeRate = app.setting.exchange_rate_input

 
if(second_currency.value == mainCurrency.value){
    second_currency.value = app.setting.currency
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
.font{
    font-size: 15px;
}
</style>