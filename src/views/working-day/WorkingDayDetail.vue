<template>
  <ion-page>
    <ToolBar>
      {{ t("Working Day Detail") }} - {{ name }}
      <template #end>
        <ion-button @click="refreshCurrentTab">
          <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
        </ion-button>
        <!-- popover -->
        <ComSettingShift v-model="selectedTab" />

      </template>
    </ToolBar>
    <ion-content>
      <div class="fixed-container ion-padding mt-4 mb-2" v-if="!printer_name"> 
<Message severity="warn">{{ t("There's no default printer for printing report.") }} <br/> <ion-button routerLink="/setting?modal=1">{{ t("Setup Now") }}</ion-button></Message>
      </div>
      <Tabs ref="tabsRef" :tabs="tabs" @tab-change="onTabChange" @tab-refresh="onTabRefresh" :lazy-load="true"
        :cache-components="true"></Tabs>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Tabs from "@/views/components/Tabs/Tabs.vue"
import ComServerContent from "@/views/components/public/ComServerContent.vue";
import ComSettingShift from "@/views/shift/components/ComSettingShift.vue";
import { refreshOutline } from 'ionicons/icons';
import Message from 'primevue/message';

const name = ref(app.route.params.name)
const t = window.t;
const tabsRef = ref(null)
const selectedTab = ref({})
function onTabChange(index){
  selectedTab.value = tabs.value[index];
}
const printer_name = ref("")
const tabs = ref([])


const refreshCurrentTab = () => {
  tabsRef.value?.refreshCurrentTab()
}


onMounted(() => {
  const templates = app.setting.pos_config.print_settings.filter(x => x.print_type == 'Working Day' && x.ui_template);
  templates.forEach(d => {
    tabs.value.push(
      {
        label: t(d.title || d.print_template),
        component: ComServerContent,
        props: {
          options: {
            doctype: "Working Day",
            docname: app.route.params.name,
            template: d.ui_template,
            print_template: d.print_template
          }
        }
      })
  })

  if(tabs){
  selectedTab.value = tabs.value[0];
}



// get printer
const printer = app.storageService.getItem("default_printer")
  printer_name.value = printer || ""
  
})



</script>