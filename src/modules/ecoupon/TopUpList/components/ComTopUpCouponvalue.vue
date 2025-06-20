<template>
    {{ saleProduct }}
    <ion-button 
    v-for="(p,index) in products" :key="index" :disabled="!topUpCouponInfo" 
    @click="onSelectCoupon(p)"
    :color="p.name == topUpSaleProduct?.product_code?'success':''"
    >
        <template v-if="p.is_open_product==0">
<ComCurrency :value="p.price"/>
{{ p }}
        </template>
        <template v-else>
            Add Custom Amount
        </template>
        
         
    </ion-button>

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