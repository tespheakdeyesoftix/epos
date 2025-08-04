<template>
<ion-list>
    <ion-item   v-for="(p, index) in products" :key="index" button @click="onSelectProduct(p)"> 
      
        <ion-avatar class="border-1">
                    <Img v-if="p.photo" :src="p.photo" />
                    <div class="avatar-placeholder" v-else>{{ getAvatarLetter(p.product_name_en) }}
                    </div>
                </ion-avatar>

                <ion-label class="text-sm text-left price ml-4" > 
                    {{ p.name }} - {{ p.product_name_en }}
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
 
const {onSelectProduct} = useSaleCoupon()
 
    
import { useApp } from "@/hooks/useApp";
 const {products } = useProductMenu();
 
        </script>
