<template>
       <ion-button v-if="!working_day" routerLink="/start-working-day" :color="'tertiary'" expand="full" shape="round" class="w-full">
                <div class="flex flex-column justify-center align-items-center py-2">
                   <ion-icon style="height: 50px;width: 50px;" :icon="calendarOutline"></ion-icon>
                  <ion-label>{{ t("Start Working Day") }}</ion-label>
                </div>
              </ion-button>
          <ion-button v-else routerLink="/start-working-day" :color="'danger'" expand="full" shape="round" class="w-full">
                <div class="flex flex-column justify-center align-items-center py-2">
                   <ion-icon style="height: 50px;width: 50px;" :icon="todayOutline"></ion-icon>
                  <ion-label>{{ t("Close Working Day") }}</ion-label>
                </div>
              </ion-button>     
</template>
<script setup>
import { ref } from 'vue';
import { calendarOutline , todayOutline } from 'ionicons/icons';

    
</script>