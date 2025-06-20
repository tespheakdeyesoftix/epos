<template>
    <ion-page>
        <ToolBar>{{ t("Sale Detail") }} - {{ doc?.name }}
            <ComStatus :status="doc?.sale_status"/>
        </ToolBar>
        <ion-content class="ion-padding">
         <div class="fix-container">
            <ComSaleDetailMobile v-if="plateform =='mobile'" :doc="doc"/>
                <ComSaleDetailDesktop v-else :doc="doc"/>
                
                </div>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <div style="display: flex;justify-content: center;gap:10px">
<ion-button @click="onEdit" shape="round" >{{ t("Edit") }}</ion-button>
<ComPrintBillButton  :name="doc?.name"/>
<ion-button shape="round" color="danger">{{ t("Delete") }}</ion-button>
                </div>
                
            </ion-toolbar>
        </ion-footer>
    </ion-page>


</template>
<script setup>
import { timeOutline, personOutline} from 'ionicons/icons';
import { onMounted, ref, computed } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import   ComSaleDetailDesktop   from "@/views/sales/components/ComSaleDetailDesktop.vue"
import   ComSaleDetailMobile   from "@/views/sales/components/ComSaleDetailMobile.vue"
import   ComPrintBillButton   from "@/views/sales/components/ComPrintBillButton.vue"

const plateform = ref(app.utils.getPlateform())
import dayjs from 'dayjs';
import Enumerable from 'linq';
const showMoreInfo = ref(false)
const t = window.t;
const doc = ref()


async function loadData() {
    const l = await app.showLoading()
    let res = await app.getDoc("Sale", app.route.params.name)
    if (res.data) {
        doc.value = res.data
        
    }

   

    await l.dismiss();

}

async function onEdit(){
    const hasPermission = await app.utils.hasPermission("edit_closed_receipt","edit_closed_receipt_required_password")
    if(!hasPermission)  return;

    
}

 
onMounted(async () => {

    await loadData()
})
   

</script> 