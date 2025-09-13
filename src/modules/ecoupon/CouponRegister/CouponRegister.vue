<template>
  <ion-page>
 
    <ToolBar>
{{ t('Coupon Register') }} - {{ doc?.name }}
<template #end >
  <ion-chip color="success" @click="onSubmit" slot="end" class="mr-5" v-if="doc?.docstatus == 0">
      <ion-label>{{ t("Submit") }}</ion-label>
  </ion-chip>
</template>
    </ToolBar>

    <ion-content>
      <!-- {{ doc }} -->
      
      <div class="fix-container">
        <ion-card style="margin-top: 30px;" v-if="doc?.docstatus==0">
          <ion-card-content>
            <com-input v-if="plateform == 'mobile' || plateform == 'tablet'"
            ref="inputRef" 
            focus v-model="coupon"  
            @change="onScanBarCode"
            :label="t('Coupon Code')"
            :placeholder="t('Please enter or scan qr code')" 
            label-placement="stacked" fill="outline"
            :icon="scan"
            />
            
            <!-- plateform != 'mobile' -->
            <com-input v-else ref="inputRef" 
            focus v-model="coupon"
            @change="onScanBarCode"
            :label="t('Coupon Code')"
            :placeholder="t('Please enter or scan qr code')" 
            label-placement="stacked" fill="outline"
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
          <DocList ref="docListRef" docType="Coupon Codes" :options="options" :focus="false">
            <template #coupon_status="{ item }">
           
              <template v-if="item.coupon_status == 'Saving...' || item.coupon_status == 'Deleting...'">
                <ion-chip class="no-background">
                <ion-spinner name="dots"></ion-spinner>
                <ion-label style="font-size: 16px; margin-left: 10px;">{{ item.coupon_status }}</ion-label>               
                </ion-chip>
              </template>
              <template v-else-if="item.coupon_status == 'Done'">
                <ion-chip class="no-background">
                <ion-icon :icon="checkmarkCircle" color="success" size="large" />
                <ion-label style="font-size: 16px;">{{ t("Done") }} </ion-label>
                </ion-chip>
              </template>
              <template v-else-if="item.coupon_status == 'Delete'">
                <ion-chip class="no-background">
                <ion-icon :icon="close" color="danger" size="large" />
                <ion-label style="font-size: 16px;">{{ t("Delete") }}</ion-label>
                </ion-chip>
              </template>
              <ComStatus :status="item.coupon_status" v-else />
              <ion-label v-if="item.message" color="danger" class="ml-2">{{ item.message }} </ion-label>
            </template>
            <template #name="{ item }">
            <div style="display: flex; justify-content: center;" >
             <ion-icon
  :icon="close"
  color="danger"
  size="large"
  @click="onDeleteItem(item)"
  v-if="doc?.docstatus === 0 || item.coupon === item.name"
/>

            </div>
          </template>

          </DocList>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import {  checkmarkCircle, checkmarkOutline, close,scan} from 'ionicons/icons';

import PQueue from 'p-queue'
import { onIonViewDidLeave } from '@ionic/vue';
const plateform = ref(app.utils.getPlateform())
const doc = ref(null);
const queue = new PQueue({ concurrency: 1 })
const options = {
  columns: [
    { fieldname: "coupon", header: "Coupon #", url: "/coupon-detail", id_field: "name" },
    { fieldname: "coupon_status", header: "Status", },
    { fieldname: "name", header: "", },
  ],
  showSearchBar: true,
  showBarcodeScanner: false,
  fields: ["name"],
  orderBy: {
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
    await onRemoveCoupon(coupon.value)
    coupon.value = ""
  }
}

async function addCoupon() {

  if (coupon.value == "") {
    app.showWarning("Plese enter or scan coupon code")
    return;
  }

  coupon.value = app.utils.getCouponNumber(coupon.value)
  if (coupon.value == "") {
    app.showWarning("Invalid coupon code.")
    return;
  }
   
  const coupon_data = {
    id: app.utils.generateRandomString(),
    coupon_register: doc.value.name,
    coupon: coupon.value,
    coupon_url: coupon.value.split("?c=")[0] ,
    coupon_status: "Saving..."
  }
  docListRef.value.addRecord(coupon_data)
  queue.add(() => addCouponQueue(JSON.parse(JSON.stringify(coupon_data))))
  coupon.value = ""
  inputRef.value.focus()
}

