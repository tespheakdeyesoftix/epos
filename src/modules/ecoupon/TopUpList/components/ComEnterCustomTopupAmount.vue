<template>
    <BaseModal :title="t('Top Up Coupon Amount')" @onConfirm="onConfirm">
        <template v-if="plateform == 'mobile' || plateform == 'tablet'">
             <div style=" display: flex;justify-content: center;gap: 10px;">
                <ion-chip :color="selectedCurrency == 'KHR' ? 'primary' : ''" @click="onChangeInputCurrency('KHR')">{{
                    t("KHR") }}</ion-chip>
                <ion-chip :color="selectedCurrency == 'USD' ? 'primary' : ''" @click="onChangeInputCurrency('USD')">{{
                    t("USD") }}</ion-chip>
            </div>

<ComKeyPadInput v-model="doc.price"></ComKeyPadInput>
            </template>
            <template v-else> 
            <stack row equal class="mb-4">
                <com-input focus :label="t('Price')" v-model="doc.price" type="number" keyboard />
                <ion-select v-model="doc.coupon_markup_type" :label="t('Markup Type')" label-placement="floating"
                    fill="outline" aria-label="Markup Type" interface="popover" :placeholder="t('Markup Type')">
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
        </template>
        
        <div class="ion-margin-top">
            <com-input :label="t('Note')" :placeholder="t('Enter note here')" type="text-area"
                storageKey="sale_product_note"></com-input>
        </div>

    </BaseModal>
</template>
<script setup>
import { modalController } from "@ionic/vue"
import ComKeyPadInput from "@/views/components/public/ComKeyPadInput.vue"
const props = defineProps({
    data: Object
})
import { ref, computed, onMounted } from "vue"
const t = window.t;

const selectedCurrency = ref("KHR")
const exchange_rate = ref(app.setting.exchange_rate);

const plateform = ref(app.utils.getPlateform())
const minAmountKHR = ref(500)
const maxAmountKHR = ref(100000)
const minAmountUSD = ref(1)
const maxAmountUSD = ref(100)



const doc = ref({
    coupon_markup_type: props.data.coupon_markup_type,
    coupon_markup_value: props.data.coupon_markup_type == "Percent" ? props.data.coupon_markup_value : 0

})

const couponValue = computed(() => {
    if (doc.value.coupon_markup_type == 'Percent') {
        return (doc.value.price ?? 0) + ((doc.value.price ?? 0) * ((doc.value.coupon_markup_value ?? 0) / 100))
    } else {
        return doc.value.coupon_value;
    }
})

function onChangeInputCurrency(currency){
    selectedCurrency.value = currency;
    
}


function onConfirm() {
    if ((doc.value.price || 0) == 0) {
        app.showWarning("Please enter coupuon price");
        return
    }

    // if(doc.value.coupon_markup_type=="Percent" && (doc.value.coupon_markup_value || 0) <=0){
    //     app.showWarning("Please enter coupon markup value");

    //     return
    // }


    if (doc.value.coupon_markup_type == "Amount" && (couponValue.value || 0) == 0) {
        app.showWarning("Please enter coupon value");

        return
    }
    
    // validate max and min input amount to prevent wrong posting data
    if(selectedCurrency.value =="KHR"){
        if(doc.value.price<minAmountKHR.value){
            app.showWarning("Coupon amount must be greater than" + " " + minAmountKHR.value )
            return;
        }
        if(doc.value.price>maxAmountKHR.value){
            app.showWarning("Coupon amount must be less than" + " " + maxAmountKHR.value )
            return;
        }
    } else {
    // USD
    if(doc.value.price<minAmountUSD.value){
            app.showWarning("Coupon amount must be greater than" + " " + minAmountUSD.value )
            return;
        }
        
        if(doc.value.price>maxAmountUSD.value){
            app.showWarning("Coupon amount must be less than" + " " + maxAmountUSD.value )
            return;
        }
        
    }


    if(app.setting.currency != selectedCurrency.value){
        doc.value.price = doc.value.price / exchange_rate.value;
    }




    modalController.dismiss({ ...doc.value, coupon_value: couponValue.value }, 'confirm')
}

onMounted(()=>{
        // get min max setting
    minAmountKHR.value = app.storageService.getItem("min_amount_khr") || 500;
    maxAmountKHR.value = app.storageService.getItem("max_amount_khr") || 100000;
    minAmountUSD.value = app.storageService.getItem("min_amount_usd") || 1;
    maxAmountUSD.value = app.storageService.getItem("max_amount_usd") || 100;

})
</script>
