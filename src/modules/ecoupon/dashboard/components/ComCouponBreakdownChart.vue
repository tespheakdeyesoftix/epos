<template>
    <ion-card class="ion-no-margin ion-no-padding">
        <ion-card-header>
            <ion-card-title>
                {{ t("Sale Breakdown by Coupon Code") }}
            </ion-card-title>
            
        </ion-card-header>
        <ion-card-content>


    {{ data }}


</ion-card-content>
    </ion-card>
    
</template>
<script setup>
    const props = defineProps({
        data:Object
    })
    const t = window.t;
</script>