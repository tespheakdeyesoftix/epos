<template>

    <GetData doctype="Product" :params="params" >
        <template v-slot:default="{data}">
            <ion-grid>
  <ion-row>
    <ion-col
      size="12"
      size-lg="4"
      v-for="(p, index) in data"
      :key="index"
    >
      <ComProductCard :data="p" />
    </ion-col>
  </ion-row>
</ion-grid>
        </template>
    </GetData>

</template>
    <script setup>
    import {ref} from "vue"
    import ComProductCard from "@/modules/ecoupon/sale-coupon/components/ComProductCard.vue"
const params = ref({
    fields:["name","product_name_en","product_name_kh","photo",
    "price","unit","allow_discount","allow_change_price","is_open_product",
    "coupon_value","coupon_markup_type","coupon_markup_value",
    "append_quantity"
    ],
    filters:[["is_coupon","=",1],["disabled","=",0]],
    limit: 500000,
    orderBy: {
        field: 'sort_order',
        order: 'asc',
    },
})
        </script>
