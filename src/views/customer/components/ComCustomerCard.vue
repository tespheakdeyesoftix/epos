<template>
<!-- {{ data }} -->
    <ion-card>  
         
        {{ data.photo}}
        {{ data.name }}
        {{ data.customer_name_en }}
        {{ data.phone_number}}
        {{ data.customer_group}}
    </ion-card>
</template>
<script setup >

const t =window.t;
const props = defineProps({
    data:Object
})
</script>