<template>
 


      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>{{ t("Home") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="room" href="/room">
          <ion-icon aria-hidden="true" :icon="bedOutline" />
          <ion-label>{{ t("Room") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="task" href="/task">
          <ion-icon aria-hidden="true" :icon="clipboardOutline" />
          <ion-label>{{ t("Task") }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="Stay" href="/stay">
          <ion-icon aria-hidden="true" :icon="personCircleOutline" />
          <ion-label>{{ t("Stays") }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="Report" href="/reports">
          <ion-icon aria-hidden="true" :icon="barChartOutline" />
          <ion-label>{{ t("Reports") }}</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
  
</template>

<script setup lang="ts">
import {watch,ref} from "vue"
import { IonRouterOutlet,IonTabs,IonTabBar, IonTabButton,IonLabel,IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonButton } from '@ionic/vue';
import {
  homeOutline,
  bedOutline,
  clipboardOutline,
  personCircleOutline,
  settingsOutline,
  logOutOutline,
  calendarOutline,
  layersOutline,
  archiveOutline,
  brushOutline,
  barChartOutline
} from 'ionicons/icons';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

</script>