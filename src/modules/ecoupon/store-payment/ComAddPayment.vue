<template>
  <BaseModal :title="t(docname?'Edit Store Payment':'Add Store Payment')" @onConfirm="onSave" :confirmText="t('Save')">
    <stack>

      <stack row equal>
        <ComSelectInput docType="POS Profile" v-model="doc.pos_profile" :label="t('POS profile')" />
        <com-input type="date" :label="t('Posting Date')" v-model="doc.posting_date" />
      </stack>

 
    </stack>
     {{ docChanged }}
    <card :header="t('Payment Type')" class="ion-padding ion-no-margin mt-4 mb-4"  >
      <ion-grid class="">
        <ion-row  v-for="(p, index) in doc.payments" :key="index">
            <ion-col :size="6">

    <Select size="large" v-model="p.payment_type"  @change="(e) => onSelectPayemntType(e, p)"  :options="paymentTypes" optionLabel="payment_type" optionValue="payment_type"  class="w-full" variant="filled" 
       style="height: 55px;"
      />
  
            </ion-col>
            <ion-col :size="5">
               <com-input  type="number"  v-model="p.input_amount" :placeholder="t('Payment Amount')" ></com-input>
            </ion-col>
            <ion-col :size="1">
              <ion-button :disabled="doc.payments.length==1" color="danger" shape="round" fill="clear" @click="onRemovePayment(index)">
                <ion-icon :icon="removeOutline" slot="icon-only" />
              </ion-button>
            </ion-col>
        </ion-row>
        <ion-row>
          <ion-col :size="6">
            <ion-label><strong>
 {{ t("Total Payment") }}
            </strong></ion-label>
           
          </ion-col>
          <ion-col :size="6">
            <strong>
<ComCurrency :value="totalPaymentAmount" />
            </strong>
            
          </ion-col>
        </ion-row>
      </ion-grid>
   
          
<ion-button shape="round" fill="clear" @click="onAddPayment">
  <ion-icon :icon="addOutline" slot="start" />
  {{ t("Add Payment") }}</ion-button>
         
    </card>

     <com-input   type="text-area" keyboard :label="t('Note')" v-model="doc.note" />
     <ion-button @click="onSubmit">Submit</ion-button>
  </BaseModal>
</template>

<script setup>
import { computed, onMounted, ref ,toRaw} from 'vue'
import { modalController } from '@ionic/vue'

import Select from 'primevue/select';
import { addOutline, removeOutline } from 'ionicons/icons';
import dayjs from 'dayjs';

const originalData  = ref({}) 

const props = defineProps({
  docname:String,

})

const t = window.t
const paymentTypes = app.setting.pos_config.payment_type;
 


const doc = ref({
  working_day: app.setting.working_day.name,
  cashier_shift:app.setting.cashier_shift.name,
  posting_date: new Date(app.setting.working_day.posting_date),
  payments:[
    {payment_type:paymentTypes[0].payment_type}
  ]
})

const docChanged = computed(()=>{
  return JSON.stringify(toRaw(doc)) !== JSON.stringify(toRaw(originalData));
})
function onSelectPayemntType(event,p){
 
let pt = event.value;
pt = paymentTypes.find(x=>x.payment_type == pt)

 p.payment_type = pt.payment_type
 p.exchange_rate = pt.exchange_rate
 p.currency = pt.currency


}

function onRemovePayment(index){
  doc.value.payments.splice(index,1)
}

function onAddPayment(){
  doc.value.payments.push({})
}

async function onSubmit(){
    const saveDoc = JSON.parse(JSON.stringify(doc.value))
  saveDoc.posting_date = dayjs(saveDoc.posting_date).format("YYYY-MM-DD")
  await app.submitDoc(saveDoc);
}

const totalPaymentAmount = computed(()=>{
  return doc.value.payments.reduce((sum, item) => sum + (item?.input_amount ||0) / (item.exchange_rate || 1), 0);
})

async function onSave() {
  const loading = await app.showLoading()
  let result = null
  const saveDoc = JSON.parse(JSON.stringify(doc.value))
  saveDoc.posting_date = dayjs(saveDoc.posting_date).format("YYYY-MM-DD")
    if (saveDoc.name) {
      result = await app.updateDoc("Store Payment", saveDoc.name, saveDoc)
    } else {
      result = await app.createDoc("Store Payment", saveDoc)
    }
    if (result.data) {
      if(saveDoc.name){
        app.showSuccess(`Update successfully.`)
      }
       else {
        app.showSuccess(`Added successfully.`)
       }
      modalController.dismiss(result.data, 'confirm')
      
    } 
    await loading.dismiss() 
  }


  onMounted(async ()=>{
    if(props.docname){
        const l = await app.showLoading();
        const res =await  app.getDoc("Store Payment", props.docname)
        if(res.data){
          doc.value = res.data
          originalData.value = JSON.parse(JSON.stringify(doc.value))
        }
        await l.dismiss();


    } 
  })

    </script >