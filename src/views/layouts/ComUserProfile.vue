<template>
  <ion-buttons slot="end" @click="openPopover($event)">
 
    <ion-avatar class="small-avatar">

      <Img v-if="currentUser.photo" :src="currentUser.photo"/>
      <div class="avatar-placeholder" v-else>{{ getAvatarLetter(currentUser.full_name) }}</div>

    </ion-avatar>
  </ion-buttons>

  <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false">
    <ion-content class="ion-padding">
      <div class="user-info">
        <ion-avatar>
          <Img v-if="currentUser.photo" :src="currentUser.photo"  />
          <div class="avatar-placeholder" v-else>{{ getAvatarLetter(currentUser.full_name) }}</div>

        </ion-avatar>
        <div class="username-position">
          <strong>{{ currentUser.full_name }}</strong><br />
          <span>{{ currentUser.position }}</span>
          
        </div>
      </div>

      <ion-list>
        <ion-item button detail="false" router-link="/my-profile" @click="popoverOpen = false">
          <ion-icon slot="start" :icon="personOutline"></ion-icon>
          <span>{{ t("My Profile") }}</span>
        </ion-item>
        <ion-item button detail="false" @click="onChangeLanguage" id="open-custom-dialog">
          <ion-icon slot="start" :icon="languageOutline"></ion-icon>
          <span>{{ t("Change Language") }}</span>
        </ion-item>
        <ion-item button detail="false" router-link="/help"  @click="popoverOpen = false">
          <ion-icon slot="start" :icon="helpCircleOutline"></ion-icon>
          <span>{{ t("Help") }}</span>
        </ion-item>
        <ion-item button detail="false" lines="none" color="danger" @click="onLogout">
          <ion-icon slot="start" :icon="logOutOutline" class="logout-icon"></ion-icon>
          <span>{{ t("Logout") }}</span>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>

<!-- change languatge -->
<ion-modal id="example-modal"  :is-open="isOpenChangeLanguage" ref="modal">
      <div class="wrapper">
        <h3>{{ t("Change Language") }}</h3>

        <ion-list lines="none">
          <ion-item :button="true" :detail="false" @click="onDismissModal(l.lang)" v-for="(l, index) in languages" :key="index">
            <ion-icon style="height: 32px;" :icon="l.icon"></ion-icon>
            <ion-label>{{ l.label }}</ion-label>
          </ion-item>
           
        </ion-list>
      </div>
    </ion-modal>
</template>
<script setup lang="ts">
import {   alertController,actionSheetController, useIonRouter } from '@ionic/vue';
import { ref } from 'vue'
import { imageUrl, getAvatarLetter } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"

import { personOutline, helpCircleOutline, logOutOutline,languageOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';
import { useApp } from '@/hooks/useApp';
const modal = ref();
const isOpenChangeLanguage = ref(false);
const {languages} = useApp()
const { t ,locale} = useI18n();
const onDismissModal = (lang:string) =>{
  isOpenChangeLanguage.value = false;
  locale.value = lang;
      window.localStorage.setItem("lang",locale.value)
 
};


const { logout } = useAuth()
const ionRouter = useIonRouter();
const { currentUser } = useAuth();
const popoverOpen = ref(false)
const event = ref<Event | null>(null);


function openPopover(e: Event) {
  event.value = e;
  popoverOpen.value = true;
}

async function onChangeLanguage(){
  popoverOpen.value = false;
  isOpenChangeLanguage.value = true;

  
}

const onLogout = async () => {
  popoverOpen.value = false;
  await logout();
  ionRouter.navigate('/select-workspace', 'back', 'replace');
};


</script>
<style scoped>
/* Avatar container */
.small-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
  /* Light gray background */
}

/* Ensures the image fits properly */
.small-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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


/* Style the user info section */
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.user-info ion-avatar {
  margin-right: 10px;
}

.username-position {
  font-size: 14px;
}

.username-position strong {
  font-size: 16px;
  font-weight: bold;
}

.username-position span {
  color: var(--ion-color-medium);
}

/* Style the list of items */
ion-item {
  padding: 5px 0;
}



ion-item span {
  font-size: 14px;
}

.logout-item {
  border-radius: 50px;
  /* Make the item rounded */
  padding: 10px 15px;
  /* Add padding to create a larger clickable area */
  display: flex;
  align-items: center;
  justify-content: center;
}


ion-modal#example-modal {
    --width: fit-content;
    --min-width: 250px;
    --height: fit-content;
    --border-radius: 6px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  }

  ion-modal#example-modal h1 {
    margin: 20px 20px 10px 20px;
  }

  ion-modal#example-modal ion-icon {
    margin-right: 6px;

    width: 48px;
    height: 48px;

    padding: 4px 0;

    color: #aaaaaa;
  }

  ion-modal#example-modal .wrapper {
    margin-bottom: 10px;
    padding: 20px;
  }

</style>
