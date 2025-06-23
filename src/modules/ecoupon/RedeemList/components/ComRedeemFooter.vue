<template>
    <ion-footer>
        <ion-toolbar>
            <div style="display: flex; justify-content: center;">
<ion-button routerLink="/home" shape="round">{{ t("Home") }}</ion-button>
<ComQuickPayButton />
            </div>
        </ion-toolbar>
    </ion-footer>
    </template>
    <script setup>
import ComQuickPayButton from "@/modules/ecoupon/RedeemList/components/ComQuickPayButton.vue"
const t= window.t;

</script>