<template>
    <template v-if="data">
        <ion-card class="border-round-lg p-2">
        <div class="card-sale-product ">
            <div>
                 <div class="flex gap-2" >
                <Img class="border-round-xl" :src="data?.product_photo" />
                <div>
                    <div>
                    <ion-text>
                        <h4 class="m-0">
                           {{ data.product_code }} - {{ data.product_name }}  
                        </h4>
                    </ion-text>
                    </div>
                   <ion-text>
                    <h5 class="m-0">
                       {{ data.quantity }} x  <ComCurrency :value="data.price" /> 
                    </h5>
                   </ion-text>
                   <ion-text v-if="data.discount_amount">
                       {{ t("Discount") }}:      
                    <ComCurrency :value="data.discount_amount" />  
                   </ion-text>
                 
                </div>
                
 
            </div>
            </div>
           
            <div>
                  <ion-text>
                    <h4><ComCurrency :value="data?.total_amount" /></h4>
                  </ion-text>
            
            </div>
        </div>    
        <ion-text v-if="data.note">
            Note: 
            <div class="note-box">
                {{ data.note }}
            </div>
        </ion-text>
        <div>
            <ion-chip v-for="(c, index) in displayCoupons" :key="index">{{ c }}</ion-chip>
        </div>
            
            <ion-chip @click="onEditSaleProductCoupon(data)" v-if="data.coupons.length > 3" color="primary">{{
                data.coupons.length - 3 }} {{ t("More(s)") }}</ion-chip>
           <ion-chip v-if="data.is_free==1" color="success">{{ t("Free") }}</ion-chip>
           <ion-button @click="onChangeSaleProductPrice(data)">{{ t("Price") }}</ion-button>
            <ion-button :disabled="data.name || data.append_quantity == 0" shape="round"
                @click="onChangeSaleProductQuantity(data)">{{ t("QTY") }}</ion-button>
            <ion-button @click="onEditSaleProductCoupon(data)">{{ t("Edit") }}</ion-button>
            <ion-button color="danger" @click="onDeleteSaleProduct(index)">{{ t("Delete") }}</ion-button>


            <ion-button :id="popOverID">{{ t("More") }}</ion-button>
        </ion-card>

        <ion-popover :trigger="popOverID" trigger-action="click" :dismiss-on-select="true">
            <ion-content>
                <ion-list>
                    <!-- Free -->
                    <ion-item v-if="data.allow_free==1 && (data.is_free || 0) == 0"  @click="onFreeProduct(data)" button>
                        <ion-label> {{ t("Free") }}</ion-label>
                    </ion-item>
                   
                    <!--Remove Free -->
                    <ion-item v-if="data.allow_free==1 && (data.is_free || 0) == 1" @click="onRemoveFreeProduct(data)" button>
                        <ion-label> {{ t("Remove Free") }}</ion-label>
                    </ion-item>

                    <!-- discount percent -->
                    <ion-item v-if="(data.discount_amount ?? 0) == 0" @click="onProductDiscountPercent(data)" button>
                        <ion-label> {{ t("Discount Percent") }}</ion-label>
                    </ion-item>


                    <!-- discolunt amount -->
                    <ion-item v-if="(data.discount_amount ?? 0) == 0" @click="onProductDiscountAmount(data)" button>
                        <ion-label> {{ t("Discount Amount") }}</ion-label>
                    </ion-item>
                    <!-- remove discount -->
                    <ion-item v-if="(data.discount_amount ?? 0) > 0" @click="onRemoveProductDiscount(data)" button>

                        <ion-label color="danger"> {{ t("Remove Discount") }}</ion-label>
                    </ion-item>

                    <!-- addnote -->
                    <ion-item v-if="!data.note" @click="onAddNote" button>
                        <ion-icon :icon="documentOutline" />
                        <ion-label> {{ t("Note") }}</ion-label>
                    </ion-item>
                    <!-- remove note -->
                    <ion-item v-if="data.note" @click="onDeleteNote" button>
                        <ion-label color="danger"> {{ t("Delete Note") }}</ion-label>
                    </ion-item>
                </ion-list>
            </ion-content>
        </ion-popover>


    </template>

</template>
<script setup>
import { computed } from 'vue';

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { documentOutline } from 'ionicons/icons';

const { 
    saleDoc, 
    onEditSaleProductCoupon, 
    onDeleteSaleProduct,
    onProductDiscountPercent, 
    onProductDiscountAmount,
    onRemoveProductDiscount,
    onChangeSaleProductPrice,
    onChangeSaleProductQuantity,
    onFreeProduct,
    onRemoveFreeProduct
} = useSaleCoupon()
const popOverID = app.utils.generateRandomString();


const props = defineProps({
    data: Object,
    index: Number
})
const t = window.t;



const displayCoupons = computed(() => {
    const allCoupuns = props.data.coupons.map(x => x.coupon);
    if (allCoupuns.length > 3) {
        return allCoupuns.slice(0, 3);
    }
    return allCoupuns
})

async function onAddNote() {
    if (saleDoc.value.sale_status == "Bill Requested") {
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    const result = await app.utils.onOpenKeyboard({
        title: t("Note on Product"),
        defaultValue: props.data.nte,
        storageKey: "sale_product_note"
    })
    if (result) {
        props.data.note = result;
    }
}

function onDeleteNote() {
    props.data.note = "";
}

</script>
<style scoped>
.card-sale-product{
  display: flex;
  justify-content: space-between;
}
.note-box{
    background-color: var(--ion-color-light-shade);;
}
</style>