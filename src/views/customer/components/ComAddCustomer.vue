<template>
  <BaseModal :title="t(docname?'Edit Customer':'Add Customer')" @onConfirm="onSave" :confirmText="t('Save')">
    
    <stack>
      <stack row equal>
        <com-input keyboard :label="t('Customer Code')" v-model="doc.customer_code" />
        <ComSelectInput docType="Customer Group" v-model="doc.customer_group" :label="t('Customer Group')" />
      </stack>

      <stack row equal>
        <com-input keyboard :label="t('Customer Name EN')" v-model="doc.customer_name_en" />
        <com-input keyboard :label="t('Customer Name KH')" v-model="doc.customer_name_kh" />
      </stack>

      <stack row equal>
        <ComSelectInput docType="Gender" v-model="doc.gender" :label="t('Gender')" />
        <com-input type="date" :label="t('Date of Birth')" v-model="doc.date_of_birth" />
      </stack>

      <stack row equal>
        <com-input keyboard :label="t('Company Name')" v-model="doc.company_name" />
        <com-input keyboard :label="t('Jobs')" v-model="doc.jobs" />
      </stack>

      <ion-text color="primary">
        <h2 class="mt-2 mb-0">{{ t("Contact Infromation") }}</h2>
      </ion-text>

      <stack row equal>
        <com-input keyboard :label="t('Phone Number 1')" v-model="doc.phone_number" />
        <com-input keyboard :label="t('Phone Number 2')" v-model="doc.phone_number_2" />
      </stack>

      <stack row equal>
        <com-input keyboard :label="t('Email Address')" v-model="doc.email_address" />
        <ComSelectInput docType="Province" v-model="doc.province" :label="t('Province')" />
      </stack>

      <stack row equal>
        <ComSelectInput docType="Country" v-model="doc.country" :label="t('Country')" />
        <!-- <ComSelectInput docType="Country" v-model="doc.country" :label="t('Country')" /> -->
      </stack>

      <ion-text color="primary">
        <h2 class="mt-2 mb-0">{{ t("Address & Note") }}</h2>
      </ion-text>

      <stack row equal>
        <com-input keyboard :label="t('Address')" v-model="doc.address" />
        <com-input keyboard :label="t('Note')" v-model="doc.note" />
      </stack>
    </stack>
  </BaseModal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { modalController } from '@ionic/vue'
import dayjs from 'dayjs'
const props = defineProps({
  docname:String,

})
const t = window.t
const doc = ref({})

async function onSave() {
  const loading = await app.showLoading()

  if (doc.value.date_of_birth) {
    doc.value.date_of_birth = dayjs(doc.value.date_of_birth).format("YYYY-MM-DD")
  }
  
  let result = null
 
    if (doc.value.name) {
      result = await app.updateDoc("Customer", doc.value.name, doc.value)
    } else {
      result = await app.createDoc("Customer", doc.value)
    }
    if (result.data) {
      if(doc.value.name){
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
        const res =await  app.getDoc("Customer", props.docname)
        if(res.data){
          doc.value = res.data
        }
        await l.dismiss();


    } 
  })

    </script >