<template>
    payment breakdown

    {{ data }}
</template>
<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
    cashier_shift:String
})
const data = ref()
const t = window.t
async function getData(){
    const res = await app.sql("select payment_type,currency, sum(input_amount) as payment_amount from `tabSale Payment` where docstatus=1 and cashier_shift=%(cashier_shift)s group by payment_type,currency",
        {
            cashier_shift: props.cashier_shift
        }
    )
    data.value = res.data
}
onMounted(async ()=>{
    await getData();
})
</script>