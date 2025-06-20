<template>
    <BaseModal>

<stack row equal class="mb-4">
             <com-input :label="t('Price')" v-model="doc.price" type="number" keyboard />
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
<com-input  :label="t('Note')" :placeholder="t('Enter note here')"  type="text-area" stateKey="sale_product_note"></com-input>
        </div>
        
    </BaseModal>
</template>
<script setup>
    const props =defineProps({
        data:Object
    })
    import {ref,computed} from "vue"
    const t =window.t;
    
    const doc =ref({
        coupon_markup_type :  props.data.coupon_markup_type

    })
    
const couponValue = computed(() => {
    if (doc.value.coupon_markup_type == 'Percent') {
        return (doc.value.price ?? 0) + ((doc.value.price ?? 0) * ((doc.value.coupon_markup_value ?? 0) / 100))
    } else {
        return doc.value.coupon_value;
    }
})

</script>
