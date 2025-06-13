<template>
    <ion-page>
        <ToolBar>
            {{t("Sale Coupon")}}
        </ToolBar>
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="8"> 
<ComCouponProductList/>
                    </ion-col>
                    <ion-col size="4"  class="mt-4">
                          <ion-list>
                         
                        <!-- {{ saleDoc }} -->
                           <ion-item class="ion-no-margin ion-no-padding">
                        {{ saleDoc.business_branch }}
                        </ion-item>
                        <ion-item class="ion-no-margin ion-no-padding">
                        {{ saleDoc.customer }}
                        </ion-item>
                          <ion-item class="ion-no-margin ion-no-padding">
                        {{ saleDoc.stock_location }}
                        </ion-item>
                          <ion-item class="ion-no-margin ion-no-padding">
                        {{ saleDoc.outlet }}
                          </ion-item>
                         </ion-list>
                    </ion-col>
                </ion-row>
            </ion-grid>
  
  <ion-button @click="onSave">Save Me</ion-button>
        </ion-content>
    </ion-page>
  
</template>
<script setup>
import {ref} from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import ComCouponProductList from "@/modules/ecoupon/sale-coupon/components/ComCouponProductList.vue"

const {saleDoc} = useSaleCoupon()
 
const t = window.t

async function onSave(){
    const res = await app.createDoc("Sale",data.value)

    console.log(res)
}

</script>