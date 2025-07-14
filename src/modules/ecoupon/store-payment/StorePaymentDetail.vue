 
<template>
  <ion-page>
    <ToolBar>
      {{ t("Store Payment Detail") }} - {{ data?.name }}
    </ToolBar>
 {{ data }}
        <ion-content>
      <div class="fix-container">
        <ion-card v-if="data">
            <ion-card-header>
               <ion-item class="ion-no-padding" lines="none">
                    <ion-label><h1>{{ t("Sale #") }}: {{ data?.name }}</h1></ion-label>
                    <ComStatus :status="data?.transaction_type "></ComStatus>
                </ion-item>
            </ion-card-header>
           
        <ion-card-content>
           <stack grap="20px">
            <stack row equal>
                
                <ion-label><strong>{{ t("POS Profile") }}</strong> : {{ data?.pos_profile }}</ion-label>    
                <ion-label><strong>{{ t("Vendor") }}</strong> : {{ data?.vendor }}</ion-label>
            </stack>
            <stack row equal>
            <ion-label><strong>{{ t("Payment Amount") }}</strong>:  <ComCurrency :value="data?.payment_amount"/></ion-label>
             <ion-label><strong>{{ t("Cashier Shift") }}</strong> : {{ data?.cashier_shift }}  </ion-label>
           
            </stack>
           
            <stack row equal>
           
             <ion-label><strong>{{ t("Modified") }}</strong> :  {{ data.modified ? dayjs(data.modified).format("DD/MM/YYYY") : '' }}</ion-label>
              <ion-label><strong>{{ t("Posting Date") }}</strong> : {{ data.posting_date ? dayjs(data.posting_date).format("DD/MM/YYYY") : '' }}</ion-label>
            </stack>
            <stack row equal>
              <ion-label><strong>{{ t("Created By") }}</strong> : {{ data.owner.split("@")[0] }}</ion-label>
              <ion-label><strong>{{ t("Working Day") }}</strong> : {{ data?.working_day }}</ion-label>
            </stack>
            <stack row equal>
              <ion-label><strong>{{ t("payment Type") }}</strong> : {{ data.payment_types }}</ion-label>
              <!-- <ion-label><strong>{{ t("Payment Input") }}</strong> : {{ data?.payments }}</ion-label> -->
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
    const res = await app.getDoc("Store Payment", app.route.params.name)
    if (res.data) data.value = res.data
  }

  await l.dismiss()
}

onMounted(async () => {
  await loadData()
})
</script>
