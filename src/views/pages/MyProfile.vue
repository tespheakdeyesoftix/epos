<template>
  <ion-page>
    <AppBar>{{ t("User Profile") }}</AppBar>

    <ion-content :fullscreen="true">
      <ion-card style="border-radius: 20px; display: flex; flex-direction: column; align-items: center;">
        <ion-card-content>
          <div style="display: flex; justify-content: center; align-items: center;">
            <template v-if="currentUser.photo">
              <Img :src="currentUser.photo" width="150" style="border-radius: 50%;" />
            </template>
            <template v-else>
              <ion-avatar style="width: 150px; height: 150px; background: lightgray; display: flex; justify-content: center; align-items: center; border-radius: 50%;">
                <ion-icon :icon="personOutline" style="font-size: 3rem; color: gray;"></ion-icon>
              </ion-avatar>
            </template>
          </div>
        </ion-card-content>
      </ion-card>

      <div style="text-align: center; margin-top: 10px;">
        <p><strong>Name:</strong> {{ currentUser.name || "N/A" }}</p>
        <p><strong>Email:</strong> {{ currentUser.email || "N/A" }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardContent, IonAvatar, IonIcon } from '@ionic/vue';
import { personOutline } from 'ionicons/icons';
import AppBar from '../layouts/AppBar.vue';
import { useAuth } from '@/hooks/useAuth';
import Img from "@/views/components/Img.vue";

const { currentUser } = useAuth();
const t = window.t;
</script>
