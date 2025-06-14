<template>
  <ion-page>
    <AppBar>{{ t(currentMenu?.title || "Home") }}</AppBar>
    <ion-content :fullscreen="true">
      <div class="wrapper-cover flex justify-content-end flex-column align-items-center m-3 mb-0 border-round-3xl pb-5">
        <ion-avatar style="width: 100px; height: 100px;" > 
        <Img :src="setting.app_logo"/>
        </ion-avatar>
        <ion-text>
            <h1 class="mt-2 mb-0">{{ t(currentMenu?.title || setting.app_name || "ePOS") }}</h1>
        </ion-text>
        
      </div>
    
      <div class="menu-list justify-content-center border-round-top-3xl">
        <div class="p-3">
        <ion-grid class="border-round-2xl p-0">
          <ion-row>
            <ion-col v-for="(m, index) in appMenu" :key="index" size-lg="3" size-xs="6" class="flex">
              <template v-if="m.component">
                <!-- render dynamic component -->
                 <component :is="getDynamicComponent(m.component)" />
              </template>
              <ion-button v-else @click="onOpenRoute(m)" :color="m.color || 'primary'" expand="full" shape="round" class="w-full">
                <div class="flex flex-column justify-center align-items-center py-2">
                  <div class="mb-2" v-html="m.icon" style="height: 50px;width: 50px;"></div>
                  <ion-label>{{ t(m.title) }}</ion-label>
                </div>
              </ion-button>
            </ion-col>
            <ion-col size-lg="3" size-xs="6" class="flex">
              <ion-button v-if="!currentMenu" expand="full" shape="round" @click="onLogout" color="danger" class="w-full">
                <div class="flex flex-column justify-center align-items-center py-2">
                  <ion-icon style="height: 50px;width: 50px;" class="mb-2" :icon="logOutOutline" slot="start"></ion-icon>
                  <ion-label>{{ t("Logout") }}</ion-label>
                </div>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid> 
      </div>
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {onMounted,ref} from "vue"
import { useAuth } from '@/hooks/useAuth';
import {useHome} from "@/hooks/useHome.js"
import {  logOutOutline } from 'ionicons/icons';
import ComWokingDayButton from '@/views/shift/components/ComWokingDayButton.vue';
import ComShiftButton from '@/views/shift/components/ComShiftButton.vue';
 
const {currentMenu,appMenu,getAppMenu,onOpenRoute,getCurrentMenu} = useHome();


 
const t = window.t;
 
const { logout } = useAuth();
const setting = ref(app.setting);
 
function getDynamicComponent(component){
   if(component == "ComWokingDayButton"){
    return ComWokingDayButton
   }
    else if(component == "ComShiftButton"){
    return ComShiftButton
   }
}

onMounted(async ()=>{
 await getAppMenu()
 if(app.route.params.parent_menu){
  await getCurrentMenu(app.route.params.parent_menu)
 }
})

const onLogout = async () => {
  await logout();
  app.ionRouter.navigate('/select-workspace', 'back', 'replace');
};
</script>
<style scoped>
.wrapper-cover {
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    url(/assets/home-bg.jpeg) no-repeat center center / cover;
  /* width: 100%; */
  height: 35%;
  color: #fff;
}
.menu-list ion-button {
  --border-radius: 1rem;
  font-weight: bold;
  height: 7rem;
}
.menu-list  {
     max-width: 1024px; width: 100%;  margin: 0 auto;  padding: 0 16px;
}
 
</style>