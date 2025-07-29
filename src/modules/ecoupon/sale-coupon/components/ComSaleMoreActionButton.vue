<template>
    <ion-button shape="round" expand="full" 
    @click="openPopover($event)" 
    >{{ t("Mores") }}</ion-button>
    
 <ion-popover 
    
    :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false"
    :dismiss-on-select="true" 
    style="--width:500px"
    >
    <ion-content>
        <ion-grid>
            <ion-row>
                <ion-col>
                    <ion-list>
                        <ion-item button lines="full" @click="onChangeReferenceNumber">
                            <ion-label>{{ t("Set Reference Number") }}</ion-label>
                        </ion-item>
                        
                      <ion-item button lines="full" @click="onChangeNote">
                            <ion-label>{{ t("Note") }}</ion-label>
                        </ion-item>
                         
                      <ion-item button lines="full" @click="onOpenUISetting">
                            <ion-label>{{ t("UI Setting") }}</ion-label>
                        </ion-item>
                         

                    </ion-list>
                </ion-col>
                <ion-col>
                    <ion-list>
                        <ion-item button @click="onViewOrderDetail">
                            <ion-label>{{ t("View Order Detail") }}</ion-label>
                        </ion-item>
                        <ion-item button @click="onDeleteOrder" :disabled="!saleDoc.name">
                            <ion-label color="danger">{{ t("Delete this Order") }}</ion-label>
                        </ion-item>
                         
                    </ion-list>

                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
  </ion-popover>

</template>
<script setup >
import { useApp } from '@/hooks/useApp';
import { useSaleCoupon } from '@/hooks/useSaleCoupon';
import ComOrderDetailModal from '@/modules/ecoupon/sale-coupon/components/ComOrderDetailModal.vue';
import ComSaleUISetting from '@/views/components/ComSaleUISetting.vue';
import { ref } from 'vue';

const {saleDoc} = useSaleCoupon();

const t = window.t;
const popoverOpen = ref(false)
const event = ref(null)
const {getUserPreference} = useApp();
function openPopover(e) {
 
  event.value = e
  popoverOpen.value = true
}

async function onChangeReferenceNumber(){
    const result = await app.utils.onOpenKeyboard({
        title:t("Reference Number")
    })
    if(result){
saleDoc.value.reference_number = result;
    }
    
}

async function onChangeNote(){
    const result = await app.utils.onOpenKeyboard({
        title:t("Note"),
          defaultValue:saleDoc.value.note || "",
        storageKey:"sale_note"
    })
    
    if( (typeof result) == "string"){
saleDoc.value.note = result;
    }
    
}

function onViewOrderDetail(){
    app.openModal({
        component:ComOrderDetailModal,
        cssClass:"fullscreen-modal"

    })
}

async function onDeleteOrder(){
    

    const confirm = await app.onConfirm("Delete order","Are you sure you want to delete this order");
    if (!confirm) return;

    const l = await app.showLoading()
    const res = await app.postApi("epos_restaurant_2023.api.api.delete_sale",{
        name:saleDoc.value.name,
        auth:{
            full_name:app.currentUser.full_name,
            username:app.currentUser.name,
            note:""
        }
    })
    
    if(res.data){
        
            await l.dismiss()
           
            app.ionRouter.navigate("/sale-coupon","forward","replace")
    }
    
    await l.dismiss()
 

}


async function onOpenUISetting(){

    const result = await app.openModal({
        component:ComSaleUISetting
    })
    if(result){
        //save setting 
        await app.storageService.setItem("userPreference",JSON.stringify(result))
    }
     else {
        // revert change to origninal
        await getUserPreference()
     }
}
</script>