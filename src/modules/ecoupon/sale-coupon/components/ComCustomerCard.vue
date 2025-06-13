<template>
   
  <ion-card button @click="onSelectCustomer">
     {{ saleDoc.customer }}
  </ion-card> 
  
   
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { onMounted } from "vue";

const { saleDoc,customer } = useSaleCoupon()

async function onSelectCustomer(){
    const result = await app.utils.onSelectCustomer();
    console.log(result)
}
function getCustomer(name){
  
}
onMounted(()=>{

})
</script>