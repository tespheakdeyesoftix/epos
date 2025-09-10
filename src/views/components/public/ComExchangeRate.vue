<template>
    <ComCurrency :value="exchange_rate_input" :currency="currency" />
    </template>
    <script setup>
import { useApp } from '@/hooks/useApp';
import { ref } from 'vue';
import ComCurrency from './ComCurrency.vue';

const currency  = ref(app.setting.second_currency)


if(app.setting.exchange_rate_main_currency == currency.value){
    currency.value = app.setting.currency;

}


const {exchange_rate_input} = useApp();

console.log(app.setting)
 
</script>