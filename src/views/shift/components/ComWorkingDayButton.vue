<template>
    <HomeButton color="primary" v-if="!isWorkingDayOpened" routerLink="/start-working-day" :icon="calendarOutline" >{{ t("Start Working Day") }}</HomeButton>
    <HomeButton color="danger" v-else routerLink="/close-working-day" :icon="todayOutline" >{{ t("Close Working Day") }}</HomeButton>
</template>
<script setup>

import { calendarOutline , todayOutline } from 'ionicons/icons';
import { useApp } from '@/hooks/useApp';
const t = window.t;   
const { isWorkingDayOpened } = useApp();
 
import HomeButton from '@/views/components/public/HomeButton.vue';

</script>