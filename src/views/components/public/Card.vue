<template >
<ion-card v-bind="$attrs" >
    <ion-on-header v-if="header">
        <ion-card-title>{{ header }}</ion-card-title>
    </ion-on-header>
    <ion-card-content class="ion-no-padding ion-no-margin">
        <slot>
            hello card
        </slot>
    </ion-card-content>
</ion-card>
</template>
<script setup>
    const props = defineProps({
        header:String
    })

    defineOptions({
    inheritAttrs: false
    })

</script>