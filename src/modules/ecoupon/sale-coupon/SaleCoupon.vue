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
          <ion-split-pane when="xs" content-id="main">
    <ion-menu content-id="main">
      <ion-content> 
        <ComCouponProductList />
      </ion-content>
       <ComSaleCouponFooter/>
    </ion-menu>

    <div class="ion-page" id="main">
       <ComCustomerCard v-if="saleDoc?.customer"/>
      <ion-content class="ion-padding"> 
        
                        <ComSaleProductCoupon />
      </ion-content>
   
     <ComPaymentButton />
  ​
    </div>
  </ion-split-pane>
 
        </ion-content>
     
    </ion-page>
 
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCouponProductList from "@/modules/ecoupon/sale-coupon/components/ComCouponProductList.vue"
import ComSaleProductCoupon from "@/modules/ecoupon/sale-coupon/components/ComSaleProductCoupon.vue"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"
import ComSaleCouponFooter from "@/modules/ecoupon/sale-coupon/components/ComSaleCouponFooter.vue"
    import ComUserProfile from "@/views/layouts/ComUserProfile.vue"  
    import ComPaymentButton from "@/modules/ecoupon/sale-coupon/components/ComPaymentButton.vue"  
    import ComPendingOrderButton from "@/modules/ecoupon/sale-coupon/components/ComPendingOrderButton.vue"  
  
import { onBeforeRouteLeave } from 'vue-router'
const plateform = ref(app.utils.getPlateform())
const { saleDoc,initSaleDoc,getSaleDoc } = useSaleCoupon()


const t = window.t
 

onMounted(async ()=>{
  if(app.route.params.name){
    await getSaleDoc()
    }else {
      initSaleDoc();
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
    next()
  }
})
</script>
<style scoped>
.bg-order-card{
  background-color: var(--ion-color-light-tint);
}
ion-split-pane {
    --side-width: 65%;
    --side-max-width: 65%;
    --border: 1px dashed #b3baff;
}


</style>