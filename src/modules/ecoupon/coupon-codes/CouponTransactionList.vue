 
<template>
  <ion-page>
    <AppBar>{{ t("Coupon Transaction List") }}</AppBar>

    <ion-content ref="pageRef" :scrollEvents="true" @ionScroll="handleScroll">
 
      <DocList
        docType="Coupon Transaction"
        :options="options"
        v-model:selectedRow="selectedRow"
        @onRowDblClick="onRowDblClick"
        ref="docListRef"
      >
        <template #transaction_type="{ item }">
          <ComStatus :status="item.transaction_type" />
        </template>
        <template #posting_date="{ item }">
          <ion-label v-if="item.posting_date">
            {{ dayjs(item.posting_date).format("DD/MM/YYYY") }}
          </ion-label>
          <ion-label v-else></ion-label>
        </template>
        <template #actual_amount="{ item }">
          <ComCurrency :value="Math.abs(item.actual_amount)" />
        </template>
        <template #coupon_amount="{ item }">
          <ComCurrency :value="Math.abs(item.coupon_amount)" />
        </template>
      </DocList>

      <transition name="fade">
        <ion-fab v-if="showFab" vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="scrollToTop" color="primary">
            <ion-icon :icon="arrowUpOutline" />
          </ion-fab-button>
        </ion-fab>
      </transition>
    </ion-content>

    <ComFooter>
      <ion-button :disabled="!selectedRow" @click="goToDetail" style="width: 5rem">
        {{ t("View Detail") }}
      </ion-button>
    </ComFooter>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { arrowUpOutline } from 'ionicons/icons'
import { onIonViewDidEnter } from '@ionic/vue'

const docListRef = ref()
const pageRef = ref(null)
const selectedRow = ref()
const showFab = ref(false)
const t = window.t
const plateform = ref(app.utils.getPlateform())

const options = {
  columns: [
    { fieldname: "sale", header: "Sale #", url: "/sale-detail" },
    { fieldname: "coupon_number", header: "Coupon Number", url: "/coupon-detail", id_field: "coupon_code" },
    { fieldname: "customer_name", header: "Customer", url: "/customer-detail", id_field: "customer" },
    { fieldname: "posting_date", header: "Posting Date" },
    { fieldname: "pos_station", header: "POS Station" },
    { fieldname: "actual_amount", header: "Actual Amount", fieldtype: "Currency" },
    { fieldname: "coupon_amount", header: "Coupon Amount", fieldtype: "Currency" },
    { fieldname: "transaction_type", header: "Status" },
    { fieldname: "created_by", header: "Created By" },
    { fieldname: "creation", header: "Date", fieldtype: "Datetime" },
  ],
  showSearchBar: true,
  showBarcodeScanner: false,
  fields: ["name", "customer", "coupon_code"],
  orderBy: {
    field: "modified",
    order: "desc",
  },
  filters: [],
  filterOptions: [
    { fieldname: "transaction_type", fieldtype: "Select", label: t('Transaction Type'), clear: true, modal_type: plateform.value === 'mobile' ? 'sheet_modal' : 'modal', options: ['Sale Coupon', 'Top Up', 'Redeem', 'Use'] },
    { fieldname: "working_day", fieldtype: "Link", options: "Working Day", label: t("Working Day") },
    { fieldname: "cashier_shift", fieldtype: "Link", options: "Cashier Shift", label: t("Cashier Shift") },
    { fieldname: "pos_station", fieldtype: "Link", options: "POS Station", label: t("POS Station #") },
    { fieldname: "pos_profile", fieldtype: "Link", options: "POS Profile", label: t("POS Profile") },
    { fieldname: "posting_date", fieldtype: "Date", label: t("Date"), clear: true },
    { fieldname: "sale", fieldtype: "Link", options: "Sale", label: t("Sale #") },
    { fieldname: "customer", fieldtype: "Link", options: "Customer", label: t("Customer") },
  ]
}

function handleScroll(ev) {
  const scrollTop = ev.detail.scrollTop
  showFab.value = scrollTop > 200
}

function scrollToTop() {
  pageRef.value?.$el.scrollToTop(500)
}

function onRowDblClick(data) {
  app.ionRouter.navigate("/coupon-transaction-detail/" + data.name, "forward", "push", {
    state: { data }
  });
}

function goToDetail() {
  app.ionRouter.navigate("/coupon-transaction-detail/" + selectedRow.value.name, "forward", "push", {
    state: { data: JSON.parse(JSON.stringify(selectedRow.value)) }
  });
}

onIonViewDidEnter(async () => {
  if ((window.refresh_page || 0) === 1) {
    const l = await app.showLoading()
    await docListRef.value.onRefresh()
    window.history.replaceState({}, '', '/coupon-code-list')
    await l.dismiss()
    window.refresh_page = 0
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
