<template>
  <ion-app >
    <DrawerMenu v-if="isAuthenticated" />
    <ion-content :fullscreen="true" id="main-content">

      <ion-router-outlet v-if="!loading"/>


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
const ionRouter = useIonRouter();
const  {checkUserLogin,isAuthenticated} = useAuth();

const route = useRoute();
const title = ref(route.meta.title || 'ePOS');
const hideTab = ref(false);
const {getSetting} = useApp();
const loading = ref(true)

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
  loading.value = true 
  await checkUserLogin();
 
  if (isAuthenticated.value){
    
    await getSetting()
  }
  loading.value = false
})

</script>
