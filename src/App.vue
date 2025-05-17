<template>
  <ion-app>
    <DrawerMenu v-if="isAuthenticated" />
  <ion-content :fullscreen="true" id="main-content">
   
<ion-router-outlet />
 
    
  </ion-content>

  </ion-app>
</template>

<script setup lang="ts">
  import {watch,ref} from "vue"
  import { useRoute } from 'vue-router';
import { IonApp, IonRouterOutlet ,useIonRouter} from '@ionic/vue';
 
import DrawerMenu from "@/views/layouts/DrawerMenu.vue"  
const ionRouter = useIonRouter();

  import { useAuth } from '@/hooks/useAuth';
  const {isAuthenticated} = useAuth();
  const route = useRoute();
  const title = ref(route.meta.title || 'ePOS');
  const hideTab = ref(false);

  import { useRouter } from 'vue-router';
 
const router = useRouter();

  // set ion router to app so it easy to access from compoennty
  app.setIonRouter(ionRouter)
  app.setRoute(route)
  app.setRouter(router)
 
  // Watch for route changes and update the title
  watch(() => route.meta.title, (newTitle) => {
    title.value = newTitle || 'ePOS';
   
  });

 

 

</script>
