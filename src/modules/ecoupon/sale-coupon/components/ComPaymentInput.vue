<template>
    
    <stack>
        <com-input @keyup="onInput" v-model="paymentInputAmount"  :label="t('Payment Amount')" :placeholder="paymentBalance.toString()" /> 
        <ion-grid class="ion-no-padding">
                <ion-row v-for="r in keypad">
                    <ion-col v-for="k in r">
                        <ion-button @click="onKeyPadClick(k)" size="large" expand="full" :color="k==t('Clear')?'danger':''">
                            {{ k }}
                        </ion-button>
                    </ion-col>
                </ion-row>
        </ion-grid>

        <ion-button v-for="d in mainPredefine" @click="onSelectMainPredefine(d)">
            <ComCurrency :value="d" />
        </ion-button>
        <ion-button  v-for="d in secondPredefine" @click="onSelectSecondPredefine(d)">
            <ComCurrency :value="d" :currency="secondCurrency"/>
        </ion-button>

    </stack>
</template>
<script setup>
import { ref } from 'vue';
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
const {  paymentBalance,paymentInputAmount,onAddPayment } = useSaleCoupon()
    const posConfig = app.setting.pos_config;
    const mainPredefine = posConfig.main_currency_predefine_payment_amount.split(",")
    const secondPredefine = posConfig.second_currency_predefine_payment_amount.split(",")
    const t = window.t;
    const secondCurrency = app.setting.second_currency;
    const paymentTypes = app.setting.pos_config.payment_type;
    const keypad = [
        [1,2,3],
        [4,5,6],
        [0,'.',t('Clear')],
    ]
    function onKeyPadClick(key){

        if(key=="Clear"){
            paymentInputAmount.value = ""

            return;
        }
        if(key=='.'){
            
           if(paymentInputAmount.value.toString().includes(".")){
            return
           }
             paymentInputAmount.value=paymentInputAmount.value.toString() + '.'
            return;
        }
 
        paymentInputAmount.value=paymentInputAmount.value.toString() + key
    }

    function onInput(event){
        if(event.key=="."){
            const dotCount = (paymentInputAmount.value.match(/\./g) || []).length
            if (dotCount > 1) {
                
                paymentInputAmount.value = paymentInputAmount.value.slice(0, -1)
            }
        }
    }

    function onSelectMainPredefine(n){
        paymentInputAmount.value = n;
        const payment_type = paymentTypes.find(x=>x.payment_type == app.setting.pos_profile.default_payment_type);
        onAddPayment(payment_type)
    }
    function onSelectSecondPredefine(n){
         
        paymentInputAmount.value = n;
        
        const payment_type = paymentTypes.find(x=>x.payment_type == app.setting.pos_profile.second_currency_payment_type);
        
        onAddPayment(payment_type)
    }

</script>