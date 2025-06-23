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
        <div style="text-align: center;">{{ data?.name}} - {{ data?.customer_name_en}}</div>

       <stack row equal>
        <ion-card button>
          <ion-card-content>
            <ion-card-subtitle>
                {{ data?.total_visited_count}}
              </ion-card-subtitle>
              <ion-card-subtitle>
                  {{t("Total Visit")}}
              </ion-card-subtitle>
          </ion-card-content>
        </ion-card>
        <ion-card button>
          <ion-card-content>
            <ion-card-subtitle slot="end"><ComCurrency :value="data?.voucher_actual_amount"/> </ion-card-subtitle>
              <ion-card-subtitle>
                  {{t("Total Annual order")}}
              </ion-card-subtitle>
          </ion-card-content>
        </ion-card>
        <ion-card button>
          <ion-card-content>
             
                <ion-card-subtitle slot="end"><ComCurrency :value="data?.total_coupon_amount"/> </ion-card-subtitle>
                 <ion-card-subtitle>
                  {{t("Total Order")}}
                  </ion-card-subtitle>
           
          </ion-card-content>
        </ion-card>
        
       </stack>
 
        <ion-segment>
    <ion-segment-button value="About" content-id="About">
      <ion-label>About</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Recent Order" content-id="Recent Order">
      <ion-label>Recent Order</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Print" content-id="Print">
      <ion-label>Print</ion-label>
    </ion-segment-button>
  </ion-segment>
  <ion-segment-view>
    <ion-segment-content id="About">
       <ion-grid>
    <ion-row>
      <ion-col size="6">
        <div>{{ data?.customer_group }}</div>
        <div color="primary" class="mt-1"><ion-text>Guest Type</ion-text></div>
      </ion-col>
      <ion-col size="6">
        <strong>Phone Number</strong> {{ data?.phone_number || data?.phone_number_2 || 'null' }}
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="6">
        <div>{{ data?.gender}}</div>
        <div>Gender</div> 
      </ion-col>
      <ion-col size="6">
        <strong>Country</strong> {{ data?.country}}
      </ion-col>
    </ion-row>
    
  </ion-grid>
    </ion-segment-content>
    <ion-segment-content id="Recent Order">Recent Order</ion-segment-content>
    <ion-segment-content id="Print">Print</ion-segment-content>
  </ion-segment-view>

        
        
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
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