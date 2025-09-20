<template>
  <!-- plateform == 'desktop' -->
  <ion-card class="ion-no-margin mb-2 mt-2" >
    <ion-card-content class="ion-no-padding">
 
      <ion-grid >
    <ion-row>
      <ion-col size="6" size-md="3" >
        <ion-chip class="m-0 w-full"><strong>
              {{ t("Opening Amount") }} <br>
              <ComCurrency :value="data?.redeem_coupon_info.actual_amount" />
            </strong>
          </ion-chip>
      </ion-col>
      <ion-col size="6"  size-md="3">
         <ion-chip class="m-0 w-full" color="danger">
            <strong> {{ t("Used Coupon") }} <br>
               <ComCurrency :value="data?.redeem_coupon_info.used_coupon_value" />
             </strong>
          </ion-chip>
      </ion-col >
      <ion-col size="6"  size-md="3">
           <ion-chip class="m-0 w-full" color="primary">
            <strong> {{ t("Top Up") }} <br>
              <ComCurrency :value="topUpCouponAmount" />
            </strong>
          </ion-chip>
      </ion-col>
      <ion-col size="6"  size-md="3">
           
          <ion-chip class="m-0 w-full" color="success">
            <strong> {{ t("Amount to Redeem") }} <br>
              <ComCurrency :value="data?.redeem_coupon_info.actual_amount_balance" />
            </strong>
          </ion-chip>
      </ion-col>
    </ion-row>
  </ion-grid>

      <stack row class="mt-4 ion-padding" equal>
        <stack row gap="10px">
          <ion-avatar class="border-2">
            <Img v-if="data?.product_photo" :src="data?.product_photo" />
            <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.product_name) }}
            </div>
          </ion-avatar>

          <div>
            <stack gap="2px">
              <ion-text>{{ data?.product_code }} - {{ data?.product_name }}</ion-text>
              <ion-text>
                {{ t("Coupon Number") }}: {{ couponNumber }}
              </ion-text>
              <ion-text>
                {{ t("Price") }}:
                <ComCurrency :value="data?.redeem_coupon_info.input_actual_amount" :currency="currency" />
              </ion-text>
            </stack>

          </div>
        </stack>

        <ion-button style="float: right;" color="danger" shape="round" @click="onDelete">
          <ion-icon :icon="trashBinOutline" />
        </ion-button>
      </stack>
      <ion-accordion-group class="ion-padding">
        <ion-accordion value="first">
          <ion-item slot="header" class="border-round-xl mt-2" color="light">
            <ion-label class="ion-no-padding">{{ t('Coupon Transaction') }} </ion-label>
          </ion-item>
          <div slot="content">
            <ion-grid>
              <!-- Table Header -->
              <ion-row class="ion-text-center ion-no-padding" color="light">
                <ion-col><strong>{{ t('Transaction Type') }} </strong></ion-col>
                <ion-col><strong>{{ t('Markup %') }} </strong></ion-col>
                <ion-col><strong>{{ t('Actual Amount') }} </strong></ion-col>
                <ion-col><strong>{{ t('Coupon Value') }}</strong></ion-col>
              </ion-row>
              <ion-row v-for="(txn, index) in data.redeem_coupon_info.coupon_transaction" :key="index"
                class="ion-text-center">
                <ion-col>{{ t(txn.transaction_type) }}</ion-col>
                <ion-col>{{ parseFloat(txn.markup_percentage).toFixed(2) }} %</ion-col>
                <ion-col>
                  <ComCurrency :value="txn.input_actual_amount" />
                </ion-col>
                <ion-col>
                  <ComCurrency :value="txn.coupon_amount" />
                </ion-col>
              </ion-row>
            </ion-grid>

          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-card-content>

  </ion-card>
 

</template>
<script setup>
import { getAvatarLetter } from "@/helpers/utils"
import { useSaleCoupon } from "@/hooks/useSaleCoupon";
import { trashBinOutline } from "ionicons/icons";
import { computed } from "vue";
const { saleDoc } = useSaleCoupon()
const props = defineProps({
  data: Object,
  index: Number
})


const couponNumber = computed(() => {
  return props.data?.coupons[0]["coupon"]
})
 
const topUpCouponAmount = computed(() => {
  return props.data.redeem_coupon_info.coupon_transaction.filter(x => x.transaction_type == 'Top Up').reduce((sum, item) => sum + (item?.actual_amount || 0), 0);
})


const t = window.t;

async function onDelete() {
  const confirm = await app.utils.onConfirmDanger("Confirm", "Are your sure you want to delete this redeem card?")
  if (confirm) {
    saleDoc.value.sale_products.splice(props.index, 1);
  }
}

</script>

<style scoped>
.chip-style {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  /* Hide scrollbar for WebKit browsers */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

.chip-style::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}

.scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.scroll-container ion-grid {
  min-width: 600px;
  /* enough width so columns don't squish */
}

ion-avatar {
  width: 50px;
  height: 50px;
}

.icon-circle {
  --padding-start: 0;
  --padding-end: 0;
  width: 40px;
  /* adjust size */
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>