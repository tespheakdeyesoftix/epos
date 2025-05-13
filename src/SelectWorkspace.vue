<template>
   <ion-page>
    <ion-content fullscreen="true" class="home-content">
      <!-- Branding Section -->
      <div class="branding">
        <ion-img src="/assets/logo.svg" alt="App Logo" class="app-logo"></ion-img>
        <ion-text class="app-name">eKeeper</ion-text>
      </div>
      <!-- Add Workspace Button -->
      
       
      <ion-button size="large" expand="full" class="add-workspace" shape="round" router-link="/add-workspace" >{{ t("Add Workspace") }}</ion-button>
       <!-- Workspace List -->
 

      <ion-list class="workspace-list">
        <ion-card
  v-for="p in properties"
  :key="p.property_code"
  @click="onLogin(p)"
  class="ripple-card" 
 
>
  <ion-card-header>
    <div class="workspace-header">
      <!-- Workspace Avatar -->
      <ion-avatar class="workspace-logo">
        <Img :src="p.photo" :api_url="p.api_url"/>
      </ion-avatar>

      
      <!-- Workspace Info (Two Lines) -->
      <div class="workspace-info">
        <ion-text class="workspace-name">{{ p.property_name }}</ion-text>
        <ion-text class="user-name">{{ p.username }}</ion-text>
      </div>

      <!-- Vertical Ellipsis Menu Button -->
      <ion-button fill="clear" @click.stop="onOpenMenu(p)">
        <ion-icon :icon="ellipsisVertical"></ion-icon>
      </ion-button>

      
    </div>
  </ion-card-header>
</ion-card>
 

      </ion-list>
    </ion-content>

    <!-- Footer -->
    <ion-footer class="footer">


  <ion-toolbar class="no-shadow">

<ion-buttons class="language-buttons">
      <ion-button v-for="(l, index) in languages" :key="index" @click="changeLanguage(l.lang)" :color="l.lang == locale?'danger':'default'" >
        <ion-icon :src="l.icon" slot="start" />
        {{ l.label }}
      </ion-button>
      </ion-buttons>
    <div class="footer-text">
      <ion-text class="powered-by">{{t("eKeeper by eDoor Front Desk")}}</ion-text>
      <ion-text class="app-version">Version 1.0.0</ion-text>
    </div>
  </ion-toolbar>
</ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardHeader,
  IonCardSubtitle,
   IonIcon, 
   actionSheetController, 
   alertController,
  useIonRouter,
  loadingController,
  onIonViewWillEnter
} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { imageUrl } from '@/helpers/utils';
import { ellipsisVertical, logoIonic } from 'ionicons/icons';
import { useAuth } from './hooks/useAuth';
import { useApp } from './hooks/useApp';
import { setFrappeAppUrl } from '@/services/api-service';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const result = ref({})

import { CapacitorHttp, HttpResponse } from '@capacitor/core';
 

const {currentProperty,languages,currentLanguage} = useApp()
const ionRouter = useIonRouter();
const properties = ref([]);
const { login,isAuthenticated } = useAuth()

const changeLanguage = ( lang:string) => {
      locale.value = lang;
      window.localStorage.setItem("lang",locale.value)
};


async function onLogin(p: any) {

  const loading = await loadingController.create({
    message: t('Loging In...'),
  });

  await loading.present();
  const response = await login(p);

  await loading.dismiss()
  if(response){
    setFrappeAppUrl(p.api_url);
    currentProperty.value = p;
      ionRouter.navigate('/home', 'forward', 'replace');
  }
  
}



async function onOpenMenu(p: any) {
  const actionSheet = await actionSheetController.create({
    header: 'Action Menu',
    buttons: [
      {
        text: t('Edit Property'),
        handler: async () => {
          ionRouter.navigate('/add-workspace/' + p.property_code, 'forward', 'push');

        }
      },
      {
        text: t('Remove Property'),
        cssClass: 'remove-property-btn',
        handler: async () => {

          const alert = await alertController.create({
            header: 'Delete property',
            message: 'Are you sure you want to delete this property?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
              },
              {
                text: 'OK',
                cssClass: 'alert-button-confirm',
              }
            ]
          });

          await alert.present();
          const result = await alert.onWillDismiss();
          if (result.role != "cancel") {
            properties.value = properties.value.filter((r: any) => r.property_code != p.property_code)
            window.storageService.setItem("properties", JSON.stringify(properties.value))
          }



        }
      },
    ],
  });
  await actionSheet.present();
}

onIonViewWillEnter(() => {
  if(isAuthenticated){
    ionRouter.navigate('/home', 'forward', 'replace');
  }
  const strProperties = window.storageService.getItem("properties");
  if (strProperties) {
    properties.value = JSON.parse(strProperties)
  }
})

</script>

 
<style scoped>
/* Branding Section with Gradient Background */
.branding {
  height: 30vh;
  background: rgb(189,229,244);
background: radial-gradient(circle, rgba(189,229,244,1) 0%, rgba(157,201,240,1) 51%, rgba(101,167,244,1) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

.app-logo {
  width: 90px;
  height: 90px;
  margin-bottom: 12px;
}

.app-name {
  font-size: 36px;
  font-weight: bold;
}

/* Add Workspace Button */
.add-workspace {
  margin: 16px;
}
.workspace-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}

.workspace-logo {
  width: 50px;
  height: 50px;
}

.workspace-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  flex: 1;
}

.workspace-name {
  font-size: 16px;
  font-weight: bold;
  white-space: normal;
}


.user-name {
  font-size: 14px;
  color: gray;
}

.ripple-card {
  --ripple-color: rgba(0, 123, 255, 0.2);  /* Optional: Customize ripple color */

}


.footer {
  --background: transparent; /* No background */
  height: 90px;
  box-shadow: none;           /* No shadow */
  
}

.no-shadow {
  --box-shadow: none;        /* Remove shadow from ion-toolbar */
  --background: transparent; /* Transparent background for toolbar */
}

.footer-text {
  text-align: center; /* Center the text */
  width: 100%;        /* Ensure the div takes the full width */
}

.powered-by {
  display: block;     /* Make the text block to go to the next line */
  font-weight: bold;  /* Make the "Powered by" text stand out */
}

.app-version {
  display: block;     /* Ensure this is on a new line */
  font-size: 14px;     /* Smaller font size for the version */
  color: gray;        /* Slightly gray to differentiate from the title */
}
.remove-property-btn {
  color: red;  /* Makes the text red */
}

.language-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

</style>