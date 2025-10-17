<template>
    
<BaseModal :title="t('Change Payment Type')" @onConfirm="onConfirm">

    <ion-list>
      
      <template  v-for="(p,index) in paymentData" :key="index">
<ion-item>
        <ion-label>
            <p>
                {{ t(p.payment_type) }}
            </p>
            
        </ion-label>
<p slot="end"><strong><ComCurrency :value="p.input_amount" :currency="p.currency"/></strong></p>
        
       
    </ion-item>
    <ion-item>
         <ion-select v-model="p.payment_type" :label="t('Payment Type')" @ionChange="onChangePaymentType(p)">
        <ion-select-option :value="pt.payment_type" v-for="pt in paymentTypes" >{{ t(pt.payment_type) }}</ion-select-option>
         
      </ion-select>

    </ion-item>
      </template>
    
   
    </ion-list>
     <ion-textarea v-model="note" :label="t('Note')" label-placement="floating" fill="solid" placeholder="Enter Note" style="height: 150px;"></ion-textarea>

</BaseModal>

</template>
<script setup>
 import { IonTextarea,modalController } from '@ionic/vue';
import {   ref } from 'vue'

const props = defineProps({
    data:Object
})
const note = ref("")
const paymentTypes = app.setting.pos_config.payment_type.filter(x=>!x.sale_type || x.sale_type == props.data.sale_type ).filter(x=>x.payment_type_group !='On Account');
     const t = window.t;


const paymentData = ref(JSON.parse(JSON.stringify(props.data.payment)) )
paymentData.value.forEach(p => {
  p.backup_input_amount = p.input_amount,
  p.backup_exchange_rate = p.exchange_rate
});

function onChangePaymentType(payment_data){
 
  const payment_type = paymentTypes?.find(x=>x.payment_type == payment_data.payment_type)

  payment_data.payment_type_group = payment_type.payment_type_group;
 
  payment_data.currency_format = payment_type.pos_currency_format;
  payment_data.currency = payment_type.currency;
  payment_data.currency_symbol= payment_type.currency_symbol;
  payment_data.currency_precision= payment_type.currency_precision;
  payment_data.input_amount= (payment_data.backup_input_amount / payment_data.backup_exchange_rate)*payment_type.exchange_rate;

   payment_data.exchange_rate = payment_type.exchange_rate;
 
 
}




 

async function onConfirm(){
  if (paymentData.value[0].payment_type == props.data.payment[0].payment_type){
    await app.showWarning("You haven’t changed the payment type.")
    return;
  }
  const loading = await app.showLoading();
  const {data,error } = await app.postApi("epos_restaurant_2023.selling.doctype.sale.sale.change_payment_type",{
    data:{
       ...paymentData.value[0],
       note:note.value
    },
    old_data:props.data.payment[0]
  })
 await loading.dismiss();
  if (!error){
      modalController.dismiss(true, 'confirm');
  }
 
}

</script>