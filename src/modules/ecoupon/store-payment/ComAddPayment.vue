<template>
  <BaseModal :title="t(docname?'Edit Store Payment':'Add Store Payment')" @onConfirm="onSave" :confirmText="t('Save')">
    
    <stack>

      <stack row equal>
        <ComSelectInput docType="POS Profile" v-model="doc.pos_profile" :label="t('POS profile')" />
        <com-input type="date" :label="t('Posting Date')" v-model="doc.posting_date" />
      </stack>

      <stack row equal>
         <com-input keyboard :label="t('Payment Amount')" v-model="doc.payment_amount" />
         <com-input keyboard :label="t('Note')" v-model="doc.note" />
         
      </stack>
    </stack>
  </BaseModal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { modalController } from '@ionic/vue'
const props = defineProps({
  docname:String,

})

const t = window.t
const doc = ref({})




async function onSave() {
  const loading = await app.showLoading()
  let result = null
 
    if (doc.value.name) {
      result = await app.updateDoc("Store Payment", doc.value.name, doc.value)
    } else {
      result = await app.createDoc("Store Payment", doc.value)
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
        const res =await  app.getDoc("Store Payment", props.docname)
        if(res.data){
          doc.value = res.data
        }
        await l.dismiss();


    } 
  })

    </script >