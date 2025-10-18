<template>
  <ion-app>
    <DrawerMenu v-if="isAuthenticated && !hideDrawerRoutes.includes(currentRoute)" />
 
<ion-router-outlet id="main-content" :swipe-gesture="false" :animated="false" ></ion-router-outlet>

  </ion-app>
  <Toast />
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from "vue"
import { useRoute } from 'vue-router';
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/hooks/useAuth';
import DrawerMenu from "@/views/layouts/DrawerMenu.vue"
import { Capacitor } from '@capacitor/core';
import { initializeScanner } from '@/helpers/scan-barcode.js'
import { StatusBar } from '@capacitor/status-bar';
import { Fullscreen } from '@boengli/capacitor-fullscreen';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
  
const toast = useToast();
 
 


const ionRouter = useIonRouter();
const { isAuthenticated } = useAuth();

const route = useRoute();
const title = ref(route.meta.title || 'ePOS');

const currentRoute = route.path
const hideDrawerRoutes = ["/login", "/select-workspace"]

const router = useRouter();




// set ion router to app so it easy to access from compoennty
app.setIonRouter(ionRouter)
app.setRoute(route)
app.setRouter(router)


// Watch for route changes and update the title
watch(() => route.meta.title, (newTitle) => {
  title.value = newTitle || 'ePOS';

});


 

onMounted(async () => {
 
  
  window.toast = toast;
  if (Capacitor.getPlatform() !== "web") {
   
    StatusBar.hide();

    try {
    await Fullscreen.activateImmersiveMode();
    
  } catch (error) {
    
  }


   
    
    await initializeScanner();
  }
})
 
</script>

<style>
@media (max-width: 640px) {
  .p-toast {
    width: 90vw !important;
  }

}
</style>
