<template>
  <ion-page>
    <AppBar>{{ t("Home") }}</AppBar>
    <ion-content :fullscreen="true">
      <div class="wrapper-cover flex justify-content-end flex-column align-items-center pb-5">
        <ion-img class="w-4rem" src="/assets/ePOS-logo.png"></ion-img>
        <h1 class="mt-2 mb-0">{{ t("ePOS Restaurant") }}</h1>
        <ion-text>{{ t("Device: Hi IOS, Station: Siem Reap") }}</ion-text>
      </div>
      <div class="menu-list flex justify-content-center border-round-top-3xl -mt-4"
        style="height: calc(-329.5px + 100vh);background:url(/assets/pettern1.png)">
        <div class="py-2 px-3 mt-3" style="height: fit-content;">
          <div class="grid">
            <ion-button class="col-6 m-0" routerLink="/dashboard">
              <div class="flex flex-column justify-center align-items-center py-2">
                <ion-icon class="text-6xl mb-2" :icon="gridOutline" slot="start"></ion-icon>
                {{ t("Dashboard") }}
              </div>
            </ion-button>
            <ion-button class="col-6 m-0" routerLink="/product-list">
              <div class="flex flex-column justify-center align-items-center py-2">
                <ion-icon class="text-6xl mb-2" :icon="cartOutline" slot="start"></ion-icon>
                {{ t("Product") }}
              </div>
            </ion-button>

            <ion-button class="col-6 m-0" routerLink="/stock-adjustment">
              <div class="flex flex-column justify-center align-items-center py-2">
                <ion-icon class="text-6xl mb-2" :icon="cubeOutline" slot="start"></ion-icon>
                {{ t("Stock Adjustment")}}
              </div>
            </ion-button>
            <ion-button class="col-6 m-0" routerLink="/pending-order">
              <div class="flex flex-column justify-center align-items-center py-2">
                <ion-icon class="text-6xl mb-2" :icon="timeOutline" slot="start"></ion-icon>
                {{ t("Pending Order") }}
              </div>
            </ion-button>
            <ion-button class="col-6 m-0" routerLink="/sale">
              <div class="flex flex-column justify-center align-items-center py-2">
                <ion-icon class="text-6xl mb-2" :icon="timeOutline" slot="start"></ion-icon>
                {{ t("Sale") }}
              </div>
            </ion-button>

            <ion-button class="col-6 m-0" @click="onLogout">
              <div class="flex flex-column justify-center align-items-center py-2">
                <ion-icon class="text-6xl mb-2" :icon="logOutOutline" slot="start"></ion-icon>
                {{ t("Logout") }}
              </div>
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuth } from '@/hooks/useAuth';
import {
  IonContent,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/vue';
import { cartOutline, logOutOutline, timeOutline, cubeOutline,gridOutline } from 'ionicons/icons';
const t = window.t;
const { logout } = useAuth();

const ionRouter = useIonRouter();
const onLogout = async () => {
  await logout();
  ionRouter.navigate('/select-workspace', 'back', 'replace');
};
</script>
<style>
.wrapper-cover {
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    url(/assets/home-bg.jpeg) no-repeat center center / cover;
  width: 100%;
  height: 35%;
  color: #fff;
}
.menu-list ion-button {
  --border-radius: 1rem;
  font-weight: bold;
}
.menu-list ion-button:first-child {
  --background: #7F55B1;
}
.menu-list ion-button:nth-child(2) {
  --background: #328E6E;
}
.menu-list ion-button:nth-child(3) {
  --background: #8F87F1;
}
.menu-list ion-button:nth-child(4) {
  --background: #213448;
}
.menu-list ion-button:last-child {
  --background: #E52020;
}
</style>