<template>
    <ion-page>
        <ToolBar>
            {{ t("Cashier Shift Detail") }} - {{ name }}
        </ToolBar>
    <ion-content>
 
      <div class="fixed-container ion-padding mt-4 mb-2" v-if="!default_printer && !loading"> 
        <Message severity="warn">{{ t("There's no default printer for shift report.") }} <br/> <ion-button routerLink="/setting">{{ t("Setup Now") }}</ion-button></Message>
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
       <component :is="d.component"  v-if="d.is_loaded==true" :data="data" :cashier_shift="name" :options="d.props || {}"/>
    </ion-segment-content>
    
  </ion-segment-view>
    </ion-content>

    <ComFooter v-if="plateform == 'mobile'">
  <ion-grid>
    <ion-row class="ion-justify-content-around ion-align-items-center">
      
      <!-- Close Shift -->
      <ion-col size="3" class="ion-no-padding">
        <ion-button 
          
          expand="block" 
          :disabled="data?.shift_doc.is_closed == 1" 
          @click="onOpenCloseShift">
          <ion-label style="font-size: 15px;">{{ t("Close Shift") }}</ion-label>
          
        </ion-button>
      </ion-col>

      <!-- Print Preview -->
      <ion-col size="3" class="ion-no-padding">
        <ComPopOver>
          <ion-button expand="block">
            <!-- <ion-icon :icon="eyeOutline" slot="start"></ion-icon> -->
            <ion-text>{{ t("Print Preview") }}</ion-text>
            
          </ion-button>
          <template #content>
            <ion-list>
              <ion-item v-for="l in languages" :key="l.server_lang" lines="full" @click="onPrint('html',l.server_lang)">
                <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
                <ion-label>{{ l.label }}</ion-label>  
              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
      </ion-col>

      <!-- Print -->
      <ion-col size="2" class="ion-no-padding">
        <ComPopOver>
          <ion-button expand="block" style="height: 45px;">
            <!-- <ion-icon :icon="printOutline" slot="start"></ion-icon> -->
             <ion-text>{{ t("Print") }}</ion-text>
            
          </ion-button>
          <template #content>
            <ion-list>
              <ion-item v-for="l in languages" :key="l.server_lang" lines="full" @click="onPrint('base64',l.server_lang)">
                <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
                <ion-label>{{ l.label }}</ion-label>  
              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
      </ion-col>

      <!-- Download PDF -->
      <ion-col size="4" class="ion-no-padding">
        <ComPopOver>
          <ion-button expand="block">
            <!-- <ion-icon :icon="cloudDownloadOutline" slot="start"></ion-icon> -->
            {{ t("Download PDF") }}
          </ion-button>
          <template #content>
            <ion-list>
              <ion-item v-for="l in languages" :key="l.server_lang" lines="full" @click="onPrint('pdf',l.server_lang)">
                <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
                <ion-label>{{ l.label }}</ion-label>  
              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
      </ion-col>

    </ion-row>
  </ion-grid>
</ComFooter>


    <!-- plateform != 'mobile' -->
    <ComFooter v-if="plateform != 'mobile'">
       <ion-button :disabled="data?.shift_doc.is_closed == 1" @click="onOpenCloseShift">{{ t("Close Shift") }}</ion-button>
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
       <ComPopOver>
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
import ComCashierShiftSummary from "@/views/shift/components/ComCashierShiftSummary.vue"
import ComReceiptList from "@/views/shift/components/ComReceiptList.vue"
import ComServerContent from "@/views/components/public/ComServerContent.vue"
import { cloudDownloadOutline, eyeOutline, printOutline } from 'ionicons/icons';
import Message from 'primevue/message';
import { useApp } from '@/hooks/useApp';
const {languages} = useApp()
const selected  = ref({ label: "Shift Information", print_template:"Coupon Shift Summary" })
const name = ref(app.route.params.name)
const tabs = ref([
    { label: "Shift Information", is_loaded: true, component: ComCashierShiftSummary,print_template:"Coupon Shift Summary" },
    { label: "Receipt List", is_loaded: false, component:ComReceiptList , print_template:"Coupon Shift Receipt List"},
    { label: "Sale Product Detail", is_loaded: false, component:ComServerContent, print_template:"Cashier Shift Sale Product Summary - Print", props:{
      doctype:"Cashier Shift",
      docname: name.value,
      template: "Cashier Shift Sale Product Summary - UI",
     
    } },
 
])
const plateform = ref(app.utils.getPlateform())
const loading = ref(true)

const default_printer = ref()

const t = window.t;
const data = ref()

async function getData(){
  const l = await app.showLoading()
  const res = await app.getApi("epos_restaurant_2023.api.mobile.coupon_cashier_shift.get_cashier_shift_summary_inrormation",{
    cashier_shift:app.route.params.name
  })
  if(res.data){
    data.value = res.data;
  }
  await l.dismiss();
  
}

function onOpenCloseShift(){
  if(window.fromRoute == "/close-shift"){
    app.router.back()
  }else {
    app.ionRouter("/close-shift","push","replace")
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
    app.printing.downloadPdf( {doctype:"Cashier Shift",docname:name.value, template:selected.value.print_template, lang:lang})
  }else if(return_type=="html"){
    app.printing.printPreview( {doctype:"Cashier Shift",docname:name.value, template:selected.value.print_template, lang:lang,printer_name:default_printer.value,show_loading:true})
  }else {
     app.printing.onPrint( {doctype:"Cashier Shift",docname:name.value, template:selected.value.print_template,printer_name:default_printer.value, lang:lang,show_loading:true})
  }
}


onMounted(async ()=>{
await getData();
  const printer = app.storageService.getItem("default_printer")
  default_printer.value = printer || ""


  loading.value = false;
})


</script>