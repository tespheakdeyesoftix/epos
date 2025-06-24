<template>
   
 <ion-button 
    :disabled="saleDoc?.sale_products?.length==0" 
 expand="full" shape="round" color="danger" id="quick_pay_button"
 @click="openPopover($event)"
 >{{ t("Quick Pay") }}</ion-button>
  <ion-popover
    :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false"
     :dismiss-on-select="true">
    <ion-content class="ion-padding">
        <ion-text class="ion-padding">
            <strong>{{ t("Quick Payment") }}</strong>
        </ion-text>
        <ion-list >
            <ion-item button v-for="(p,index) in quickPaymentType" :key="index" @click="onQuickPay(p)">
                <ion-icon slot="start" :icon="cardOutline" />
                <ion-label>{{ t(p.payment_type) }}</ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
  </ion-popover>
</template>
<script setup>
import {  ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { cardOutline } from "ionicons/icons";
 const event = ref(null)
const { onQuickPay,saleDoc } = useSaleCoupon()
const t = window.t;
 
const popoverOpen = ref(false)
const quickPaymentType  = ref([])


function openPopover(e){
    const defaultPaymentTypes = [
            app.setting.pos_profile.default_payment_type,
            app.setting.pos_profile.second_currency_payment_type
        ]
        quickPaymentType.value =  app.setting.pos_config.payment_type.filter(x=>x.show_in_quick_pay==1 || defaultPaymentTypes.includes(x.payment_type))
     event.value = e
  popoverOpen.value = true
}

</script>