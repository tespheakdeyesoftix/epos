<template>
    <ion-card class="ion-no-margin mb-2 mt-2 border-2">
        <ion-card-content>

                <div>
                    <stack row equal gab="4">
                    <ion-chip class="m-0 w-full"><strong>
                        {{ t("Opening Amount") }} <br>
                        <ComCurrency :value="data?.redeem_coupon_info.input_coupon_amount" /></strong>
                    </ion-chip> 
                    <ion-chip class="m-0 w-full" color="danger">
                       <strong> {{ t("Used") }} <br>
                         {{ data?.redeem_coupon_info.input_coupon_amount }}</strong>
                    </ion-chip> 
                      <ion-chip class="m-0 w-full" color="primary">
                       <strong> {{ t("Top Up") }} <br>
                        <ComCurrency :value="topUpCouponAmount" /></strong>
                    </ion-chip>  
                    <ion-chip class="m-0 w-full" color="success">
                       <strong> {{ t("Balance") }} <br>
                        <ComCurrency :value="data?.redeem_coupon_info.coupon_balance" /></strong>
                    </ion-chip>  
                     <ion-chip class="m-0 w-full" color="success">
                       <strong> {{ t("Redeem Amount") }} <br>
                        <ComCurrency :value="data?.redeem_coupon_info.actual_amount_balance" />
                    </strong>
                    </ion-chip>    
                    </stack>
                    
                </div>
            <stack row class="mt-4" equal  >
<stack row  gap="10px">
                <ion-avatar class="border-2">
                    <Img v-if="data?.product_photo" :src="data?.product_photo" />
                    <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.product_name) }}
                    </div>
                </ion-avatar>

                <div>
                    <stack gap="2px">
                        <ion-text>{{ data?.product_code }} - {{ data?.product_name }}</ion-text>
                        <ion-text>
                        {{t("Coupon Number") }}:  {{ couponNumber }} 
                    </ion-text>
                    <ion-text>
                        {{t("Price") }}: <ComCurrency :value="data?.redeem_coupon_info.input_actual_amount" :currency="currency" />
                    </ion-text>
                    </stack>
 
                </div>
</stack>

    <ion-button style="float: right;" color="danger" shape="round" @click="onDelete"> 
            <ion-icon :icon="trashBinOutline" />
          </ion-button>    
            </stack>
  
        </ion-card-content>
        
    </ion-card>

</template>
<script setup>
import { getAvatarLetter } from "@/helpers/utils"
import { useSaleCoupon } from "@/hooks/useSaleCoupon";
import { trashBinOutline } from "ionicons/icons";
import { computed } from "vue";
const {saleDoc} = useSaleCoupon()
const props = defineProps({
    data:Object,
    index:Number
})

const couponNumber = computed(()=>{
    return props.data?.coupons[0]["coupon"]
})
const useCouponAmount = computed(()=>{
    return props.data.redeem_coupon_info.coupon_transaction.filter(x=>x.transaction_type == 'Used').reduce((sum, item) => sum + (item?.coupon_amount ||0), 0);
})

const topUpCouponAmount = computed(()=>{
    return props.data.redeem_coupon_info.coupon_transaction.filter(x=>x.transaction_type == 'Top Up').reduce((sum, item) => sum + (item?.coupon_amount ||0), 0);
})

  
const t = window.t;

async function onDelete(){
    const confirm = await app.onConfirm("Confirm","Are your sure you want to delete this redeem card?")
    if(confirm){
        saleDoc.value.sale_products.splice(props.index,1);
    }
}

</script>