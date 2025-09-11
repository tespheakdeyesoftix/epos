<template>
  <ion-page>
    <ToolBar>
      {{ t("Redeem") }}
    </ToolBar>
    <ion-content class="ion-padding">
      <div class="fix-container">
        <ion-split-pane when="xs" content-id="main">
          <ion-menu content-id="main">
            <ion-content class="ion-padding">
              <ComSearchBarcode />

              <ComRedeemCouponList />
            </ion-content>
            <ComRedeemFooter />
          </ion-menu>
          <div class="ion-page" id="main">
            <ion-content class="ion-padding h-full">
              <com-input v-model="saleDoc.note" type="text-area" :label="t('Note')" :placeholder="t('Redeem Note')"
                storageKey="redeem_note" />
            </ion-content>
            <ion-footer>
              <ion-card class="p-3 m-0 card-height" color="tertiary">
                <stack row equal>
                  <div>
                    {{ t("Total Redeem Amount") }} :
                    <ComCurrency :value="grandTotal" /> <br>
                    {{ t("Grand Total") }}({{ second_currency }}) :
                    <ComCurrency :value="grandTotal * exchange_rate" :currency="second_currency" />
                  </div>
                  <div style="float: right;">
                    <ion-chip>
                      <ComCurrency :value="1" :currency="exchangeRateMainCurrency" /> =
                      <ComCurrency :value="exchangeRate" :currency="exchangeRateSecondCurrency" />
                    </ion-chip>

                  </div>

                </stack>

              </ion-card>
            </ion-footer>

          </div>
        </ion-split-pane>
      </div>
    </ion-content>
  </ion-page>

</template>
<script setup>

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
const { saleDoc, grandTotal, saleType, pageRoute, onClearData, initSaleDoc } = useSaleCoupon()
const { exchange_rate } = useApp();
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
const exchangeRateMainCurrency = ref(app.setting.exchange_rate_main_currency);
const exchangeRateSecondCurrency = ref(app.setting.second_currency);
 
if (mainCurrency.value != exchangeRateMainCurrency.value) {
  exchangeRateSecondCurrency.value = mainCurrency.value;
}
const exchangeRate = app.setting.exchange_rate_input
 
onIonViewWillEnter(() => {
  if (!app.route.params.name) {
    saleType.value = "Redeem"
    pageRoute.value = "redeem"
    onClearData()
    saleDoc.value.sale_type = "Redeem";
  }


})


onBeforeRouteLeave(async (to, from, next) => {
  if (saleDoc.value.sale_products.length > 0) {
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
<style scoped>
.bg-order-card {
  background-color: var(--ion-color-light-tint);
}

ion-split-pane {
  --side-width: 60%;
  --side-max-width: 60%;
  --border: 1px dashed #b3baff;
}
</style>