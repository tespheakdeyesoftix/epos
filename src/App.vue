<template>
  <ion-app >
    <DrawerMenu v-if="isAuthenticated" />
    <ion-content :fullscreen="true" id="main-content">

      <ion-router-outlet />


    </ion-content>

  </ion-app>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from "vue"
import { useRoute } from 'vue-router';
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/hooks/useAuth';
import DrawerMenu from "@/views/layouts/DrawerMenu.vue"
import { useApp } from "./hooks/useApp";

 import { StatusBar, Style } from '@capacitor/status-bar';
const ionRouter = useIonRouter();
const  {checkUserLogin,isAuthenticated} = useAuth();

const route = useRoute();
const title = ref(route.meta.title || 'ePOS');
const hideTab = ref(false);

const router = useRouter();

// set ion router to app so it easy to access from compoennty
app.setIonRouter(ionRouter)
app.setRoute(route)
app.setRouter(router)


 

// Watch for route changes and update the title
watch(() => route.meta.title, (newTitle) => {
  title.value = newTitle || 'ePOS';

});
  
onMounted(async ()=>{

  const toolbarColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--ion-toolbar-background')
  .trim();

await StatusBar.setOverlaysWebView({ overlay: false }); // Optional: ensures webview doesn't go under status bar
await StatusBar.setStyle({ style: Style.Light }); // Use white icons for dark background
await StatusBar.setBackgroundColor({color: toolbarColor }); // Use white icons for dark background

})
</script>
