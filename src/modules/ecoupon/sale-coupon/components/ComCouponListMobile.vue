<template>
<ion-list>
    <ion-item   v-for="(p, index) in products" :key="index" button @click="onSelectProduct(p)"> 
      
        <ion-avatar class="border-1">
                    <Img v-if="p.photo" :src="p.photo" />
                    <div class="avatar-placeholder" v-else>{{ getAvatarLetter(p.product_name_en) }}
                    </div>
                </ion-avatar>

                <ion-label class="text-sm text-left price ml-4">
                     <ion-text class="block">{{ p.product_name_en }}</ion-text>
                    <ion-text class="block">{{ p.name }} </ion-text>
 <ion-chip color="success" v-for="c in getDisplayCoupon(p.name)">{{ c }}</ion-chip>
</ion-label>
         <ion-label class="text-sm text-center price" v-if="p.price > 0" slot="end">  
            <ComCurrency :value="p.price" />
          </ion-label>
       
    </ion-item>
</ion-list>
  
</template>
<script setup>
    import {ref} from "vue"
    import {useProductMenu} from "@/hooks/useProductMenu"
    import { getAvatarLetter } from "@/helpers/utils"
    import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const t = window.t;
 
 
const {onSelectProduct,saleDoc} = useSaleCoupon()
 
function getDisplayCoupon(product_code){
    const sale_products = saleDoc.value.sale_products.filter(x=>x.product_code == product_code)
    if(!sale_products) return []
    const coupons = sale_products.flatMap(x=>x.coupons).map(y=>y.coupon)
    if(coupons.length>3) return  [...coupons.slice(0,3),coupons.length-3 + 'More(s)']
    return coupons
    
}
    
import { useApp } from "@/hooks/useApp";
 const {products } = useProductMenu();
 
 

        </script>
