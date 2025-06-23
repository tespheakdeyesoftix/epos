<template>
   
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t("Customer Detail") }} - {{ data?.name}}</ion-title>
       
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <img src="https://ionicframework.com/docs/img/demos/card-media.png" style="width: 100%; height: 200px;" />
       <ion-avatar class="custom-avatar">
            <Img v-if="data?.photo" :src="data?.photo"/>
            <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.customer_name_en) }}</div>
        </ion-avatar> 
        <div class="mt-2 text-center" style="font-size: 20px;">{{ data?.name}} - {{ data?.customer_name_en}}</div>

       <stack row equal>
        <ion-card button color="primary" @click="onViewTotalVisit">
          <ion-card-content class="text-center">
            <ion-card-subtitle style="font-size: 18px;">
                {{ data?.total_visited_count}}
              </ion-card-subtitle>
              <ion-card-subtitle class="mt-2" style="font-size: 18px;">
                  {{t("Total Visit")}}
              </ion-card-subtitle>
          </ion-card-content >
        </ion-card>
        <ion-card button color="warning" @click="onViewTotalAnnalOrder">
          <ion-card-content class="text-center">
            <ion-card-subtitle slot="end" style="font-size: 18px;"><ComCurrency :value="data?.voucher_actual_amount"/> </ion-card-subtitle>
              <ion-card-subtitle  class="mt-2" style="font-size: 18px;">
                  {{t("Total Annual order")}}
              </ion-card-subtitle>
          </ion-card-content>
        </ion-card>
        <ion-card button color="success" @click="onViewTotalOrder">
          <ion-card-content class="text-center">
             
                <ion-card-subtitle slot="end" style="font-size: 18px;"><ComCurrency :value="data?.total_coupon_amount"/> </ion-card-subtitle>
                 <ion-card-subtitle  class="mt-2" style="font-size: 18px;">
                  {{t("Total Order")}}
                  </ion-card-subtitle>
           
          </ion-card-content>
        </ion-card>
        
       </stack>
        <ComSegment/>  
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import ComSegment from "@/views/customer/components/ComSegment.vue"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonText } from '@ionic/vue';
import { imageUrl, getAvatarLetter } from "@/helpers/utils"
const data = ref()
 
async function loadData() {
    const l = await app.showLoading()
    let res = await app.getDoc("Customer", app.route.params.name)
    if (res.data) {
        data.value = res.data
        
    }

   

    await l.dismiss();

}
const t = window.t;
onMounted(async () => {

    await loadData()
})
   
async function onViewTotalVisit(){
    const result = await app.utils.onViewTotalVisit();
    if(result){
      saleDoc.value.customer = result.name;
      await getCustomer(result.name)
    }
}
async function onViewTotalAnnalOrder(){
    const result = await app.utils.onViewTotalAnnalOrder();
    if(result){
      saleDoc.value.customer = result.name;
      await getCustomer(result.name)
    }
}
async function onViewTotalOrder(){
    const result = await app.utils.onViewTotalOrder();
    if(result){
      saleDoc.value.customer = result.name;
      await getCustomer(result.name)
    }
}

</script>

<style scoped>
ion-item {
  --background: transparent;
}
.custom-avatar {
  margin-top: -100px !important; /* Use !important to override Ionic styles */
  width: 200px;
  height: 200px;
  margin: 10px auto;
  display: block;
  position: relative;
} 

 ion-segment-view {
    height: 150px;
  }

  ion-segment-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
</style>