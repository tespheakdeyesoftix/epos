<template>
  <ion-page>
    <AppBar>{{ t(currentMenu?.title || "Home") }} </AppBar>
    <ion-content :fullscreen="true">
      <div class="wrapper-cover flex justify-content-end flex-column align-items-center">
        <ion-avatar style="width: 120px; height: 120px;" > 
        <Img :src="setting.app_logo"/>
        </ion-avatar>
        <ion-text>
            <h1 class="mt-2 mb-0">{{ t(currentMenu?.title || setting.app_name || "ePOS") }}</h1>
        </ion-text>

        <ion-text v-if="!currentMenu?.pos_profile" class="mb-4">POS Profile: {{ setting?.pos_profile?.name }} / {{ setting?.station_name }}</ion-text>
      </div>
      <!-- {{ station_name }} -->
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
import { onBeforeRouteLeave } from 'vue-router'
const {currentMenu,appMenu,getAppMenu,onOpenRoute,getCurrentMenu} = useHome();
 
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
 
 const t = window.t;
 
const { logout,isAuthenticated } = useAuth();
const setting = ref(app.setting);
 
function getDynamicComponent(component:string){
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
onBeforeRouteLeave((to, from, next) => {
  
 if (isAuthenticated.value && to.path == "/select-workspace"){
  next(false)
 }else {
  next(); 
 }
  
});

</script>
<style scoped>
.wrapper-cover {
  background: linear-gradient(#213b9400, rgb(0 0 0 / 70%)), url(/assets/retina_wood.png) repeat center center;
  
  color: #fff;
  min-height: 275px;
}

.menu-list  {
     max-width: 1024px; width: 100%;  margin: 0 auto;  padding: 0 16px;
}
 .label-design {
  font-family: sans-serif;
  background: white;
  margin: 0 auto;
}
.label-design h3 {
  margin: 0;
  font-size: 14px;
}
.price {
  text-align: right;
  font-weight: bold;
}
.barcode {
  text-align: center;
  font-family: monospace;
  letter-spacing: 2px;
}

</style>