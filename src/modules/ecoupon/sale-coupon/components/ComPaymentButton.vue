<template>
    <ion-footer v-if="plateform=='desktop'" >
                <ion-card class="p-0 m-0 card-height" color="success" button @click="_onPayment">
                <ion-card-content>
                    <stack row equal >
                    <stack row>
                        <span class="title-payment">
                            {{ t('Payment') }} 
                            </span>
                            <ion-chip class="small-chip" color="primary">
                                <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> <span class="mx-2">=</span>   
                                <ComExchangeRate />
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
               
                <ion-card color="success" class="p-0 m-0 card-height"   button @click="_onPayment"  >
                <ion-card-content class="ion-no-padding" >
                    <ion-grid>
                        <ion-row>
                        <ion-col size="7">
                            <span class="title-payment font " >
                            {{ t('Payment') }} 
                            </span>
                            <ion-chip class="small-chip font-bold" color="primary">
                                <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> <span class="mx-2">=</span>   
                                <ComExchangeRate />
                            </ion-chip>
                        </ion-col>
                        <ion-col size="5" class="ion-no-padding">
                            <div style="float: right;">
                                <ion-label class="big-chip text-3xl">
                                 <ComCurrency :value="grandTotal"/> 
                            </ion-label>
                            <br/>
                                <ion-label class="big-chip text-2xl">
                                <ComCurrency :value="grandTotalSecondCurrency || 0" :currency="second_currency"/> 
                            </ion-label>

                            </div>
                            
                        </ion-col>
                        
                        </ion-row>
                    </ion-grid>
                </ion-card-content>
            </ion-card>
    </ion-footer>
     <ion-footer v-if="plateform=='tablet'" >
               
                <ion-card class="p-0 m-0" style="height: 85px;"   button @click="_onPayment" color="success" >
                <ion-card-content class="ion-no-padding" >
                    <ion-grid>
                        <ion-row >
                        <ion-col size="5">
                        <div >
                            <div>
                                  <ion-label class="big-chip text-2xl" >
                                {{ t('Payment') }} 
                            </ion-label>
                            </div>
                          
                             <ion-label Color="danger" class="big-chip">
                                 <ComCurrency :value="1" :currency="mainExchangeRateCurrency" /> <span class="mx-2">=</span>   
                                <ComExchangeRate />
                            </ion-label>
                               
                        </div>
                        </ion-col>
                        <ion-col size="7" >
                            <div style="text-align: right;">
                                <div>
                                    <ion-label class="big-chip text-3xl">
                                    {{t('Total')}}  :  <ComCurrency :value="grandTotal"/> 
                                </ion-label>
                                </div>
                                <ion-label class="big-chip">
                                    {{t('Total')}} ({{ t(second_currency) }}) : <ComCurrency :value="grandTotalSecondCurrency || 0" :currency="second_currency"/> 
                                </ion-label>
                            </div>
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
 
const emit = defineEmits()
const {grandTotal, grandTotalSecondCurrency, onPayment } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
const mainExchangeRateCurrency = ref(app.setting.exchange_rate_main_currency);
const exchangeRate = app.setting.exchange_rate_input

 
if(second_currency.value == mainCurrency.value){
    second_currency.value = app.setting.currency
}

async function _onPayment(){
   
    const result = await onPayment()
    emit("onPayment",result)
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
    font-size: 11px;
}
.font{
    
    font-size: 17px;
}
</style>