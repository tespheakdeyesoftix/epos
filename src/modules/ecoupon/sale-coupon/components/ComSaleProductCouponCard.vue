<template>
    <template v-if="data">
 <ion-card>
   
        <Img :src="product?.photo"/>
        {{ product.product_code }}
        {{ product.product_name }}
        QTY: {{ data.length }}
        <ComCurrency :value="totalAmount" />
        <hr/>
         <ion-chip v-for="(c,index) in displayCoupons" :key="index">{{ c }}</ion-chip>
         <ion-chip v-if="data.length>3" color="primary">{{ data.length - 3 }} {{ t("More(s)") }}</ion-chip>
         <ion-button @click="onEditSaleProductCoupon(product)">{{t("Edit")}}</ion-button>
    </ion-card>
</template>
   
</template>
<script setup >
import { computed } from 'vue';
 
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
 
const { onEditSaleProductCoupon } = useSaleCoupon()


const props = defineProps({
    data:Object
})
const t = window.t;
const product = computed(()=>{
    return props.data[0]
})
const totalAmount = computed(()=>{
   return props.data.reduce((sum, item) => sum + item.total_amount, 0);
})

const displayCoupons = computed(()=>{
   const allCoupuns = props.data.map(x=>x.coupon);
   if(allCoupuns.length>3){
    return  allCoupuns.slice(0, 3);
   }
   return allCoupuns
})


 


</script>

