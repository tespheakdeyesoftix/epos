 
<template>
  <ion-page>
    <ToolBar>
      {{ t("Store Payment Detail") }} - {{ data?.name }}
    </ToolBar>
 <!-- {{ data }} -->
        <ion-content >
      <div class="fix-container ">
        <ion-card v-if="data" class="mt-6">
            <ion-card-header>
               <ion-item class="ion-no-padding" lines="none">
                    <ion-label><h1>{{ t("Sale #") }}: {{ data?.name }}</h1></ion-label>
                        <ComStatus :status="getStatusText(data?.docstatus)"/>
                </ion-item>
            </ion-card-header>
           
        <ion-card-content>
           <stack grap="20px">
            <stack row equal>           
                <ion-label><strong>{{ t("Vendor") }}</strong> : {{ data?.vendor }}</ion-label>
                <ion-label><strong>{{ t("Vendor Name") }}</strong> : {{ data?.vendor_name }}</ion-label>
            </stack>

             <stack row equal>
             <ion-label><strong>{{ t("Working Day") }}</strong> : {{ data?.working_day }}</ion-label>
             <ion-label><strong>{{ t("Cashier Shift") }}</strong> : {{ data?.cashier_shift }}  </ion-label>
           
            </stack>
            
            <stack row equal>
              <ion-label><strong>{{ t("Receive By") }}</strong> : {{ data?.receive_by }}</ion-label>
              <ion-label><strong>{{ t("Receive By Phone Number") }}</strong> : {{ data?.receive_by_phone_number }}</ion-label>
            
            </stack>
            <stack row equal>
                <ion-label><strong>{{ t("Payment Amount") }}</strong>:  <ComCurrency :value="data?.payment_amount"/></ion-label>
                <ion-label v-if="data.payments.find(p => p.exchange_rate !== 1)">
                <strong>{{ t('Exchange Rate') }}</strong>:
                  {{ data.payments.find(p => p.exchange_rate !== 1)?.exchange_rate }}
                </ion-label>
            </stack>
            <stack row equal>
                <ion-label><strong>{{ t("Payment By") }}</strong>:  <ComCurrency :value="data?.payment_amount"/></ion-label>
                <ion-label><strong>{{ t("Payment By") }}</strong>:  <ComCurrency :value="data?.payment_amount"/></ion-label>
                
            </stack>

           
           
            <stack row equal>
              <ion-label><strong>{{ t("Created By") }}</strong> : {{ data.owner.split("@")[0] }}</ion-label>
              <ion-label><strong>{{ t("Posting Date") }}</strong> : {{ data.posting_date ? dayjs(data.posting_date).format("DD/MM/YYYY") : '' }}</ion-label>
            </stack>
            <stack row equal>
              <ion-label><strong>{{ t("Modified") }}</strong> :  {{ data.modified ? dayjs(data.modified).format("DD/MM/YYYY") : '' }}</ion-label>
              <ion-label><strong>{{ t("Modified By") }}</strong> : {{ data.modified_by.split("@")[0] }}</ion-label>
            </stack>

            <stack row equal>
              <ion-label v-if="data?.note"><strong>{{ t("Note") }}</strong> : {{ data?.note }}</ion-label>
            </stack>
           
           
         </stack> 
          
        </ion-card-content>
      </ion-card>
      </div>
    </ion-content>
    <ComPaymentFooter :data="data"/>
  </ion-page>
  
</template>

<script setup>
 
import { ref, onMounted } from 'vue'
const t = window.t
import dayjs from 'dayjs'
import ComPaymentFooter  from '@/modules/ecoupon/store-payment/components/ComPaymentFooter.vue'


function getStatusText(id){
    return app.utils.getDocStatusText(id);
}
const data = ref(null)

async function loadData() {
  const l = await app.showLoading()

  if (!data.value) {
    const res = await app.getDoc("Store Payment", app.route.params.name)
    if (res.data) data.value = res.data
  }

  await l.dismiss()
}

onMounted(async () => {
  await loadData()
})
</script>
