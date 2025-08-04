<template>
<ion-list>
    <ion-item   v-for="(p, index) in products" :key="index" button @click="onSelectProduct(p)"> 
        {{ p.product_name_en }}
    </ion-item>
</ion-list>
  
</template>
    <script setup>
    import {ref} from "vue"
    import {useProductMenu} from "@/hooks/useProductMenu"
    
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const t = window.t;
 
const {onSelectProduct} = useSaleCoupon()
 
    
import { useApp } from "@/hooks/useApp";
 const {products } = useProductMenu();
 
        </script>
