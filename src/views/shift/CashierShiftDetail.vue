<template>
  <ion-page>
    <ToolBar>
       {{ t("Cashier Shift Detail") }} - {{ name }}
     <template #end>
        <ion-button @click="refreshCurrentTab">
          <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
        </ion-button>
        <!-- popover -->
         <ComSettingShift />
         
     </template>
    </ToolBar>
  <ion-content>
      <Tabs 
        ref="tabsRef" 
        :tabs="tabs" 
        @tab-change="onTabChange" 
        @tab-refresh="onTabRefresh"
        :lazy-load="true"
        :cache-components="true"  
      ></Tabs>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from "@/views/components/Tabs/Tabs.vue"
import ComServerContent from "@/views/components/public/ComServerContent.vue";
import ComSettingShift from "@/views/shift/components/ComSettingShift.vue";
import { refreshOutline } from 'ionicons/icons';


const name = ref(app.route.params.name)
const t= window.t;
const tabsRef = ref(null)
const tabs = [
   
  { 
    label: t('Shift Summary'), 
    component: ComServerContent,
    props:{
      options:{
       doctype:"Cashier Shift",
      docname: app.route.params.name,
      template: "Cashier Shift Summary - UI",
      }
    }
  },
   
  { 
    label: t('Receipt List'), 
    component: ComServerContent,
    props:{
      options:{
       doctype:"Cashier Shift",
      docname: app.route.params.name,
      
      template: "Cashier Shift Receipt List - UI",
      }
    }
  },
]
 

const refreshCurrentTab = () => {
  tabsRef.value?.refreshCurrentTab()
}
 
 
</script>