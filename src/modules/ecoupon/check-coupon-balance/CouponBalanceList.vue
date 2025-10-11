<template>
<ion-page>
    <AppBar>{{ t("Coupon Balance List") }}</AppBar>
    <ion-content>
         <slot name="searchBar">
        <ComSearchBar  @onSearch="onSearch" :focus="focus"
         ref="txtSearchRef" />
    </slot>
       <DataTable :value="couponData" showGridlines stripedRows  responsiveLayout="scroll" class="mt-3">
       
        <Column field="coupon_number" header="Coupon Number" sortable>
           <template #body="slotProps">
  <router-link 
    :to="{
      path: '/check-balance-detail/' + slotProps.data.coupon_number,
      state: slotProps.data
    }"
  >
    <span>{{ slotProps.data.coupon_number }}</span>
  </router-link>
</template>
        </Column>
        <Column field="price" header="Price" sortable headerClass="text-center" bodyClass="text-right">
            <template #body="slotProps">
                <ComCurrency :value="slotProps.data.price" />
            </template>
        </Column>
        <Column field="top_up_amount" header="Top Up" sortable headerClass="text-center" bodyClass="text-right">
            <template #body="slotProps">
                <ComCurrency :value="slotProps.data.top_up_amount" />
            </template>
        </Column>
        <Column field="use_amount" header="Use Amount" sortable headerClass="text-center" bodyClass="text-right">
            <template #body="slotProps">
                <ComCurrency :value="slotProps.data.use_amount" />
            </template>
        </Column>
        <Column field="redeem_amount" header="Redeem" sortable headerClass="text-center" bodyClass="text-right">
            <template #body="slotProps">
                <ComCurrency :value="slotProps.data.redeem_amount" />
            </template>
        </Column>
        <Column field="balance_amount" header="Balance" sortable headerClass="text-center" bodyClass="text-right">
            <template #body="slotProps">
                <ComCurrency :value="slotProps.data.balance_amount" />
            </template>
        </Column>
        <Column field="posting_date" header="Posting Date" sortable headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
                {{dayjs(posting_date).format('DD/MM/YYYY')}}
            </template>
        </Column>
        <Column field="is_redeem" header="Redeemed" sortable></Column>
      </DataTable>  
    </ion-content>
</ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCheckCouponBalance } from '@/hooks/useCheckCouponBalance.js'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ComSearchBarcode from "@/modules/ecoupon/RedeemList/components/ComSearchBarcode.vue"
import ComSearchBar from '@/views/components/ComSearchBar.vue';
import dayjs from 'dayjs';
const t = window.t
const couponData = ref([]);

onMounted(async () => {
  const data = await useCheckCouponBalance();
  if (data) {
    couponData.value = data;
  }
});
</script>