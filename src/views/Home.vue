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
    
<ion-button routerLink="/print-barcode">scan barcode</ion-button>
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
import { useApp } from "@/hooks/useApp";
const {bluetoothPrinters} = useApp() 
 const t = window.t;
 
const { logout,isAuthenticated } = useAuth();
const setting = ref(app.setting);
 
function getDynamicComponent(component){
   if(component == "ComWokingDayButton"){
    return ComWorkingDayButton
   }
    else if(component == "ComShiftButton"){
    return ComShiftButton
   }
}
 
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
 
async function onFindPrinter(){
  // Optional: listen to scan results
  CapacitorThermalPrinter.addListener('discoverDevices', (devices) => {
    console.log('Discovered printers:', devices);
  });

  // Start scanning
  await CapacitorThermalPrinter.startScan();
}

async function onConnectPrinter(){
 
  const result = await CapacitorThermalPrinter.connect({ address:"DC:0D:30:6F:9C:B4" });
  console.log('Connected:', result);
 

}
async function printReceipt() {
  
  try {
        const response = await app.getApi("epos_restaurant_2023.api.printing.convertimg");
    const base64Image = response.data;
    const printerWidthMM = (576 * 25.4) / 200; // ≈73mm for 200dpi

    await CapacitorThermalPrinter.begin()
     .dpi(200) // Set DPI to match your calculation
  .limitWidth(printerWidthMM) // Set width in millimeters
    .align('center')

      .image(base64Image)
      .cutPaper()
      .write();

    console.log('✅ Printed image successfully');
  } catch (err) {
    console.error('❌ Failed to print image:', err);
  }
}
 
const tsplLabel = `
SIZE 51 mm, 25 mm
GAP 2 mm, 0 mm
CLS
TEXT 20,20,"2",0,1,0.8,"Fried rice beef with"
TEXT 20,40,"2",0,1,0.8,"port and chicken"
BARCODE 30,60,"128",60,1,0,2,2,"SKU123456"
TEXT 204,100,"3",0,1,1,"SKU123456xxx"
PRINT 1
`;

import html2canvas from 'html2canvas';
 async function printLabel() {
   try {
   const encoder = new TextEncoder();
const bytes = encoder.encode(tsplLabel);

      await CapacitorThermalPrinter
        .begin()
        .raw(Array.from(bytes)) 
        .write();
      
    } catch (error) {
     
      console.error(error);
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
  height: 35%;
  color: #fff;
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