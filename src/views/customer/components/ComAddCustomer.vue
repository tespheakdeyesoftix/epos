<template>
    <BaseModal :title="t('Add Customer')" @onConfirm="onSave" :confirmText="t('Save')">
    
        <stack >
        <stack row equal>
            <com-input keyboard  :label="t('Customer Code')" v-model="doc.customer_code"></com-input>
            <ComSelectInput docType="Customer Group"  v-model="doc.customer_group" :label="t('Customer Group')" />
        </stack>
        <stack row equal>
            <com-input  keyboard :label="t('Customer Name EN')" v-model="doc.customer_name_en"></com-input>
            <com-input  keyboard :label="t('Customer Name KH')" v-model="doc.customer_name_kh"></com-input>
        </stack>
        <stack row equal>
             <ComSelectInput docType="Gender"  v-model="doc.gender" :label="t('Gender')" />
           
             <com-input type="date" :label="t('Date of Birth')" v-model="doc.date_of_birth"/>
        </stack>
        <stack row equal>
            <com-input  keyboard :label="t('Company Name')" v-model="doc.company_name"></com-input>
            <com-input  keyboard :label="t('Jobs')" v-model="doc.jobs"></com-input>
        </stack>

        <ion-text color="primary">
            <h2 class="ion-no-margin">{{t("Conatct Infromation")}}</h2>
        </ion-text>

        <stack row equal>
            <com-input  keyboard :label="t('Phone Number 1')" v-model="doc.phone_number"></com-input>
            <com-input  keyboard :label="t('Phone Number 2')" v-model="doc.phone_number_2"></com-input>
        </stack>
        <stack row equal>
            <com-input keyboard  :label="t('Email Address')" v-model="doc.email_address"></com-input>
            <ComSelectInput docType="Province"  v-model="doc.province" :label="t('Province')" />
        </stack>
        <stack row >
         
            <ComSelectInput docType="Country"  v-model="doc.country" :label="t('Country')" style="width: 350px"/>   
        </stack>
        <ion-text color="primary">
            <h2 class="ion-no-margin">{{t("Address & Note")}}</h2>
        </ion-text>
        <stack row equal>
            <com-input  keyboard :label="t('Address')" v-model="doc.address"></com-input>
            <com-input  keyboard :label="t('Note')" v-model="doc.note"></com-input>
        </stack>
</stack>
    </BaseModal>
</template>
<script setup>
 
import { ref } from 'vue';

    const t = window.t;
    const doc = ref({})
     import { modalController } from '@ionic/vue';
    async function onSave(){
        let result = null
        const loading = await app.showLoading();
        if(doc.value.name){
            result = await app.updateDoc("Customer",doc.value.name,doc.value)
        }else {
              result = await app.createDoc("Customer",doc.value)
        }

        if(result){

        }
        // close modal send result to parent compoent
        await loading.dismiss();
    }
    
</script>