<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('Coupon Register') }} - {{ doc?.name }}</ion-title>
        <ion-chip color="success" @click="onSave" slot="end" class="mr-5">  
          <ion-label>{{ t("Save") }}</ion-label>
        </ion-chip>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="fix-container">
        <ion-card style="margin-top: 30px;">
          <ion-card-content>
            <com-input
              ref="inputRef"
              focus
              v-model="coupon"
              @change="onScanBarCode"
              :label="t('Coupon Code')"
              :placeholder="t('Please enter or scan qr code')"
              label-placement="stacked"
              fill="outline"
            />
            
            <div style="display: flex; justify-content: center; margin-top: 10px;">
              <ion-chip color="success" @click="onChangeScanMode('add')">
                <ion-icon v-if="scanMode == 'add'" :icon="checkmarkOutline"></ion-icon>
                <ion-label>{{ t("Scan to Add") }}</ion-label>
              </ion-chip>
              <ion-chip color="danger" @click="onChangeScanMode('remove')">
                <ion-icon v-if="scanMode == 'remove'" :icon="checkmarkOutline"></ion-icon>
                <ion-label>{{ t("Scan to Remove") }}</ion-label>
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>

        <div class="ion-padding" v-if="doc?.name">
          <DocList 
            ref="docListRef"
            docType="Coupon Codes"
            :options="options"
            :focus="false"
          >
        <template #coupon_status="{item}">
        
          <template v-if="item.coupon_status=='Saving...'">
          <ion-spinner name="dots"></ion-spinner>
                  {{ item.coupon_status }}
            </template>
          <template v-else-if ="item.coupon_status=='Done'">
                <ion-icon :icon="checkmarkCircle" color="success" size="large"/>
                  {{ t("Done") }}
            </template>
          <ComStatus :status="item.coupon_status" v-else />
          
<ion-label v-if="item.message" color="danger" >{{ item.message  }}</ion-label>
          
        </template>
        </DocList>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
 
import { ref, onMounted } from 'vue';

import dayjs from "dayjs";
import { checkboxOutline, checkmarkCircle, checkmarkOutline, closeOutline } from 'ionicons/icons';
import {handleErrorMessage} from "@/helpers/error-message.ts"
const doc = ref(null);
import PQueue from 'p-queue'

const queue = new PQueue({ concurrency: 1 })

const options = {
    columns:[
        {fieldname:"coupon",header:"Coupon #",url:"/coupon-detail",id_field:"name"},
        {fieldname:"coupon_status",header:"Status",},
     
 
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name"],
    orderBy:{
      field: "modified",
      order: "desc",
  },

  
}

const docListRef = ref(null)

const t = window.t;


const scanMode = ref("add")
const inputRef = ref(null)
const coupon = ref("")

function onChangeScanMode(mode) {
    scanMode.value = mode;
    inputRef.value.focus()
}

async function onScanBarCode() {
    if (scanMode.value == "add") {
        await addCoupon()
    } else {
        onRemoveCoupon()
    }
}
function onDelete(index) {
    coupounList.value.splice(index, 1)
    inputRef.value.select()
    coupon.value = "";
}
async function addCoupon() {
  

  if (coupon.value == "") {
        app.showWarning("Plese enter or scan coupon code")
    } 

      const coupon_data = {
      id:app.utils.generateRandomString(),
      coupon_register:doc.value.name,
      coupon:coupon.value,
      coupon_status:"Saving..."
  }
   docListRef.value.addRecord(coupon_data)

    queue.add(() => addCouponQueue(JSON.parse(JSON.stringify( coupon_data))))
     coupon.value = ""
    inputRef.value.focus()
}
 
async function addCouponQueue(coupon_data){
  setTimeout(async () => {
     delete coupon_data.coupon_status ;
    const res = await app.createDoc("Coupon Codes", coupon_data);
      if(res.data){
            docListRef.value.changeStatus(coupon_data.id, {coupon_status:"Done",name:res.data.name})
      }else {
        const messages =  await handleErrorMessage(res.error)
         docListRef.value.changeStatus(coupon_data.id,{ coupon_status:"Fail", message:(messages||[]).join(", ")})
      }
  }, 500);
 
}

function onRemoveCoupon() {
    const couponNumber = app.utils.getCouponNumber(coupon?.value);
    // find coupon index in coupon list

    const index = coupounList.value.findIndex(x => x.coupon == coupon.value);
    if (index == -1) {
        coupon.value = "";
        app.showWarning(t("coupon_code_number_does_not_exist", { coupon: couponNumber }))
    } else {
        onDelete(index);

    }
}
 
onMounted(async () => {
  const name = app.route.params.name;
  const result = await app.getDoc('Coupon Register', name);
  options.filters =[["coupon_register","=",result.data.name]]
  doc.value = result.data;
});
</script>
