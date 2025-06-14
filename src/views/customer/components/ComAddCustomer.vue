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

</stack>
    </BaseModal>
</template>
<script setup>
import { ref } from 'vue';

    const t = window.t;
    
    const doc = ref({})

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