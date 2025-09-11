<template>
 
<ion-list class="summary-sale">
    <ion-item v-if="totalQuantity>0">
        <ion-label class="ion-no-padding">{{ t("Total Coupon") }}</ion-label>
        <ion-label slot="end">{{ totalQuantity }}</ion-label>
    </ion-item>
    <ion-item v-if="subTotal>0">
        <ion-label>{{ t("Sub Total") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="subTotal"/> </ion-label>
    </ion-item>
    <ion-item v-if="totalSaleProductDiscount>0">
        <ion-label>{{ t("Sale Product Dis.") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="totalSaleProductDiscount"/></ion-label>
    </ion-item>
    <ion-item v-if="totalSaleDiscountAmount>0">
        <ion-label>{{ t("Sale Discountable Amount") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="saleDiscoutableAmount"/></ion-label>
    </ion-item>
    
    <ion-item v-if="saleDoc.discount>0 || saleDoc.sale_discount >0">
        <ion-label >
            {{ t("Sale Discount") }}
            <ion-text color="danger" v-if="saleDoc.discount_type=='Percent'">({{ saleDoc.discount }}% )</ion-text>     
           
        </ion-label>
         <ion-icon :icon="alertCircleOutline"  v-tooltip.top+="saleDoc.discount_note"></ion-icon>
        <ion-label slot="end"><ComCurrency :value="totalSaleDiscountAmount"/></ion-label>
    </ion-item>
    <ion-item v-if="totalCouponValue>0" >
        <ion-label>{{ t("Total Coupon Value") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="totalCouponValue"/></ion-label>
    </ion-item>
    <ion-item v-if="saleDoc.note">
        <ion-label>{{ t("Note") }}</ion-label>
        <ion-label slot="end">{{ saleDoc.note }}</ion-label>
    </ion-item>

</ion-list>
</template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import { alertCircleOutline, alertOutline } from "ionicons/icons";
 
const {saleDoc,totalQuantity,subTotal,totalSaleProductDiscount,saleDiscoutableAmount,totalSaleDiscountAmount,totalCouponValue} = useSaleCoupon()

const t = window.t;

</script>
<style scoped>
.ion-no-padding.sc-ion-label-md-h.sc-ion-label-md-s.md , .sc-ion-label-md-h.sc-ion-label-md-s.md{
    min-height: 10px !important;
    padding: 2px;
    margin: 0;
}

</style>