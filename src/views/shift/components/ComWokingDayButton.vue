<template>
 
    <ion-button v-if="!isWorkingDayOpened"  routerLink="/start-working-day">{{ t("Start Working Day") }}</ion-button>
    <ion-button routerLink="/close-working-day" color="danger" v-else>{{ t("Close Working Day") }}</ion-button>
</template>
<script setup>
 
import { useApp } from '@/hooks/useApp';
const { isWorkingDayOpened } = useApp();
const t = window.t;   
    
</script>