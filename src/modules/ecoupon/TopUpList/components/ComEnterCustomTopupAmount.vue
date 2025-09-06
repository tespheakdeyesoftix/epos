<template>
    <BaseModal :title="t('Top Up Coupon Amount')" @onConfirm="onConfirm">

<stack row equal class="mb-4">
             <com-input focus :label="t('Price')" v-model="doc.price" type="number" keyboard />
            <ion-select v-model="doc.coupon_markup_type" :label="t('Markup Type')" label-placement="floating" fill="outline"
                aria-label="Markup Type" interface="popover" :placeholder="t('Markup Type')">
                <ion-select-option value="Percent">Percent</ion-select-option>
                <ion-select-option value="Amount">Amount</ion-select-option>
            </ion-select>
        </stack>

            <stack row equal>

            <com-input :disabled="doc.coupon_markup_type == 'Amount'" :label="t('Markup Percent')"
                v-model="doc.coupon_markup_value" type="number" keyboard />

            <ion-input disabled v-if="doc.coupon_markup_type == 'Percent'" :label="t('Coupon Value')"
                label-placement="floating" fill="outline" :value="couponValue"></ion-input>
            <com-input v-else :label="t('Coupon Value')" v-model="doc.coupon_value" type="number" keyboard /> 
        </stack>  
        
        <div class="ion-margin-top">
<com-input  :label="t('Note')" :placeholder="t('Enter note here')"  type="text-area" 
storageKey="sale_product_note"></com-input>
        </div>
        
    </BaseModal>
</template>
<script setup>
import { modalController } from "@ionic/vue"
    const props =defineProps({
        data:Object
    })
    import {ref,computed} from "vue"
    const t =window.t;
    
    const doc =ref({
        coupon_markup_type :  props.data.coupon_markup_type,
        coupon_markup_value:props.data.coupon_markup_type=="Percent"? props.data.coupon_markup_value:0

    })
    
const couponValue = computed(() => {
    if (doc.value.coupon_markup_type == 'Percent') {
        return (doc.value.price ?? 0) + ((doc.value.price ?? 0) * ((doc.value.coupon_markup_value ?? 0) / 100))
    } else {
        return doc.value.coupon_value;
    }
})

function onConfirm(){
if((doc.value.price || 0)==0){
    app.showWarning("Please enter coupuon price");
    return
}

// if(doc.value.coupon_markup_type=="Percent" && (doc.value.coupon_markup_value || 0) <=0){
//     app.showWarning("Please enter coupon markup value");

//     return
// }


if(doc.value.coupon_markup_type=="Amount" && (couponValue.value ||0)==0){
    app.showWarning("Please enter coupon value");

    return
}



modalController.dismiss({...doc.value,coupon_value:couponValue.value}, 'confirm')
}

</script>
