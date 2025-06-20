<template>

 
            <ion-grid>
  <ion-row>
    <ion-col
      size="12"
      size-lg="4"
      v-for="(p, index) in products"
      :key="index"
    >
      <ComProductCard :data="p" />
    </ion-col>
  </ion-row>
</ion-grid>
 

</template>
    <script setup>
    import {ref} from "vue"
    import {useProductMenu} from "@/hooks/useProductMenu"
    import ComProductCard from "@/modules/ecoupon/sale-coupon/components/ComProductCard.vue"
 const {products } = useProductMenu();
        </script>
