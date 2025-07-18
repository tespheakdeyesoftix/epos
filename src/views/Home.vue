<template>
  <ion-page>
    <AppBar>{{ t(currentMenu?.title || "Home") }} </AppBar>
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
        <div class="pt-3">
        <ion-grid class="border-round-2xl p-0">
          <ion-row>
            <ion-col v-for="(m, index) in appMenu" :key="index" size-lg="3" size-xs="6" class="flex">
              <template v-if="m.component">
                <!-- render dynamic component -->
                 <component :is="getDynamicComponent(m.component)" />
              </template>
            
              <HomeButton v-else :svg="m.icon" @click="onOpenRoute(m)" :color="m.color || 'primary'" >  {{ t(m.title) }}
               
              </HomeButton>
            </ion-col>
            <ion-col size-lg="3" size-xs="6" class="flex">
              <HomeButton color="danger" v-if="!currentMenu" @click="onLogout" :icon="logOutOutline">{{ t("Logout") }}</HomeButton>
            </ion-col>
          </ion-row>
        </ion-grid> 
      </div>
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="tsx">
import {onMounted,ref,defineComponent} from "vue"
import { useAuth } from '@/hooks/useAuth';
import {useHome} from "@/hooks/useHome.js"
import {  logOutOutline } from 'ionicons/icons';
import ComWorkingDayButton from '@/views/shift/components/ComWorkingDayButton.vue';
import ComShiftButton from '@/views/shift/components/ComShiftButton.vue';
import HomeButton from '@/views/components/public/HomeButton.vue';

const {currentMenu,appMenu,getAppMenu,onOpenRoute,getCurrentMenu} = useHome();


 
 
const t = window.t;
 
const { logout } = useAuth();
const setting = ref(app.setting);
 
function getDynamicComponent(component){
   if(component == "ComWokingDayButton"){
    return ComWorkingDayButton
   }
    else if(component == "ComShiftButton"){
    return ComShiftButton
   }
}

onMounted(async ()=>{
 getAppMenu()
 if(app.route.params.parent_menu){
   getCurrentMenu(app.route.params.parent_menu)
 }


})

const onLogout = async () => {
  await logout();
  app.ionRouter.navigate('/select-workspace', 'back', 'replace');
};
</script>
<style scoped>
.wrapper-cover {
  background: linear-gradient(#213b9400, rgb(0 0 0 / 70%)), url(/assets/retina_wood.png) repeat center center;
  height: 35%;
  color: #fff;
}

.menu-list  {
     max-width: 1024px; width: 100%;  margin: 0 auto;  padding: 0 16px;
}
 
</style>