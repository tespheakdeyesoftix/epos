<template>
  <ion-page>
    <ToolBar>
      {{ t("Cashier Shift Detail") }} - {{ name }}
      <template #end>
        <ion-button @click="refreshCurrentTab">
          <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
        </ion-button>
        <!-- popover -->
        <ComSettingShift v-model="selectedTab" />

      </template>
    </ToolBar>
    <ion-content>
     
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


const name = ref(app.route.params.name)
const t = window.t;
const tabsRef = ref(null)
const selectedTab = ref({})
function onTabChange(index){
  selectedTab.value = tabs.value[index];
}

const tabs = ref([])


const refreshCurrentTab = () => {
  tabsRef.value?.refreshCurrentTab()
}


onMounted(() => {
  const templates = app.setting.pos_config.print_settings.filter(x => x.print_type == 'Cashier Shift' && x.ui_template);
  templates.forEach(d => {
    tabs.value.push(
      {
        label: t(d.title || d.print_template),
        component: ComServerContent,
        props: {
          options: {
            doctype: "Cashier Shift",
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

})



</script>