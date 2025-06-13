<template>
    <ion-button   routerLink="/start-working-day">{{ t("Start Working Day") }}</ion-button>
    <ion-button v-if="!working_day"  routerLink="/start-working-day">{{ t("Start Working Day") }}</ion-button>
    <ion-button color="danger" v-else>{{ t("Close Working Day") }}</ion-button>
</template>
<script setup>
import { ref } from 'vue';

    
    const t = window.t;
    const working_day = ref(app.setting.working_day)
</script>