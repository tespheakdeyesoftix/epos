<template>
    <ion-page>
        <ToolBar>
            <span v-if="plateform!='mobile'">{{ t("Working Day Detail") }} - </span>{{ name }}
        </ToolBar>
    <ion-content>
 
      <div class="fixed-container ion-padding mt-4 mb-2" v-if="!printer_name && !loading"> 
<Message severity="warn">{{ t("There's no default printer for printing report.") }} <br/> <ion-button routerLink="/setting?modal=1">{{ t("Setup Now") }}</ion-button></Message>
      </div>
        
          <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
       <div style="position: sticky; top: 0; z-index: 10; background: white;">
       
        <ion-segment @ionChange="onSelected">
<ion-segment-button v-for="(d,index) in tabs" :key="index" :value="d.label" :content-id="'recent_' + index">
                    <ion-label>{{ t(d.label) }}</ion-label>
                </ion-segment-button>
                
  </ion-segment>
  </div>
  <ion-segment-view>
   <ion-segment-content v-for="(d,index) in tabs" :key="index"  :id="'recent_' + index">
       <component :is="d.component"  v-if="d.is_loaded==true" :data="data" :working_day="name" :options="d.props || {}"/>
    </ion-segment-content>
    
  </ion-segment-view>
    </ion-content>
    <ComFooter>

       <ion-button :disabled="data?.doc.is_closed == 1" @click="onOpenCloseShift" v-if="plateform!='mobile'" >{{ t("Close Working Day") }}</ion-button>
       <ComPopOver>

       <ion-button>
        <ion-icon :icon="eyeOutline" slot="start"></ion-icon>
        {{ t("Print Preview") }}
       </ion-button>
       <template #content>
          <ion-list>
            <ion-item v-for="l in languages"  lines="full" @click="onPrint('html',l.server_lang)">
              <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
              <ion-label>{{ l.label }}</ion-label>  
            </ion-item>
          </ion-list>
        </template>
       </ComPopOver>

       <!-- popover == mobile -->
       <ComPopOver v-if="plateform=='mobile'">
       <ion-button style="height: 45px;">
        <ion-icon :icon="printOutline" slot="start"></ion-icon>
        {{ t("Print") }}
       </ion-button>
       <template #content>
          <ion-list>
            <ion-item v-for="l in languages"  lines="full" @click="onPrint('base64',l.server_lang)">
              <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
              <ion-label>{{ l.label }}</ion-label>  
            </ion-item>
          </ion-list>
        </template>
       </ComPopOver>
       <!-- popover != mobile -->
       <ComPopOver v-if="plateform !='mobile'">
       <ion-button>
        <ion-icon :icon="printOutline" slot="start"></ion-icon>
        {{ t("Print") }}
       </ion-button>
       <template #content>
          <ion-list>
            <ion-item v-for="l in languages"  lines="full" @click="onPrint('base64',l.server_lang)">
              <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
              <ion-label>{{ l.label }}</ion-label>  
            </ion-item>
          </ion-list>
        </template>
       </ComPopOver>
       
       <ComPopOver>
       <ion-button>
        <ion-icon :icon="cloudDownloadOutline" slot="start"></ion-icon>
        {{ t("Download PDF") }}
       </ion-button>
       <template #content>
          <ion-list>
            <ion-item v-for="l in languages"  lines="full" @click="onPrint('pdf',l.server_lang)">
              <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
              <ion-label>{{ l.label }}</ion-label>  
            </ion-item>
          </ion-list>
        </template>
       </ComPopOver>
       
       
    </ComFooter>
    </ion-page>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import ComWorkingDaySummary from "@/views/working-day/components/ComWorkingDaySummary.vue"
import ComReceiptList from "@/views/shift/components/ComReceiptList.vue"
import ComServerContent from "@/views/components/public/ComServerContent.vue"
import { cloudDownloadOutline, eyeOutline, printOutline } from 'ionicons/icons';
import Message from 'primevue/message';
import { useApp } from '@/hooks/useApp';
import { useWorkingDayDetail } from '@/hooks/useWorkingDayDetail';
const plateform = ref(app.utils.getPlateform())
const {languages} = useApp()
const selected  = ref({ label: "Working Information", print_template:"Coupon Working Day Summary" })
const {
  tabs
} = useWorkingDayDetail()

const name = ref(app.route.params.name)


// const tabs = ref([
//     { label: "Working Information", is_loaded: true, component: ComWorkingDaySummary,print_template:"Coupon Working Day Summary" },
//     { label: "Receipt List", is_loaded: false, component:ComReceiptList , print_template:"Coupon Working Day Receipt List"},
//     { label: "Sale Product Detail", is_loaded: false, component:ComServerContent, print_template:"Working Day Sale Product Summary - Print", props:{
//       doctype:"Working Day",
//       docname: name.value,
//       template: "Working Day Sale Product Summary - UI",
     
//     } },
 
// ])
const loading = ref(true)

const printer_name = ref()

const t = window.t;
const data = ref()

async function getData(){
  const l = await app.showLoading()
  const res = await app.getApi("epos_restaurant_2023.api.mobile.coupon_cashier_shift.get_working_day_summary_inrormation",{
    working_day:app.route.params.name
  })
  if(res.data){
    data.value = res.data;
  }
  await l.dismiss();
  
}

function onOpenCloseShift(){
  if(window.fromRoute == "/close-working-day"){
    app.router.back()
  }else {
    app.ionRouter.navigate("/close-working-day","push","replace")
  }
}

const onRefreshData = async (event) => {
    await getData()
    event.target.complete();
  
};


function onSelected(event) {
    const s = tabs.value.find(x=>x.label == event.detail.value);
    s.is_loaded = true;
    selected.value = s;

}

async function onPrint(return_type="base64",lang="en"){
 
  if(return_type=="pdf"){
    app.printing.downloadPdf( {doctype:"Working Day",docname:name.value, template:selected.value.print_template, lang:lang})
  }else if(return_type=="html"){
    app.printing.printPreview( {doctype:"Working Day",docname:name.value, template:selected.value.print_template, lang:lang})
  }else {
     app.printing.onPrint( {doctype:"Working Day",docname:name.value, template:selected.value.print_template,printer_name:printer_name.value, lang:lang,show_loading:true})
  }
}


onMounted(async ()=>{
await getData();
  const printer = app.storageService.getItem("default_printer")
  printer_name.value = printer || ""
  loading.value = false;
})


</script>