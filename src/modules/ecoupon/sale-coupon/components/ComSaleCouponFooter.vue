<template>
    <ion-footer>
        <ion-toolbar>
            <ion-grid>
                <ion-row>
                    <ion-col size="8">
                        <stack row equal gap="5px">
                            <ion-button shape="round" routerLink="/home" expand="full" size="large">{{ t("Home")
                                }}</ion-button>
                            <ion-button shape="round" expand="full" size="large" @click="onSaveAsDraft">{{ t("Save")
                                }}</ion-button>
                             
 <ion-button id="discount" expand="full" size="large" shape="round"  >Discount</ion-button>
 
                            
                            <ComQuickPayButton />
                        </stack>
                    </ion-col>
                    <ion-col size="4">
                        <ComPaymentButton />
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-toolbar>
    </ion-footer>
 <ion-popover trigger="discount" trigger-action="click" :dismiss-on-select="true">
    <ion-content class="ion-padding">
        <ion-list>
            <ion-item lines="full" button @click="onSaleDiscountPercent">
                <img slot="start" src="/assets/percent_icon.svg" style="height:20px;width:20px;"/>
                <ion-label style="margin-left: 20px;">{{ t("Discount Percent") }}</ion-label>
            </ion-item>
            
            <ion-item button lines="full" @click="onSaleDiscountAmount">
                <ion-icon :icon="logoUsd" slot="start"/>
                <ion-label  >{{ t("Discount Amount") }}</ion-label>
            </ion-item>

        </ion-list>
    </ion-content>
  </ion-popover>
</template>
<script setup>
import { ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComPaymentButton from "@/modules/ecoupon/sale-coupon/components/ComPaymentButton.vue"
import ComQuickPayButton from "@/modules/ecoupon/sale-coupon/components/ComQuickPayButton.vue"
import { logoUsd } from "ionicons/icons"

const { saleDoc, onSaveAsDraft,onSaleDiscountPercent,onSaleDiscountAmount } = useSaleCoupon()

const t = window.t




</script>