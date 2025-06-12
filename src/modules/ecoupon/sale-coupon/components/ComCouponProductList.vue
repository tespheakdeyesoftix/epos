<template>
    <GetData doctype="Product" :params="params" >
        <template v-slot:default="{data}">
               <ComProductCard :data="p" v-for="(p,index) in data" :key="index"  />
        </template>
         
           
    </GetData>
</template>
    <script setup>
    import {ref} from "vue"
    import ComProductCard from "@/modules/ecoupon/sale-coupon/components/ComProductCard.vue"
const params = ref({
    fields:["name","product_name_en","product_name_kh","photo","price"],
    filters:[["is_coupon","=",1],["disabled","=",0]],
    limit: 500000,
    orderBy: {
        field: 'sort_order',
        order: 'asc',
    },
})
        </script>
