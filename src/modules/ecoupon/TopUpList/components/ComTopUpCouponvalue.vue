<template>
    {{ saleProduct }}
    <ion-button 
    v-for="(p,index) in products" :key="index" :disabled="!topUpCouponInfo" 
    @click="onSelectCoupon(p)"
    >
        <template v-if="p.is_open_product==0">
<ComCurrency :value="p.price"/>
{{ p }}
        </template>
        <template v-else>
            Add Custom Amount
        </template>
        
         
    </ion-button>
   <ion-grid>
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
          
          <img :src="p.photo" alt="Coupon" class="coupon-image" />
          <ion-chip :color="p.name === topUpSaleProduct?.product_code ? 'success' : 'light'" class="top-up-product-name ">
            <ion-text  >{{ p.product_name_en }}</ion-text>
          </ion-chip>
          
          <div class="top-price">
<ion-chip color="danger">{{ p.price }}</ion-chip>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</ion-grid>


</template>
<script setup>
    import {ref,onMounted} from "vue"
    import {useProductMenu} from "@/hooks/useProductMenu"
    import {useSaleCoupon} from "@/hooks/useSaleCoupon"
    import  ComEnterCustomTopupAmount from "@/modules/ecoupon/TopUpList/components/ComEnterCustomTopupAmount.vue"

    import dayjs from "dayjs";
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
        topUpSaleProduct.value.coupons =  [{coupon:topUpCouponInfo.value.coupon_number,creation:dayjs()}]
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
}
.coupon-card:hover {
  transform: scale(1.03);
  border: 1px solid green;
}
.content-center {
    position: relative;  
    
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
    width: 80%;
    
}

.top-price{
     position: absolute;
    top:0px;
    right: 0;

}
</style>