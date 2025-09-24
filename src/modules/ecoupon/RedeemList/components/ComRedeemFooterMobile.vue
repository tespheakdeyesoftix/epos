<template>
     
      <div>
        <ion-footer >
<ion-card class="p-0 m-0 card-height" color="tertiary">
<ion-grid>
  <ion-row class="ion-align-items-center">
    <!-- Left side: totals -->
    <ion-col size="7" style="font-size: 13px;">
      {{ t("Total Redeem Amount") }} : <ComCurrency :value="grandTotal" /> <br>
      {{ t("Grand Total") }} ({{ second_currency }}) :
      <ComCurrency
        :value="grandTotal * exchange_rate"
        :currency="second_currency"
      />
    </ion-col>

    <!-- Right side: exchange rate chip -->
    <ion-col size="5" class="ion-text-end">
      <ion-chip  style="font-size: 13px;">
        <ComCurrency :value="1" :currency="currency" /> =
        <ComExchangeRate />
       
      </ion-chip>
    </ion-col>
  </ion-row>
</ion-grid>

        
</ion-card>   
</ion-footer>
         <ComRedeemFooter/>
      </div>
     
</template>
<script setup>
import ComRedeemFooter from "@/modules/ecoupon/RedeemList/components/ComRedeemFooter.vue"
import { ref } from "vue";
   
import { useApp } from "@/hooks/useApp";
import { useSaleCoupon } from "@/hooks/useSaleCoupon";

const t = window.t
 const {grandTotal, } = useSaleCoupon()
    const {exchange_rate} = useApp();
    
const currency = ref(app.setting.exchange_rate_main_currency);
const second_currency = ref(app.setting.second_currency);

</script>