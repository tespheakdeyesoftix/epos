<template>
    <ion-page>
        <ToolBar>
            {{ t("Sale Coupon") }} 
            <ion-text v-if="saleDoc.name"> - {{ saleDoc.name }}</ion-text>
            <ion-chip :color="saleDoc.sale_status == 'Bill Requested'?'success':'danger'">{{ saleDoc.sale_status }}</ion-chip>
            <template #end>
              <ComPendingOrderButton/>
              <ComUserProfile />
            </template>
        </ToolBar>
        <ion-content>
          <ion-split-pane when="xs" content-id="main" :style="{'--side-width': (userPreference?.sale_ui_setting?.product_container_width || '65') + '%'}">
    <ion-menu content-id="main">
      <ion-content> 
        <ComCouponProductList />
      </ion-content>
       <ComSaleCouponFooter/>
    </ion-menu>

    <div class="ion-page" id="main">
       <ComCustomerCard v-if="saleDoc?.customer"/>
       <ion-list v-if="saleDoc.reference_number && saleDoc.tbl_number" >
        <ion-item v-if="saleDoc.reference_number">
            <ion-label>{{ t("Reference #") }}</ion-label>
            <ion-label>{{ saleDoc.reference_number }}</ion-label>
        </ion-item>
        <ion-item v-if="saleDoc.tbl_number">
            <ion-label>{{ t("Table Number") }}</ion-label>
            <ion-label>{{ saleDoc.tbl_number }}</ion-label>
        </ion-item>
       </ion-list>
      <ion-content class="ion-no-padding"> 
      <ComSaleProductCoupon />
   
      </ion-content>
    <ComSaleSummary/>
     <ComPaymentButton />
    
    </div>
  </ion-split-pane>
 
        </ion-content>
     
    </ion-page>
 
</template>
<script setup>
import { onMounted, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCouponProductList from "@/modules/ecoupon/sale-coupon/components/ComCouponProductList.vue"
import ComSaleProductCoupon from "@/modules/ecoupon/sale-coupon/components/ComSaleProductCoupon.vue"
import ComSaleSummary from "@/modules/ecoupon/sale-coupon/components/ComSaleSummary.vue";
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"
import ComSaleCouponFooter from "@/modules/ecoupon/sale-coupon/components/ComSaleCouponFooter.vue"
    import ComUserProfile from "@/views/layouts/ComUserProfile.vue"  
    import ComPaymentButton from "@/modules/ecoupon/sale-coupon/components/ComPaymentButton.vue"  
    import ComPendingOrderButton from "@/modules/ecoupon/sale-coupon/components/ComPendingOrderButton.vue"  
  import { useApp } from "@/hooks/useApp";
import { onBeforeRouteLeave } from 'vue-router'
const plateform = ref(app.utils.getPlateform())
const {userPreference} = useApp()
const { saleDoc,initSaleDoc,getSaleDoc,saleType,pageRoute } = useSaleCoupon()
import {

  IonSplitPane,

} from '@ionic/vue';


const t = window.t
 

onMounted(async ()=>{
  pageRoute.value = "/sale-coupon"
  saleType.value = "Sale Coupon";
  if(app.route.params.name){
    await getSaleDoc()
    
    }else {

      saleDoc.value.sale_type= "Sale Coupon";
    }
})

onBeforeRouteLeave(async (to, from, next) => {
  if (saleDoc.value.sale_products.length > 0) {
    const confirm = await app.onConfirm("Confirm", "You have pending order. Do you want to continue?")
    if (!confirm) {
      next(false)  
    } else {
         
      initSaleDoc()
next()
    }
  } else {
    initSaleDoc()
    next()
  }
})
</script>
<style scoped>
.bg-order-card{
  background-color: var(--ion-color-light-tint);
}
ion-split-pane {
    
    --side-max-width: 75%;
    --border: 1px dashed #b3baff;
}


</style>