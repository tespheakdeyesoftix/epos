<template>
  <ion-page>
    <ToolBar>
      {{ t("Redeem") }}
    </ToolBar>
    <ion-content class="ion-padding">
      <!-- =============Desktop UI ================== -->
      <div class="fix-container" v-if="!isMobileUI">
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
          <ComPaymentButton/>

          </div>
        </ion-split-pane>
      </div>
      <!-- =================Mobile UI============================ -->
      <template v-else>

         <ComSearchBarcode/>
      <ComRedeemCouponList />  

      <div style="margin-top: 10px;">
        <com-input v-model="saleDoc.note" type="text-area" :label="t('Note')" :placeholder="t('Redeem Note')"
          storageKey="redeem_note" />
      </div>
      
      </template>
    </ion-content>

    <ComRedeemFooterMobile v-if="isMobileUI" />
  </ion-page>

</template>
<script setup>

import ComSearchBarcode from "@/modules/ecoupon/RedeemList/components/ComSearchBarcode.vue"
import ComRedeemCouponList from "@/modules/ecoupon/RedeemList/components/ComRedeemCouponList.vue"
import ComRedeemFooter from "@/modules/ecoupon/RedeemList/components/ComRedeemFooter.vue"
import ComRedeemFooterMobile from "@/modules/ecoupon/RedeemList/components/ComRedeemFooterMobile.vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon";
import { useApp } from "@/hooks/useApp";
import { ref } from "vue";
import {
  onIonViewWillEnter
} from '@ionic/vue';
import { onBeforeRouteLeave } from 'vue-router'
import ComPaymentButton from "../sale-coupon/components/ComPaymentButton.vue";
const isMobileUI = ref(window.innerWidth <= 900)

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
function handleUpdateScreenMode() {
  isMobileUI.value = (window.innerWidth <= 900);
}

onIonViewWillEnter(() => {
  window.addEventListener("resize", handleUpdateScreenMode);
  if (!app.route.params.name) {
    saleType.value = "Redeem"
    pageRoute.value = "redeem"
    onClearData()
    saleDoc.value.sale_type = "Redeem";
  }


})


onBeforeRouteLeave(async (to, from, next) => {
  window.removeEventListener("resize", handleUpdateScreenMode);
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