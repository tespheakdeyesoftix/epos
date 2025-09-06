<template>
    <ion-page>
        <ToolBar>{{ t("Sale Detail") }} - {{ doc?.name }}
            <ComStatus :status="doc?.docstatus==2?'Deleted':doc?.sale_status"/>
            <template #end>
                <ComSaleDetailMobileActionMenu v-if="doc?.pos_profile"
                    :pos_profile="doc.pos_profile"
                    @onEdit="onEdit"
                    @onPrint="onPrint"
                    @onDelete="onDelete"
                />
            </template>
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
                <ion-button @click="onEdit" shape="round" v-if="doc?.sale_type=='Sale Coupon'" :disabled="doc?.docstatus!=1">{{ t("Edit") }}</ion-button>
                <ComPrintBillButton  :name="doc?.name"/>

                <ion-button :disabled="doc?.docstatus!=1" v-if="doc?.sale_type!='Top Up'"  shape="round" color="danger" @click="onDelete" >{{ t("Delete") }}</ion-button>
                
                            </div>
                                
            </ion-toolbar>
        </ion-footer>
    </ion-page>


</template>
<script setup>
import { timeOutline, personOutline, returnUpBackOutline, pencilOutline} from 'ionicons/icons';
import { onMounted, ref, computed } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import   ComSaleDetailDesktop   from "@/views/sales/components/ComSaleDetailDesktop.vue"
import   ComSaleDetailMobile   from "@/views/sales/components/ComSaleDetailMobile.vue"
import   ComPrintBillButton   from "@/views/sales/components/ComPrintBillButton.vue"
import   ComSaleDetailMobileActionMenu   from "@/views/sales/components/ComSaleDetailMobileActionMenu.vue"
const plateform = ref(app.utils.getPlateform())



 
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
     await app.sale.onEditBill({docname:doc.value.name,sale_type:doc.value.sale_type})
    
}
async function onPrint(format){
    // add to audit trail
    await app.printing.onPrintBill({
        docname: doc.value.name,
        template:format.pos_receipt_template,
        is_reprint:1,
        show_loading:true
    })
}
async function onDelete(){

    
  if(doc.sale_type=="Top Up"){
    await app.utils.onConfirmDanger("Delete Top Up", "Top Up is not allow to delete. Please process transaction redeem?");
    return

  }

  const confirm = await app.utils.onConfirmDanger("Delete Sale", "Are you sure you want to delete this Sale Order?");
  if (!confirm) return;
  const l = await app.showLoading();
  const res = await app.postApi("epos_restaurant_2023.api.api.delete_sale_coupon",{
      name:doc.value.name,
      auth:{
            full_name:app.currentUser.full_name,
            username:app.currentUser.name,
            note:""
        }
  });  
  if (res.data) {   
    app.showSuccess("Delete record successfully")
    window.reloadData = true
    if(window.history.length<=1 || ["/sale-coupon-list",'/redeem-list','top-up-list'].includes(window.fromRoute)){
        app.router.back()
    }else {  
        app.ionRouter.navigate(window.fromRoute, "forward","replace")
    }
  
  }
  await l.dismiss();    
}

 
onMounted(async () => {

    await loadData()
})
   

</script> 