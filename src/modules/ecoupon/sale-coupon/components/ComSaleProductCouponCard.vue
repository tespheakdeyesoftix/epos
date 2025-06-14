<template>
    <template v-if="data">
 <ion-card>
   
        <Img :src="data?.photo"/>
        {{ data.product_code }}
        {{ data.product_name }}
        QTY: {{ data.quantity }}
        {{t("Price")}}: 
        <ComCurrency :value="data.price" />
        {{t("Total Amount")}}: 
        <ComCurrency :value="data.total_amount" />

        <hr/>
         <ion-chip v-for="(c,index) in displayCoupons" :key="index">{{ c }}</ion-chip>
         <ion-chip @click="onEditSaleProductCoupon(data)" v-if="data.coupons.length>3" color="primary">{{ data.coupons.length - 3 }} {{ t("More(s)") }}</ion-chip>
         <ion-button @click="onEditSaleProductCoupon(data)">{{t("Edit")}}</ion-button>
         <ion-button color="danger" @click="onDeleteSaleProduct(index)">{{t("Delete")}}</ion-button>
    </ion-card>
</template>
   
</template>
<script setup >
import { computed } from 'vue';
 
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
 
const { onEditSaleProductCoupon,onDeleteSaleProduct } = useSaleCoupon()


const props = defineProps({
    data:Object,
    index:Number
})
const t = window.t;
 
const displayCoupons = computed(()=>{
   const allCoupuns = props.data.coupons.map(x=>x.coupon);
   if(allCoupuns.length>3){
    return  allCoupuns.slice(0, 3);
   }
   return allCoupuns
})

 


 


</script>

