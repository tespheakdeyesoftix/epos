<template>

<ion-card v-if="topUpCouponInfo" class="coupon-card">
    <div class="coupon-header">
    
      <ion-card-header>
        <ion-card-title>{{ topUpCouponInfo?.product_name }}</ion-card-title>
        <ion-card-subtitle>{{ topUpCouponInfo?.coupon_number }}</ion-card-subtitle>
      </ion-card-header>
      <div>
        <ion-chip color="primary">
             <ComCurrency :value="topUpCouponInfo?.coupon_balance" />
        </ion-chip>
      </div>
    </div>
    <ion-card-content>
        <ion-card class="ion-no-padding ion-no-margin">
            <ion-card-content class="flex gap-3 align-item-center">
          <ion-avatar class="border-1" slot="start">
            <Img v-if="topUpCouponInfo?.customer?.photo" :src="topUpCouponInfo?.customer?.photo" alt="Customer" />
            <div class="avatar-placeholder" v-else >{{ getAvatarLetter(topUpCouponInfo?.customer?.customer_name) }}</div>
           
          </ion-avatar>
          <ion-label>
            <div class="flex align-item-center">
            <h2>{{ topUpCouponInfo?.customer?.customer_name }}</h2>  
            <ion-chip class=" text-small" color="primary" outline>
               {{ topUpCouponInfo?.customer?.customer_group }}
              </ion-chip></div>
            <p>{{t("ID")}}: {{ topUpCouponInfo?.customer?.name }}</p>
            <p>{{t("Phone")}}: {{ topUpCouponInfo?.customer?.phone_number }}</p>
          </ion-label>        
            </ion-card-content>

        </ion-card>
      <ion-grid class="coupon-details">
  <ion-row>
    <ion-col size="6">
      <div class="detail-label">
        {{ t('Sale Number') }} : {{ topUpCouponInfo?.sale }}
      </div>
    </ion-col>
    
    <ion-col size="6">
  <div class="detail-label">
    {{ t('Posting Date') }} : 
    {{ topUpCouponInfo?.posting_date ? dayjs(topUpCouponInfo.posting_date).format("DD/MM/YYYY") : '' }}
  </div>
</ion-col>

  </ion-row>
  <ion-row>
   <ion-col size="6">
  <div class="detail-label">
    {{ t('Transaction Date') }}:
    {{ topUpCouponInfo?.transaction_date ? dayjs(topUpCouponInfo.transaction_date).format("DD/MM/YYYY") : '' }}
  </div>
</ion-col>


     <ion-col size="6">
      <div class="detail-label">
        {{ t('Actual Balance') }}: <ComCurrency :value="topUpCouponInfo?.actual_amount_balance" />
      </div>
    </ion-col>
    

  </ion-row>
</ion-grid>
<ion-button
  class="w-full ion-no-padding"
  style="font-size: 10px;"
  fill="clear"
  @click="isOpen = !isOpen"
>
  {{t("Transaction")}}
  <ion-icon
    :icon="isOpen ? chevronUpOutline : chevronDownOutline"
    slot="end"
  />
</ion-button>

      <div class="terms" >
       <ion-grid  v-if="isOpen" class="coupon-transaction-table" >
  <ion-row class="header-row" >
    <ion-col size="3"><strong>{{ t("Transaction Type") }}</strong></ion-col>
    <ion-col size="3"><strong>{{ t("Price") }}</strong></ion-col>
    <ion-col size="3"><strong>{{ t("Markup") }}</strong></ion-col>
    <ion-col size="3"><strong>{{ t("Coupon Amount") }}</strong></ion-col>
  </ion-row>

  <ion-row v-for="(tx, index) in topUpCouponInfo?.coupon_transaction" :key="index" class="data-row">

    <ion-col size="3">{{ t(tx.transaction_type) }}</ion-col>
    <ion-col size="3">
      <ComCurrency :value="tx.input_actual_amount" />
    </ion-col>
    <ion-col size="3">
      {{ tx.markup_percentage.toFixed(2) }}%
    </ion-col>
    <ion-col size="3">
        <ComCurrency :value="tx.coupon_amount" :currency="tx.currency" />
    </ion-col>
  </ion-row>
</ion-grid>


      </div>
    </ion-card-content>
  </ion-card>
</template>
<script setup>
import {ref, onMounted}  from "vue"
import { getAvatarLetter } from "@/helpers/utils"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
const { topUpCouponInfo} = useSaleCoupon()
const isOpen = ref(false);
import dayjs from 'dayjs';

const t = window.t
</script>
<style scoped>
.coupon-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-top: 6px solid #3880ff;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding-right: 16px;
}

.terms {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px dashed #ddd;
  font-size: 0.9rem;
  color: #666;
}
</style>