async function addCouponQueue(coupon_data) {
  setTimeout(async () => {
    delete coupon_data.coupon_status;
    const res = await app.createDoc("Coupon Codes", coupon_data);
    if (res.data) {
      docListRef.value.changeStatus(coupon_data.id, { coupon_status: "Done", name: res.data.name })
    } else {
      
      docListRef.value.changeStatus(coupon_data.id, { coupon_status: "Fail", message: (res.error || []).join(", ") })
    }
  }, 2000);

}

async function onRemoveCoupon() {

  if (!coupon.value) {
    app.showWarning("Please enter or scan coupon code");
    return;
  }


const coupon_data = {
    id: app.utils.generateRandomString(),
    coupon_register: doc.value.name,
    coupon: coupon.value,
    coupon_status: "Deleting..."
  }
  const coupon_id = docListRef.value.addRecord(coupon_data)
  queue.add(() => deleteCouponQueueJob( JSON.parse(JSON.stringify( {name:coupon_id, coupon:coupon.value,id:coupon_data.id}))))
   coupon.value = ""
  inputRef.value.focus()
}

function deleteCouponQueueJob(coupon_data) {

  setTimeout(async () => {
    if (!coupon_data.name){
          const find_coupon_res = await app.getDocList("Coupon Codes", {
            fields: ["name"],
            filters: [
              ["coupon", "=", coupon_data.coupon],
              ["coupon_status", "in", ["Unused","Used"]],
              ["coupon_register", "=", doc.value.name], 
            ],
          });
       if(find_coupon_res.data && find_coupon_res.data.length>0){
          coupon_data.name = find_coupon_res.data[0].name
       }

    }

    // check dont have coupon primary key
     if(!coupon_data.name){
        docListRef.value.changeStatus(coupon_data.id, { coupon_status: "Delete fail", message:"This coupon code not exist in the system" })  
        return ;
     }

    if(coupon_data.name){
        const res = await app.deleteDoc("Coupon Codes", coupon_data.name);
        if(res.data){
            docListRef.value.changeStatus(coupon_data.id, { coupon_status: "Deleted" })  
        }else {
          
          docListRef.value.changeStatus(coupon_data.id, { coupon_status: "Delete fail",message:(res.error || []).join(", ") })  
        }
    }
    
  
  }, 1000);

}

async function onDeleteItem(item) {
  const confirm = await app.utils.onConfirmDanger("Delete Coupon", "Are you sure you want to delete this coupon code?");
  if (!confirm) return;

  const res = await app.deleteDoc("Coupon Codes", item.name);
  if (res.data) {
    docListRef.value.removeRecord(item.name); // remove from frontend list
    app.showSuccess("Coupon deleted successfully");
  } else {
    app.showError("Failed to delete coupon");
  }
}




async function onSubmit() {
  const confirm = await app.onConfirm("Submit", "Are you sure you want to submit this document?");
  if (!confirm) return;
  const l = await app.showLoading()
  const res = await app.submitDoc(doc.value);
  if (res.data) {
    app.showSuccess("Document submitted successfully");
   getDoc()
  } 
  await l.dismiss();
}

async function getDoc(){
const name = app.route.params.name;
  const result = await app.getDoc('Coupon Register', name);
  options.filters = [["coupon_register", "=", result.data.name]]
  doc.value = result.data;
}

onMounted(async () => {
  window.disable_scan_check_coupon = true;
  const l = await app.showLoading();
  await getDoc();
  await l.dismiss();
});
onIonViewDidLeave(()=>{
  window.disable_scan_check_coupon = false;
})
</script>
<style scoped>
.no-background {
  --background: transparent;
  --color: inherit;
  --box-shadow: none;
  border: none;
}

</style>