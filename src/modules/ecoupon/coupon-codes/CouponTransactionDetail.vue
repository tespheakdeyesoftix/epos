 
<template>
  <ion-page>
    <ToolBar>
      {{ t("Transaction Detail") }} - {{ data?.coupon_number }}
    </ToolBar>

    <!-- {{ data }} -->
         <ion-content>
      <div class="fix-container">
        <ion-card v-if="data">
            <ion-card-header>
                <ion-item class="ion-no-padding" lines="none">
                    <ion-label><h1>{{ t("Coupon #") }}: {{ data?.coupon_number }}</h1></ion-label>
                    <ComStatus :status="data?.transaction_type "></ComStatus>
                </ion-item>
            </ion-card-header>
           
        <ion-card-content>
           
         <stack grap="20px">
            <stack row equal>
                <ion-label>
                <strong>{{ t("Customer") }}</strong>:
                <router-link :to="'/customer-detail/' + data?.customer">
                    {{ data?.customer }} - {{ data?.customer_name }}
                </router-link>
                </ion-label>
                <ion-label><strong>{{ t("Coupon Code") }}</strong> : {{ data.coupon_code }}</ion-label>
            </stack>
            <stack row equal>
            <ion-label><strong>{{ t("Amount") }}</strong>: <ComCurrency :value="Math.abs(data.coupon_amount)" /></ion-label>
             <ion-label><strong>{{ t("Actual Amount") }}</strong> :  <ComCurrency :value="Math.abs(data.actual_amount)" /></ion-label>
           
            </stack>
            <stack row equal>
             <ion-label><strong>{{ t("POS Station") }}</strong> : {{ data.pos_station }}</ion-label>
            <ion-label><strong>{{ t("Status") }}</strong> : {{ data.status }}</ion-label>
            </stack>
            <stack row equal>
           
             <ion-label><strong>{{ t("Modified") }}</strong> : {{ dayjs(data.modified).format("DD/MM/YYYY") }}</ion-label>
              <ion-label><strong>{{ t("Posting Date") }}</strong> : {{ data.posting_date ? dayjs(data.posting_date).format("DD/MM/YYYY") : '' }}</ion-label>
            </stack>
            <stack row equal>
              <ion-label><strong>{{ t("Created By") }}</strong> : {{ data.owner.split("@")[0] }} {{ dayjs(data.creation).fromNow() }}</ion-label>
            </stack>
           
           
         </stack> 
        </ion-card-content>
      </ion-card>
      </div>
    
    </ion-content>  
   
  </ion-page>
</template>

<script setup>

import { ref, onMounted } from 'vue'
const t = window.t
import dayjs from 'dayjs'

const data = ref(null)

async function loadData() {
  const l = await app.showLoading()

  if (!data.value) {
    const res = await app.getDoc("Coupon Transaction", app.route.params.name)
    if (res.data) data.value = res.data
  }

  await l.dismiss()
}

onMounted(async () => {
  await loadData()
})
</script>
