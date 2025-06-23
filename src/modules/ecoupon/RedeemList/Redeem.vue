<template>
    <ion-page>
        <ToolBar>
            {{ t("Redeem") }}

        </ToolBar>
        <ion-content class="ion-padding">
            <div class="fix-container">
                <h1>Hello World</h1>
<ComSearchBarcode/>
<ComRedeemCouponList />

{{ t("Total Redeem Amount") }} : <ComCurrency :value="grandTotal" />
{{ t("Exchange Rate") }} :<ComCurrency :value="1" :currency="mainCurrency" /> =  <ComCurrency :value="exchange_rate" :currency="second_currency" />
{{ t("Grand Total") }}({{ second_currency }}) :<ComCurrency :value="grandTotal*exchange_rate" :currency="second_currency" />

            </div>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <ComRedeemFooter/>
            </ion-toolbar>
        </ion-footer>
    </ion-page>

</template>
<script setup >

import ComSearchBarcode from "@/modules/ecoupon/RedeemList/components/ComSearchBarcode.vue"
import ComRedeemCouponList from "@/modules/ecoupon/RedeemList/components/ComRedeemCouponList.vue"
import ComRedeemFooter from "@/modules/ecoupon/RedeemList/components/ComRedeemFooter.vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon";
import { useApp } from "@/hooks/useApp";
import { ref } from "vue";
import {
  onIonViewWillEnter
} from '@ionic/vue';
import { onBeforeRouteLeave } from 'vue-router'
import ToolBar from "@/views/layouts/ToolBar.vue";
    const t = window.t;
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