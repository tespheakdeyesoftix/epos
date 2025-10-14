<template>
<ion-page>
    <ToolBar>{{ t("Coupon Balance List") }}</ToolBar>
    <ion-content>
       
       
         <!-- <com-input /> -->
          <com-input
            placeholder="Scan or enter coupon number"
            type="text"
            @onChange="onScanCoupon"
            focus
            @onBarcodeChange="onScanCoupon"
            :icon="scan"
          />

          <div class="mt-2">
          <ComSelectDateFilter :clear="true" @onSelect="onDateChange" />
          </div>

       <!-- <DataTable :value="couponData" showGridlines stripedRows  responsiveLayout="scroll" class="mt-3"> -->
        <DataTable
        :value="couponData"
        dataKey="coupon_number"
        selectionMode="single"
        v-model:selection="selectedCoupon"
        showGridlines
        stripedRows
        responsiveLayout="scroll"
        class="mt-3"
      >
       <!-- No -->
         <Column header="No." headerClass="text-center" bodyClass="text-center">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>

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
                {{ dayjs(slotProps.data.posting_date).format('DD/MM/YYYY') }}
            </template>
        </Column>
        <Column field="is_redeem" header="Redeemed" sortable>
              <template #body="slotProps">
            <ion-button
              size="small"
              :color="slotProps.data.is_redeem == '1' ? 'success' : 'warning'"
              :disabled="slotProps.data.is_redeem == '1'"
              @click="redeem(slotProps.data)"
            >
              {{ slotProps.data.is_redeem == '1' ? 'Redeemed' : 'Redeem' }}
            </ion-button>
          </template>
        </Column>
      </DataTable>  
    </ion-content>
</ion-page>
</template>

<script setup>
import supabase from "@/services/supabase-client";
import { ref, onMounted } from 'vue';
import { useCheckCouponBalance } from '@/hooks/useCheckCouponBalance.js'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {scan} from 'ionicons/icons';
import dayjs from 'dayjs';
import ComSelectDateFilter from "@/views/components/public/ComSelectDateFilter.vue"
const t = window.t
const couponData = ref([]);
const allCoupons = ref([]);
const selectedCoupon = ref(null);
const startDate = ref(null);
const endDate = ref(null);

onMounted(async () => {
  const data = await useCheckCouponBalance();
  if (data) {
    couponData.value = data;
     allCoupons.value = data; 
  }
});

 
const redeem = async (coupon) => {
  // prevent redeeming again
  if (coupon.is_redeem === "1") {
    app.showSuccess("This coupon has already been redeemed.")
    return;
  }

   if (coupon.balance_amount <= 0) {
    app.showWarning("Cannot redeem. The coupon balance is 0.");
    return;
  }

  const confirm = await app.utils.onConfirm("Redeem Coupon", "Are you sure you want to Redeem this coupon code?");
  if (!confirm) {
    return; 
  }

  const { data, error } = await supabase
    .from("food_court_coupon_codes")
    .update({ is_redeem: "1" })
    // .eq("coupon_number", coupon.coupon_number)
       .gte("posting_date", startDate.value)
    .lte("posting_date", endDate.value)
    .order("posting_date", { ascending: false });;

  if (error) {
    app.showWarning("Failed to redeem coupon. Please try again.");
    return;
  }
  
  coupon.is_redeem = "1";
  app.showSuccess(`Coupon ${coupon.coupon_number} redeemed successfully`);
};


const onScanCoupon = (couponCode) => {
  if (!couponCode) return;
  const code = couponCode.trim();
  const found = couponData.value.find(c => c.coupon_number === code);

  if (!found) {
    app.showWarning(`Coupon "${code}" not found.`);
    return;
  }

  couponData.value = [found];
  app.showSuccess(`Found coupon: ${found.coupon_number}`);

  // Reset to full list after 3 seconds
  setTimeout(async () => {
    const data = await useCheckCouponBalance();
    couponData.value = data;
  }, 3000);
};

const onDateChange = (result) => {
  if (!result) {
    // if cleared
    couponData.value = allCoupons.value;
    return;
  }

  const { start_date, end_date } = result;
  startDate.value = start_date;
  endDate.value = end_date;

  couponData.value = allCoupons.value.filter((coupon) => {
    const date = dayjs(coupon.posting_date);
    return (
      date.isAfter(dayjs(start_date).subtract(1, "day")) &&
      date.isBefore(dayjs(end_date).add(1, "day"))
    );
  });
};
</script>