<template>
  <ion-menu content-id="main-content">
    <ion-content>
      <!-- Profile Section -->
      <div class="profile-section">
      
        <ion-avatar class="profile-avatar">
          
          <Img v-if="currentUser.photo" :src="currentUser.photo"/>
          <div class="avatar-placeholder" v-else>{{ getAvatarLetter(currentUser.full_name) }}</div>

        </ion-avatar>
        <ion-label class="profile-name">{{ currentUser.full_name }}</ion-label>
      </div>

      <!-- Menu List -->
      <ion-list class="menu-list">
        <ion-menu-toggle>
        <ion-item router-link="/home">
          <ion-icon :icon="homeOutline" slot="start"></ion-icon>
          <ion-label>{{t("Home")}}</ion-label>
        </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle>
          <ion-item router-link="/Product List">
          <ion-icon :icon="bedOutline" slot="start"></ion-icon>
          <ion-label>{{t("Product List")}}</ion-label>
        </ion-item>
        </ion-menu-toggle>
       
      </ion-list>

      <!-- Bottom Section -->
      <div class="menu-bottom">
        <div class="app-info">
          <ion-label class="app-name">{{ t("eKeeper by eDoor Front Desk") }}</ion-label>
          <ion-label class="app-version">{{ t("Version") }} 1.0.0</ion-label>
        </div>
        <ion-button expand="full" class="logout-button" shape="round" @click="onLogout">
          <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
          {{ t("Logout") }}
        </ion-button>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButton,
  IonIcon,
  useIonRouter,
  IonMenuToggle
} from '@ionic/vue';
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
import { useApp } from '@/hooks/useApp';
import { useAuth } from '@/hooks/useAuth';
import { imageUrl } from "@/helpers/utils";
const { logout, currentUser } = useAuth();
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const ionRouter = useIonRouter();
import {getAvatarLetter} from "@/helpers/utils"
const onLogout = async () => {
  await logout();
  ionRouter.navigate('/select-workspace', 'back', 'replace');
};
</script>

<style scoped>
/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
 
  background: linear-gradient(135deg, #87CEFA, #1E90FF);
  margin:-20px -13px 0px -14px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* Center Avatar */
.profile-avatar {
  width: 80px;
  height: 80px;
  border: 3px solid white;
  margin-bottom: 10px;
}
/* Placeholder styling when no image */
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  /* Blue background */
  color: white;
  font-size: 25px;
  font-weight: bold;
  border-radius: 50%;
  text-transform: uppercase;

}
/* Profile Name */
.profile-name {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-top: 5px;
}

/* Menu List */
.menu-list {
  margin-top: 10px;
  height: calc(100vh - 350px); 
  overflow-y: auto; /* Make the menu scrollable */
}

ion-item {
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  margin: 5px 10px;
  transition: background 0.3s;
}

 

ion-icon {
 
  color: var(--ion-color-primary)
}
 
/* Bottom Section */
.menu-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  text-align: center;
}

/* Logout Button */
.logout-button {
  --background: #ff4d4d;
  --color: white;
  --border-radius: 10px;
  font-weight: bold;
  margin-bottom: 10px;
}

.logout-button:hover {
  --background: #e60000;
}

/* App Info */
.app-info {
  text-align: center;
  color: gray;
  font-size: 14px;
  margin-bottom: 20px;
}

.app-name {
  font-weight: bold;
  display: block;
}

.app-version {
  opacity: 0.7;
}
</style>
