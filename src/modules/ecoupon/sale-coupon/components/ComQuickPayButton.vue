<template>
 <ion-button expand="full" shape="round" size="large" color="danger" id="quick_pay_button">{{ t("Quick Pay") }}</ion-button>
  <ion-popover trigger="quick_pay_button" trigger-action="click"  :dismiss-on-select="true">
    <ion-content class="ion-padding">
        <ion-text class="ion-padding">
            <strong>{{ t("Quick Payment") }}</strong>
        </ion-text>
        <ion-list >
            <ion-item button v-for="(p,index) in quickPaymentType" :key="index" @click="onQuickPay(p)">
                <ion-label>{{ t(p.payment_type) }}</ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
  </ion-popover>
</template>
<script setup>
import { computed, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
 
const { onQuickPay } = useSaleCoupon()
const t = window.t;
const setting = app.setting;

const quickPaymentType = computed(()=>{
    if(setting.pos_config.payment_type.filter(x=>x.show_in_quick_pay==1).length>0){
        return setting.pos_config.payment_type.filter(x=>x.show_in_quick_pay==1)
    }
})

</script>