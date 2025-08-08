<template>
  <div>
  
    <ion-card v-if="plateform!=='mobile'">
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
                         <span class="mx-2">  | </span>
                        
    <ComCurrency :value="grandTotalSecondCurrency" :currency="secondCurrency" /> 
                    </ion-chip>
                   
                </div>
               <div>
                <ion-chip>
                   {{t("Exchange Rate")}}: <ComCurrency :value="1" :currency="mainExchangeRateCurrency"/> =
  <ComCurrency :value="exchangeRateInput" :currency="exchangeCurrency"/>     
                </ion-chip>
             
               </div>
            </div>
            
 
        </ion-card-content>
    </ion-card>
  
    <!-- platform === mobile -->
     <!-- <ion-text 
     style="display:block; text-align:center; margin-top: 10px; font-weight: 500;">
     {{ t("Payment") }}
    </ion-text> -->
     <ion-list>
        <ion-item button v-for="(p,index) in saleDoc.payment" :key="index"  v-if="saleDoc.payment.length > 0">
           
            <ion-label >
                {{ p.payment_type }}  
                
                <div v-if="p.exchange_rate!=1">
                    <ion-text color="medium">
              {{ t("Exchange Rate") }} <br/> <ComCurrency :value="p.exchange_rate" :currency="p.currency"/>
                    </ion-text>
                    
                </div>
            </ion-label>
           
            <ion-label slot="end">
                <ComCurrency :value="p.input_amount" :currency="p.currency" />
            </ion-label>
            <ion-button @click="onDeletePayment(index)" size="large" shape="round" color="danger" fill="clear" slot="end">
                <ion-icon :icon="closeOutline"  slot="icon-only"/>
            </ion-button>
            
        </ion-item>
<!--        
        <ion-label
  v-else
  style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 15px;"
>
  <ion-icon :icon="cashOutline" size="large" color="medium"></ion-icon>
  <ion-text color="medium">{{ t("No Payment") }}</ion-text>
</ion-label> -->


     </ion-list>
     <!--  -->
<div class="fixed-payment" v-if="plateform !== 'mobile'">
<ion-list class="ion-no-border">
    <ion-item v-if="totalPaymentAmount > 0">
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
  
</div> 
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { closeOutline,cashOutline } from "ionicons/icons";
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

function onDeletePayment (index){
    saleDoc.value.payment.splice(index,1)
}

</script>
<style scoped>
.fixed-payment {
   
  left: 0;
  width: 100%;
 
  background: white; /* optional: background color */
}

ion-list,
ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --inner-padding-start: 0;
  --min-height: auto;
  position: relative;
}
</style>