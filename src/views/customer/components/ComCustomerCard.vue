<template>
    <ion-card>
        {{ data }}
    </ion-card>
</template>
<script setup >
const t =window.t;
const props = defineProps({
    data:Object
})
</script>