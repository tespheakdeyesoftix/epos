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
      <!-- <ion-button @click="printReceipt">Print me</ion-button> -->
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
 
import { SunmiPrinter,AlignmentModeEnum } from 'capacitor-sunmi-printer-v7';
 async function printReceipt() {
  try {


    // Initialize printer
    await SunmiPrinter.printerInit();
    
    // Center align header
    await SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    await SunmiPrinter.setBold({ enable:true });
    await SunmiPrinter.printText({ text: 'MY RESTAURANT\n' });
    await SunmiPrinter.setBold({ enable:false });
    await SunmiPrinter.printText({ text: 'Tel: 012 345 678\n\n' });
    
    // Left align body
    await SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.LEFT });
    await SunmiPrinter.printText({ 
      text: `Date: ${new Date().toLocaleDateString()}\n` +
            `Time: ${new Date().toLocaleTimeString()}\n` +
            `Order #: ${Math.floor(1000 + Math.random() * 9000)}\n\n`
    });
    
    // Column headers (38 chars total)
    await SunmiPrinter.printColumnsText({
      lines: [
        { text: 'ITEM', width: 20, align: AlignmentModeEnum.LEFT },   // Left
        { text: 'QTY', width: 6, align: AlignmentModeEnum.CENTER },     // Center
        { text: 'PRICE', width: 12, align: AlignmentModeEnum.LEFT }   // Right
      ]
    });
    
    // Divider line (38 chars)
    await SunmiPrinter.printText({ text: '-'.repeat(32) + '\n' });
    
    // Sample items
    const items = [
      { name: 'Cheeseburger fried rice with suup', qty: 2, price: 8.50 },
      { name: 'Cheeseburger', qty: 2, price: 8.50 },
      { name: 'បាយឆាសាច់ គោ', qty: 2, price: 8.50 },
      { name: 'French Fries', qty: 1, price: 3.00 },
      { name: 'Soda', qty: 2, price: 2.50 }
    ];
    
    // Print items (with word wrapping for long names)
    for (const item of items) {
         await SunmiPrinter.printColumnsText({
          lines: [
            { text: item.name, width: 20, align: AlignmentModeEnum.LEFT },
            { text: item.qty.toString(), width: 6, align: AlignmentModeEnum.CENTER },
            { text: item.price.toString(), width: 12, align: AlignmentModeEnum.LEFT }
          ]
        });
      
    }
    
    // Totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    await SunmiPrinter.printText({ text: '-'.repeat(32) + '\n' });
    
    await SunmiPrinter.printColumnsText({
      lines: [
        { text: 'SUBTOTAL', width: 25, align: AlignmentModeEnum.LEFT },
        { text: `$${subtotal.toFixed(2)}`, width:8, align:  AlignmentModeEnum.LEFT}
      ]
    });
    
    await SunmiPrinter.printColumnsText({
      lines: [
        { text: 'TAX (8%)', width: 26, align: 0 },
        { text: `$${tax.toFixed(2)}`, width: 12, align: 2 }
      ]
    });
    
    await SunmiPrinter.printText({ text: '='.repeat(32) + '\n' });
    
    await SunmiPrinter.printColumnsText({
      lines: [
        { text: 'TOTAL', width: 25, align:  AlignmentModeEnum.LEFT, bold: true },
        { text: `$${total.toFixed(2)}`, width: 8, align: AlignmentModeEnum.LEFT, bold: true }
      ]
    });
    
    // Footer
    await SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    await SunmiPrinter.printText({ text: '\nThank you!\n' });
    await SunmiPrinter.printText({ text: 'Visit us again\n\n' });
    
    // Finish
    await SunmiPrinter.lineWrap(3);
    await SunmiPrinter.cutPaper();
    
  } catch (error) {
    console.error('Printing error:', error);
  }
}

// Helper to split long item names
function splitLongText(text, maxLength) {
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word.trim();
    } else {
      lines.push(currentLine);
      currentLine = word.trim();
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
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