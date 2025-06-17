<template>
    <ion-footer>
        <ion-toolbar>
        
                        <stack row equal gap="5px" class="ion-padding-horizontal">
                            <ion-button shape="round" routerLink="/home" expand="full" >
                                  <ion-icon slot="start" :icon="homeOutline" />
                                {{ t("Home")
                                }}</ion-button>
                            <ion-button shape="round" expand="full"  @click="onSaveAsDraft">
                                <ion-icon slot="start" :icon="saveOutline" />
                                <ion-label>  {{ t("Save")}}</ion-label>
                              
                                </ion-button>
                            <ComPrintBillButton/>
                            <ion-button id="discount" expand="full"  shape="round"  >
                                <ion-icon slot="start" :icon="pricetagOutline" />
                                <ion-label>{{ t("Discount") }}</ion-label>
                                </ion-button>
                            <ComQuickPayButton />
                        </stack>
                
        </ion-toolbar>
    </ion-footer>
    <!-- discount pop over -->
 <ion-popover trigger="discount" trigger-action="click" :dismiss-on-select="true">
    <ion-content class="ion-padding">
        <ion-list>
            <ion-item  v-if="canDiscount" lines="full" button @click="onSaleDiscountPercent">
                <img slot="start" src="/assets/percent_icon.svg" style="height:20px;width:20px;"/>
                <ion-label style="margin-left: 20px;">{{ t("Discount Percent") }}</ion-label>
            </ion-item>
            
            <ion-item v-if="canDiscount" button lines="full" @click="onSaleDiscountAmount">
                <ion-icon :icon="logoUsd" slot="start"/>
                <ion-label  >{{ t("Discount Amount") }}</ion-label>
            </ion-item>
            
            <ion-item color="danger" v-if="!canDiscount" button lines="full" @click="onDeleteDiscount">
                <ion-icon :icon="closeOutline" slot="start"/>
                <ion-label  >{{ t("Remove Discount") }}</ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
  </ion-popover>
<!-- print bill -->
 <ion-popover trigger="print-bill" :is-open="false"   :dismiss-on-select="true">
    <ion-content class="ion-padding">
        <ion-list>
            <ion-item  v-if="canDiscount" lines="full" button @click="onSaleDiscountPercent">
                <img slot="start" src="/assets/percent_icon.svg" style="height:20px;width:20px;"/>
                <ion-label style="margin-left: 20px;">{{ t("Discount Percent") }}</ion-label>
            </ion-item>
            
            <ion-item v-if="canDiscount" button lines="full" @click="onSaleDiscountAmount">
                <ion-icon :icon="logoUsd" slot="start"/>
                <ion-label  >{{ t("Discount Amount") }}</ion-label>
            </ion-item>
            
            <ion-item color="danger" v-if="!canDiscount" button lines="full" @click="onDeleteDiscount">
                <ion-icon :icon="closeOutline" slot="start"/>
                <ion-label  >{{ t("Remove Discount") }}</ion-label>
            </ion-item>


        </ion-list>
    </ion-content>
  </ion-popover>



</template>
<script setup>
import { computed, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComPaymentButton from "@/modules/ecoupon/sale-coupon/components/ComPaymentButton.vue"
import ComQuickPayButton from "@/modules/ecoupon/sale-coupon/components/ComQuickPayButton.vue"
import ComPrintBillButton from "@/modules/ecoupon/sale-coupon/components/ComPrintBillButton.vue"
import { closeOutline, homeOutline, logoUsd, pricetagOutline, saveOutline } from "ionicons/icons"

const { saleDoc, onSaveAsDraft,onSaleDiscountPercent,onSaleDiscountAmount,totalSaleDiscountAmount } = useSaleCoupon()
const printFormat = app.setting?.print_formats?.filter(x=>x.show_in_pos==1 && x.doc_type==="Sale");
const t = window.t

const canDiscount = computed(()=>{
    if(saleDoc.value.discount_type == "Percent") {
        return (saleDoc.value.discount ||0) == 0 
    }
    else {
return   (saleDoc.value.sale_discount || 0)==0;
    }
    

})

async function onDeleteDiscount(){
    const hasPermission =await app.utils.hasPermission("cancel_discount_sale")
    if(!hasPermission) return;
    let note = "" 
    if(app.setting.pos_config.cancel_discount_sale_required_note ==1){
        note =  await app.utils.onOpenKeyboard({
            title:t("Cancel Discount Note"),
            storageKey:"cancel_discount_sale_required_note"
        });
    }
    // note not use for now will add to audit trail

    saleDoc.value.discount = 0;
    saleDoc.value.sale_discount = 0;

    app.showSuccess("Remove dicount successfully")

}

</script>