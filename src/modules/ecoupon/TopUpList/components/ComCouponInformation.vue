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
            <Img :src="topUpCouponInfo?.customer?.photo" alt="Customer" />
          </ion-avatar>
          <ion-label>
            <div class="flex align-item-center">
            <h2>{{ topUpCouponInfo?.customer?.customer_name }}</h2>  <ion-chip class=" text-small" color="primary" outline>
               {{ topUpCouponInfo?.customer?.customer_group }}
              </ion-chip></div>
            <p>ID: {{ topUpCouponInfo?.customer?.name }}</p>
            <p>Phone: {{ topUpCouponInfo?.customer?.phone_number }}</p>
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
        {{ t('Posting Date') }} : {{ topUpCouponInfo?.posting_date }}
      </div>
    </ion-col>
  </ion-row>
  <ion-row>
    <ion-col size="6">
      <div class="detail-label">
        {{ t('Transaction Date') }}: {{ topUpCouponInfo?.transaction_date }}
      </div>
    </ion-col>
     <ion-col size="6">
      <div class="detail-label">
        {{ t('Actual Balance') }}: 
        <ComCurrency :value="topUpCouponInfo?.actual_amount_balance" />
      </div>
    </ion-col>
    

  </ion-row>
</ion-grid>
      <div class="terms">
       <ion-grid class="coupon-transaction-table">
  <ion-row class="header-row">
    <ion-col size="3"><strong>{{ t("Transaction Type") }}</strong></ion-col>
    <ion-col size="3"><strong>{{ t("Price") }}</strong></ion-col>
    <ion-col size="3"><strong>{{ t("Markup") }}</strong></ion-col>
    <ion-col size="3"><strong>{{ t("Coupon Amount") }}</strong></ion-col>
  </ion-row>

  <ion-row v-for="(tx, index) in topUpCouponInfo?.coupon_transaction" :key="index" class="data-row">
    <ion-col size="3">{{ tx.transaction_type }}</ion-col>
    <ion-col size="3">
      <ComCurrency :value="tx.input_actual_amount" />
    </ion-col>
    <ion-col size="3">
      {{ tx.markup_percentage.toFixed(2) }}%
    </ion-col>
    <ion-col size="3">
        <ComCurrency :value="tx.coupon_amount" />
    </ion-col>
  </ion-row>
</ion-grid>


      </div>
    </ion-card-content>
  </ion-card>
</template>
<script setup>
import {ref, onMounted}  from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const { topUpCouponInfo} = useSaleCoupon()
 
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