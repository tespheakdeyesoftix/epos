<template>
    <ion-page>
        <ToolBar>
            {{ t("Coupon Balance Detail") }}
        </ToolBar>
        <ion-content>
          
        <div v-if="couponDetail" class="fixed-container-cus test">
            <h2>Coupon: {{ couponDetail.coupon_number }}</h2>
            <stack row equal>
                <stack>
                     <ion-text>Price: </ion-text>
                </stack>
                <stack>
                     <ComCurrency :value="couponDetail.price" />
                </stack>
            </stack>
            <stack row equal>
                <stack>
                     <ion-text>Top Up: </ion-text>
                </stack>
                <stack>
                    <ComCurrency :value="couponDetail.top_up_amount" />
                </stack>
            </stack>
            <stack row equal>
                <stack>
                    <ion-text>Use Amount: </ion-text>
                </stack>
                <stack>
                     <ComCurrency :value="couponDetail.use_amount" />
                </stack>
            </stack>
            <stack row equal>
                <stack>
                <ion-text>Redeem Amount: </ion-text>
                </stack>
                <stack>
                <ComCurrency :value="couponDetail.redeem_amount" />
                </stack>
            </stack>
            <stack row equal>
                <stack>
                <ion-text>Balance: </ion-text>
                </stack>
                <stack>
                <ComCurrency :value="couponDetail.balance_amount" />
                </stack>
            </stack>
            <stack row equal>
                <stack>
                <ion-text>Date: </ion-text>
                </stack>
                <stack>
                {{ couponDetail.posting_date }}
                </stack>
            </stack>
            <stack row equal>
                <stack>
                <ion-text>Redeem </ion-text>
                </stack>
                <stack>
                <ion-text :color="couponDetail.is_redeem == '0' ? 'danger' : 'success'">
                    {{ couponDetail.is_redeem == '0' ? 'No Redeem' : 'Redeemed' }}
                </ion-text>
                </stack>
                 
            </stack>

        </div>

        </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import supabase from '@/services/supabase-client';
import ComCurrency from '@/views/components/public/ComCurrency.vue';

const t = window.t
const route = useRoute();
const couponNumber = route.params.coupon_number;
const couponDetail = ref(null);

onMounted(async () => {
  const { data, error } = await supabase
    .from('food_court_coupon_codes')
    .select('*')
    .eq('coupon_number', couponNumber)
    .single();

  if (error) {
    console.error(error);
  } else {
    couponDetail.value = data;
  }
});
</script>

<style scoped>
.test{
    margin-top: 50px;
    background-color: #f6f8fc;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);  
}
</style>