<template>
    <ion-card class="relative">
      <ion-card-title class="pl-2 pt-2">
    <div class="flex align-item-center gap-2">
 <ion-chip color="danger bg-red-500 text-white">2</ion-chip>
 <ion-label class="label-top-up">{{ t('Choose Top-Up Option') }}</ion-label>
  </div>
      </ion-card-title>
      <ion-card-content class="ion-no-padding">
        <ion-grid class="ion-no-padding">
  <ion-row>
    <ion-col
      v-for="(p, index) in products"
      :key="index"
      size="6"
      size-md="4"
    >
      <ion-card
        :disabled="!topUpCouponInfo"
        @click="onSelectCoupon(p)"
        class="coupon-card ion-no-padding"
      >
        <ion-card-content class="content-center ion-no-padding">
               <ion-avatar class="coupon-image" style="height: 130px;" >
                <Img v-if="p.photo" :src="p.photo" class="coupon-image coupon-fix"/>
                <div class="avatar-placeholder coupon-image"   v-else>{{ getAvatarLetter(p.product_name_en) }}</div>
            </ion-avatar>
          <ion-card :color="p.name === topUpSaleProduct?.product_code ? 'success' : 'light'" class="top-up-product-name">
            <ion-text  >{{ p.product_name_en }}</ion-text>
          </ion-card>
          <div class="top-price">
<ion-card class="padding" color="danger">
  <ComCurrency :value="p.price" /></ion-card>
          </div>
          <ion-card v-if="p.is_open_product!=0" class="custom" color="warning">
            Custom
          </ion-card>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</ion-grid>
      </ion-card-content>
</ion-card>
</template>
<script setup>
    import {ref,onMounted} from "vue"
    import {useProductMenu} from "@/hooks/useProductMenu"
    import {useSaleCoupon} from "@/hooks/useSaleCoupon"
    import  ComEnterCustomTopupAmount from "@/modules/ecoupon/TopUpList/components/ComEnterCustomTopupAmount.vue"
    const t = window.t;
    import dayjs from "dayjs";
import ComCurrency from "@/views/components/public/ComCurrency.vue";
import { getAvatarLetter } from "@/helpers/utils"
    const {products} = useProductMenu();
    const {saleDoc,topUpCouponInfo,topUpSaleProduct} = useSaleCoupon();
     
    saleDoc.value.sale_products = [topUpSaleProduct.value]
    
    async function onSelectCoupon(p){
               let price = p.price
        let couponValue = p.coupon_value
        // check if is open price enter coupon price 
        if(p.is_open_product==1){
            const result = await app.openModal({
                component:ComEnterCustomTopupAmount,
                componentProps:{
                    data:p
                },
                cssClass:"top-up-coupon-amount"
            })
            if(!result) return

            price = result.price
            couponValue = result.coupon_value
        }


  
        topUpSaleProduct.value.product_code = p.name 
        topUpSaleProduct.value.product_name= p.product_name_en,
        topUpSaleProduct.value.quantity= 1
        topUpSaleProduct.value.unit = p.unit
        topUpSaleProduct.value.sub_total = price
        topUpSaleProduct.value.price = price
        topUpSaleProduct.value.total_amount =  price
        topUpSaleProduct.value.coupons =  [{name:topUpCouponInfo.value.coupon_code, coupon:topUpCouponInfo.value.coupon_number,creation:dayjs(),balance_coupon_value:topUpCouponInfo.value.coupon_balance,balance_amount:topUpCouponInfo.value.actual_amount_balance}]
        topUpSaleProduct.value.allow_discount =  p.allow_discount  
        topUpSaleProduct.value.coupon_markup_type  =  p.coupon_markup_type
        topUpSaleProduct.value.coupon_markup_value  =  p.coupon_markup_value
        topUpSaleProduct.value.coupon_value  = couponValue 
        topUpSaleProduct.value.is_open_product = p.is_open_product,
        topUpSaleProduct.value.append_quantity = p.append_quantity
        topUpSaleProduct.value.allow_free = p.allow_free
        topUpSaleProduct.value.regular_price = price;



    }

    onMounted(()=>{
        
    })
</script>
<style scoped>
.coupon-card {
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
  max-height: 130px;
}
.coupon-card:hover {
  transform: scale(1.03);
  border: 1px solid green;
  border: 1px solid green;
}
.content-center {
    position: relative;  
    
}
.coupon-fix{
  object-fit: fill;
  height: 100%;
}
.coupon-image {
  width: 100%;
  border-radius: 12px;
  max-height: 130px;
  object-fit: cover;
}
.top-up-product-name{
    position: absolute;
    bottom:10px;
    border-radius: 12px;
    left:10%;
    text-align: center;
    padding: 5px;
    margin: 0 !important;
    width: 80%;
    
}
.custom{
  position: absolute;
  top: 0;
  left: 0;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 30px;
  border-bottom-right-radius: 6px;
  transform: translate(-20%, -20%) rotate(-20deg);
}
.top-price{
    position: absolute;
    top:0;
    right: 0;
}
.top-price .padding{
padding:5px 10px;
 border-radius: 12px;
}

</style>