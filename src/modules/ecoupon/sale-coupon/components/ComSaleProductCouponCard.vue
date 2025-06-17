<template>
    <template v-if="data">
 <ion-card>
   
        <Img :src="data?.photo"/>
        {{ data.product_code }}
        {{ data.product_name }}
        QTY: {{ data.quantity }}
        {{t("Price")}}: 
        <ComCurrency :value="data.price" />
        {{t("Total Amount")}}: 
        <ComCurrency :value="data.total_amount" />
        
        {{ t("Discount") }}: <ComCurrency :value="data.discount_amount"/>
        Note: {{ data.note}}
        <hr/>
         <ion-chip v-for="(c,index) in displayCoupons" :key="index">{{ c }}</ion-chip>
         <ion-chip @click="onEditSaleProductCoupon(data)" v-if="data.coupons.length>3" color="primary">{{ data.coupons.length - 3 }} {{ t("More(s)") }}</ion-chip>
         <ion-button @click="onEditSaleProductCoupon(data)">{{t("Edit")}}</ion-button>
         <ion-button color="danger" @click="onDeleteSaleProduct(index)">{{t("Delete")}}</ion-button>
       
         
         <ion-button :id="popOverID">{{ t("More") }}</ion-button>
    </ion-card>
     
  <ion-popover :trigger="popOverID" trigger-action="click" :dismiss-on-select="true">
    <ion-content >
        <ion-list>
            <!-- discount percent -->
            <ion-item   v-if="(data.discount_amount ?? 0)==0"   @click="onProductDiscountPercent(data)" button> 
                 <ion-label> {{t("Discount Percent")}}</ion-label>
            </ion-item>
            
            
            <!-- discolunt amount -->
            <ion-item   v-if="(data.discount_amount ?? 0)==0"   @click="onProductDiscountAmount(data)" button> 
                 <ion-label> {{t("Discount Amount")}}</ion-label>
            </ion-item>
           <!-- remove discount -->
            <ion-item   v-if="(data.discount_amount ?? 0)>0"   @click="onRemoveProductDiscount(data)" button> 
                 
                <ion-label color="danger"> {{t("Remove Discount")}}</ion-label>
            </ion-item>

            <!-- addnote -->
            <ion-item v-if="!data.note"  @click="onAddNote" button> 
                <ion-icon :icon="documentOutline"/>
                 <ion-label> {{t("Note")}}</ion-label>
            </ion-item>
            <!-- remove note -->
            <ion-item  v-if="data.note"  @click="onDeleteNote" button> 
                 <ion-label color="danger"> {{t("Delete Note")}}</ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
  </ion-popover>


</template>
   
</template>
<script setup >
import { computed } from 'vue';
 
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { documentOutline } from 'ionicons/icons';
 
const { onEditSaleProductCoupon,onDeleteSaleProduct ,onProductDiscountPercent,onProductDiscountAmount,onRemoveProductDiscount} = useSaleCoupon()
const popOverID = app.utils.generateRandomString();


const props = defineProps({
    data:Object,
    index:Number
})
const t = window.t;

 

const displayCoupons = computed(()=>{
   const allCoupuns = props.data.coupons.map(x=>x.coupon);
   if(allCoupuns.length>3){
    return  allCoupuns.slice(0, 3);
   }
   return allCoupuns
})

async function onAddNote(){
    const result = await app.utils.onOpenKeyboard({
        title:t("Note on Product"),
        defaultValue: props.data.nte,
        storageKey:"sale_product_note"
    })
    if(result){
        props.data.note = result;
    }
}

function onDeleteNote(){
    props.data.note = "";
}

</script>

