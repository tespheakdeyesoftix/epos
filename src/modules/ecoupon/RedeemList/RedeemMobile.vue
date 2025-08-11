<template>
    <ion-page>
        <ToolBar>
            {{ t("Redeem") }}
        </ToolBar>

        <ion-content class="ion-padding">
      <ComSearchBarcode/>
      <ComRedeemCouponList />  

      <div style="margin-top: 10px;">
        <com-input v-model="saleDoc.note" type="text-area" :label="t('Note')" :placeholder="t('Redeem Note')"
          storageKey="redeem_note" />
      </div>
      
      </ion-content>

{{ exchange_rate }}
      <div>
        <ion-footer >
<ion-card class="p-0 m-0 card-height" color="tertiary">
<ion-grid>
  <ion-row class="ion-align-items-center">
    <!-- Left side: totals -->
    <ion-col size="8">
      {{ t("Total Redeem Amount") }} : <ComCurrency :value="grandTotal" /> <br>
      {{ t("Grand Total") }} ({{ second_currency }}) :
      <ComCurrency
        :value="grandTotal * exchange_rate"
        :currency="second_currency"
      />
    </ion-col>

    <!-- Right side: exchange rate chip -->
    <ion-col size="4" class="ion-text-end">
      <ion-chip>
        <ComCurrency :value="1" :currency="mainCurrency" /> =
        <ComCurrency :value="exchange_rate" :currency="second_currency" />
      </ion-chip>
    </ion-col>
  </ion-row>
</ion-grid>

        
</ion-card>   
</ion-footer>
         <ComRedeemFooter/>
      </div>
       

        


    </ion-page>
</template>
<script setup>
import ComSearchBarcode from "@/modules/ecoupon/RedeemList/components/ComSearchBarcode.vue"
import ComRedeemCouponList from "@/modules/ecoupon/RedeemList/components/ComRedeemCouponList.vue"
import ComRedeemFooter from "@/modules/ecoupon/RedeemList/components/ComRedeemFooter.vue"
import { ref } from "vue";
import {
  onIonViewWillEnter
} from '@ionic/vue';
import { onBeforeRouteLeave } from 'vue-router'
import ToolBar from "@/views/layouts/ToolBar.vue";
import { useApp } from "@/hooks/useApp";
import { useSaleCoupon } from "@/hooks/useSaleCoupon";
const t = window.t
 const {saleDoc,grandTotal,saleType,pageRoute,onClearData ,initSaleDoc } = useSaleCoupon()
    const {exchange_rate} = useApp();
    const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);

onIonViewWillEnter(()=>{
  if(!app.route.params.name){
  saleType.value = "Redeem"
  pageRoute.value = "redeem"
    onClearData()
      saleDoc.value.sale_type = "Redeem";
  }
  

})

onBeforeRouteLeave(async (to, from, next) => {
  if (saleDoc.value.sale_products.length>0) {
    const confirm = await app.onConfirm("Confirm", "You have pending coupon to redeem. Do you want to continue?")
    if (!confirm) {
      next(false)
    } else {
      
      initSaleDoc()
      next()
    }
  } else {
     initSaleDoc()
    next()
  }
})
</script>