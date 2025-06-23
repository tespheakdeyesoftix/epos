<template>
 {{ data }}
    <ion-card class="ion-no-margin mb-2 mt-2">
        <ion-card-content>
            <stack row>

                <ion-avatar>
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
                <div>
                    <ion-label>{{ t("Opening Amount") }} : <strong><ComCurrency :value="data?.redeem_coupon_info.input_coupon_amount" /></strong></ion-label>
                    <ion-label>{{ t("Used") }} : <strong><ComCurrency :value="useCouponAmount" /></strong></ion-label>
                    <ion-label>{{ t("Top Up") }} : <strong><ComCurrency :value="topUpCouponAmount" /></strong></ion-label>
                    <ion-label>{{ t("Balance") }} : <strong><ComCurrency :value="data?.redeem_coupon_info.coupon_balance" /></strong></ion-label>
                    <ion-label color="success">{{ t("Redeem Amount") }} : <strong><ComCurrency :value="data?.redeem_coupon_info.actual_amount_balance" /></strong></ion-label>
                </div>

            </stack>
          <ion-button color="danger" shape="round" @click="onDelete"> 
            <ion-icon :icon="trashBinOutline" />
           {{t("Delete")}}
          </ion-button>
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