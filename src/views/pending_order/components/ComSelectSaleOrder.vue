<template>
    
    <ion-text class="ion-padding">
        <h4>Select Sale Order</h4>
        <p>Table: {{ data.tbl_number }}</p>
    </ion-text>
            <ion-list>
          <ion-item :button="true" :detail="false" @click="onConfirm(d.name)" v-for="(d,index) in data.sales" :key="index" >
            <ion-label>{{ d.name }}</ion-label>
            <ion-label slot="end"><ComCurrency :value="d.grand_total"/></ion-label>
          </ion-item>
           
          
        </ion-list>
     
  
    
</template>
<script setup>
const props  = defineProps({
    data:Object
})
import { popoverController } from '@ionic/vue';
const onConfirm = (name) => {
  popoverController.dismiss(name, 'confirm');
};
</script>