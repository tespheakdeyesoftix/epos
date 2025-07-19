<template>
  <ion-page>
    <ToolBar>
      <span class="ion-hide-sm-up">
          {{ data?.name }}
      </span>
      <span class="ion-hide-sm-down">
          {{ t("Store Payment Detail") }} - {{ data?.name }}
      </span>

    </ToolBar>
 
    <ion-content>
      <div class="fix-container">
        <ion-card v-if="data" class="mt-6">
          <ion-card-header>
            <ion-item class="ion-no-padding" lines="none">
              <ion-label>
                <h1>{{ t("Sale #") }}: {{ data.name }}</h1>
              </ion-label>
              <ComStatus :status="getStatusText(data.docstatus)" />
            </ion-item>
          </ion-card-header>

          <ion-card-content>
            <stack grap="20px">
              <stack row equal>
                <ion-label><strong>{{ t("Vendor") }}</strong> : {{ data.vendor }}</ion-label>
                <ion-label><strong>{{ t("Vendor Name") }}</strong> : {{ data.vendor_name }}</ion-label>
              </stack>

              <stack row equal>
                <ion-label><strong>{{ t("Working Day") }}</strong> : {{ data.working_day }}</ion-label>
                <ion-label><strong>{{ t("Cashier Shift") }}</strong> : {{ data.cashier_shift }}</ion-label>
              </stack>

              <stack row equal>
                <ion-label><strong>{{ t("Receive By") }}</strong> : {{ data.receive_by }}</ion-label>
                <ion-label><strong>{{ t("Receive By Phone Number") }}</strong> : {{ data.receive_by_phone_number }}</ion-label>
              </stack>

              <stack row equal>
                <ion-label>
                  <strong>{{ t("Payment Amount") }}</strong>:
                  <ComCurrency :value="data.payment_amount" />
                </ion-label>
                <ion-label v-if="data.payments.find(p => p.exchange_rate !== 1)">
                  <strong>{{ t("Exchange Rate") }}</strong>:
                  {{ data.payments.find(p => p.exchange_rate !== 1)?.exchange_rate }}
                  {{ getCurrencySymbol(data.payments.find(p => p.exchange_rate !== 1)?.payment_type) }}
                </ion-label>
              </stack>

 
        
<ion-row class="payment-header">
  <ion-col size="6" class="p-0">{{ t("Payment Method") }}</ion-col>
  <ion-col size="6" class="p-0">{{ t("Input Amount") }}</ion-col>
</ion-row>
 
<ion-row
  v-for="(payment, index) in data.payments"
  :key="index"
  class="payment-row"
>
  <ion-col size="6" class="p-0">{{ payment.payment_type }}</ion-col>
  <ion-col size="6" class="p-1">
    <ComCurrency
      :value="payment.input_amount"
      :currency="getCurrency(payment.payment_type)"
    />
  </ion-col>
</ion-row>


              <stack row equal>
                <ion-label><strong>{{ t("Created By") }}</strong> : {{ data.owner.split("@")[0] }}</ion-label>
                <ion-label><strong>{{ t("Posting Date") }}</strong> : {{ data.posting_date ? dayjs(data.posting_date).format("DD/MM/YYYY") : '' }}</ion-label>
              </stack>

              <stack row equal>
                <ion-label><strong>{{ t("Modified") }}</strong> : {{ data.modified ? dayjs(data.modified).format("DD/MM/YYYY") : '' }}</ion-label>
                <ion-label><strong>{{ t("Modified By") }}</strong> : {{ data.modified_by.split("@")[0] }}</ion-label>
              </stack>

              <stack row equal>
                <ion-label v-if="data.note"><strong>{{ t("Note") }}</strong> : {{ data.note }}</ion-label>
              </stack>
            </stack>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <div style="display: flex; justify-content: center; gap: 10px;">
          <ion-button @click="onClose" color="danger">{{ t('Close') }}</ion-button>
          <ion-button color="success" @click="onEdit">{{ t('Edit') }}</ion-button>
          <ion-button color="danger" @click="onDelete">{{ t('Delete') }}</ion-button>
          <ion-button @click="onPrint">{{ t('Print') }}</ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

import ComAddPayment from "@/modules/ecoupon/store-payment/ComAddPayment.vue"

const t = window.t

const data = ref(null)
const docListRef = ref(null)


async function onPrint(){
    const printer_name = await app.storageService.getItem("default_printer") || ""
   app.printing.onPrint({doctype:"Store Payment",docname:data.value.name, template:"Store Payment Receipt",printer_name:printer_name,show_loading:true})
   
}
function getStatusText(id) {
  return app.utils.getDocStatusText(id);
}


function getCurrency(paymentType) {
  const type = (paymentType || '').toLowerCase();
  if (type.includes('riel')) return 'KHR';
  return 'USD';
}
function getCurrencySymbol(paymentType) {
  const type = (paymentType || '').toLowerCase();
  if (type.includes('riel')) return '៛'; // KHR
  return '$'; // USD
}


async function loadData() {
  const l = await app.showLoading()

  const res = await app.getDoc("Store Payment", app.route.params.name)
  if (res.data) data.value = res.data

  await l.dismiss()
}

function onClose() {
  app.router.back()
}

async function onEdit() {
  const modal = await app.openModal({
    component: ComAddPayment,
    componentProps: {
      docname: data.value?.name,
      docListRef: docListRef
    },
    cssClass: "store-payment-modal"
  })

  

  // Refresh only data, not the whole page
  await loadData()
}



async function onDelete() {
  const confirm = await app.utils.onConfirm(
    "Delete Store Payment",
    "Are you sure you want to delete this Store Payment?",
    { background: "danger" }
  )
  if (!confirm) return

  const l = await app.showLoading()
  const res = await app.deleteDoc("Store Payment", data.value.name)


  if (res.data) {   
    app.showSuccess("Delete record successfully")
    if(window.history.length<=1){
        app.router.back()
    }else {  
        app.ionRouter.navigate(window.fromRoute, "forward","replace")
    }
    window.reloadData = true
  }
  // if (res.data) {
  //   app.ionRouter.navigate("/store-payment-list", "back", "replace")
  // }

  await l.dismiss()
}

onMounted(async () => {
  await loadData()
})
</script>

 
<style scoped>
.payment-header {
  font-weight: bold;
  padding: 0;
  margin: 0;
}

.payment-row {
  padding: 0;
  margin: 0;
}
</style>
