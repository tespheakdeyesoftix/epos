<template>

              <HomeButton v-if="!isCashierShiftOpened"  routerLink="/start-shift" :color="'tertiary'" :icon="calendarOutline">
                {{ t("Start Shift") }}
              </HomeButton>
              <HomeButton v-else  routerLink="/close-shift" :color="'danger'" :icon="todayOutline">
                {{ t("Close Shift") }}
              </HomeButton>
   
</template>
<script setup>
import { ref } from 'vue';
import { calendarOutline , todayOutline } from 'ionicons/icons';

    import { useApp } from '@/hooks/useApp';
import HomeButton from '@/views/components/public/HomeButton.vue';
const { isCashierShiftOpened } = useApp();
const t = window.t;
</script>