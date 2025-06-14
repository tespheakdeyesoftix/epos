<template>
       <ion-button v-if="working_day" routerLink="/close-shift" :color="'tertiary'" expand="full" shape="round" class="w-full">
                <div class="flex flex-column justify-center align-items-center py-2">
                   <ion-icon style="height: 50px;width: 50px;" :icon="calendarOutline"></ion-icon>
                  <ion-label>{{ t("Start Shift") }}</ion-label>
                </div>
              </ion-button>
          <ion-button v-else routerLink="/close-shift" :color="'danger'" expand="full" shape="round" class="w-full">
                <div class="flex flex-column justify-center align-items-center py-2">
                   <ion-icon style="height: 50px;width: 50px;" :icon="todayOutline"></ion-icon>
                  <ion-label>{{ t("Close Shift") }}</ion-label>
                </div>
              </ion-button>     
</template>
<script setup>
import { ref } from 'vue';
import { calendarOutline , todayOutline } from 'ionicons/icons';

    
    const t = window.t;
    const working_day = ref(app.setting.working_day)
</script>