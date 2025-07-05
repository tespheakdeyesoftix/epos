<template>
    <ion-page>
        <ToolBar>
            {{ t("Cashier Shift Detail") }} - {{ name }}
        </ToolBar>
    <ion-content>
      <div class="fixed-container ion-padding mt-4 mb-2" v-if="!cashierShiftPrinter && !loading"> 
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
       <component :is="d.component"  v-if="d.is_loaded==true" :data="data" :cashier_shift="name"/>
    </ion-segment-content>
    
  </ion-segment-view>
    </ion-content>
    <ComFooter>
       <ion-button :disabled="data?.shift_doc.is_closed == 1" :routerLink="'/close-shift'">{{ t("Close Shift") }}</ion-button>
       <ComPopOver>
         <ion-button>{{ t("Print") }}</ion-button>
          <template #content>
          <ion-list>
              <ion-item lines="full" @click="onPrint('html')">
                <ion-icon slot="start" :icon="eyeOutline"/>
                <ion-label>{{ t("Print Preview") }}</ion-label>
                  </ion-item>
                  
              <ion-item lines="full"  @click="onPrint()">
                <ion-icon :icon="printOutline" slot="start"/>
                <ion-label>{{ t("Print") }}</ion-label>
                  </ion-item>
                  
              <ion-item lines="full" @click="onPrint('pdf')">
                 <ion-icon :icon="cloudDownloadOutline" slot="start"/>
                <ion-label>{{ t("Download PDF") }}</ion-label>
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
import { cloudDownloadOutline, eyeOutline, printOutline } from 'ionicons/icons';
import Message from 'primevue/message';
const selected  = ref({ label: "Shift Information", print_template:"Coupon Shift Summary" })
const tabs = ref([
    { label: "Shift Information", is_loaded: true, component: ComCashierShiftSummary,print_template:"Coupon Shift Summary" },
    { label: "Receipt List", is_loaded: false, component:ComReceiptList },
    { label: "Coupon Detail", is_loaded: false, component:ComReceiptList },
 
])
const loading = ref(true)

const cashierShiftPrinter = ref()

const t = window.t;
const data = ref()
const name = ref(app.route.params.name)
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


const onRefreshData = async (event) => {
    await getData()
    event.target.complete();
  
};


function onSelected(event) {
    const s = tabs.value.find(x=>x.label == event.detail.value);
    s.is_loaded = true;
    selected.value = s;

}

async function onPrint(return_type="base64"){
   
  if(return_type=="pdf"){
    app.printing.downloadPdf("Cashier Shift",name.value, selected.value.print_template)
  }else if(return_type=="html"){
    app.printing.printPreview("Cashier Shift", name.value, selected.value.print_template)
  }else {
     app.printing.onPrint("Cashier Shift",name.value,selected.value.print_template,cashierShiftPrinter.value)
  }
}


onMounted(async ()=>{
await getData();
  const printer = app.storageService.getItem("cashierShiftPrinter")
  cashierShiftPrinter.value = printer || ""


  loading.value = false;
})


</script>