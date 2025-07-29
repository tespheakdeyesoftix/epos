<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('Coupon Register') }} - {{ doc?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
    
    <div class="fix-container">
        <ion-card style="margin-top: 30px;">
    
  <ion-card-content>
    <com-input ref="inputRef" focus v-model="coupon" @change="onScanBarCode" :label="t('Coupon Code')"
            :placeholder="t('Please scan coupon code')" label-placement="stacked" fill="outline">
        </com-input>
        <div style="display: flex;justify-content: center; margin-top: 10px;">
            <ion-chip color="success" @click="onChangeScanMode('add')">
                <ion-icon v-if="scanMode == 'add'" :icon="checkmarkOutline"></ion-icon>
                <ion-label>{{ t("Scan to Add") }}</ion-label>
            </ion-chip>
            <ion-chip color="danger" @click="onChangeScanMode('remove')">
                <ion-icon :icon="checkmarkOutline" v-if="scanMode == 'remove'"></ion-icon>
                <ion-label>{{ t("Scan to Remove") }}</ion-label>
            </ion-chip>
        </div>
        

        

  </ion-card-content>
</ion-card>

<div class="ion-padding" v-if="coupounList.length > 0">
    <DataTable :value="coupounList" responsiveLayout="scroll" stripedRows>
  <Column header="No" bodyStyle="width: 50px">
    <template #body="slotProps">
      {{ slotProps.index + 1 }}
    </template>
  </Column>
  <Column></Column>
  <Column field="coupon" header="Coupon Code"></Column>
  
  <Column header="Actions">
    <template #body="slotProps">
      <ion-button fill="clear" color="danger" @click="onDelete(slotProps.index)">
        <ion-icon :icon="closeOutline"></ion-icon>
      </ion-button>
    </template>
  </Column>
</DataTable>
</div>
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
 
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from "dayjs";
import { checkboxOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
const { saleDoc } = useSaleCoupon()
const route = useRoute();
const t = window.t;
const doc = ref(null);

const scanMode = ref("add")
const inputRef = ref(null)
const coupon = ref("")
const coupounList = ref([])
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
    const data = await validateCouponCode(app.utils.getCouponNumber(coupon?.value))
    if (!data) {
        coupon.value = ""
        inputRef.value.focus()
        return;
    }
    // check 
    // check exists
  
    coupounList.value.push({
        name:data.name,
        coupon: data.coupon,
        creation: dayjs()
    })

    coupon.value = ""


    inputRef.value.focus()
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
async function validateCouponCode(c) {

    if (c == "") {
        app.showWarning("Plese enter or scan coupon code")
    }

    // check if exist in list 
    if (coupounList.value.filter(x => x.coupon.toLowerCase() == c.toLowerCase()).length > 0) {
        app.showWarning("This coupon code is already selected")
        return false
    }
    
    // if exist in sale product
    if (saleDoc.value.sale_products.filter(r=>!r.is_editing).flatMap(sp => sp.coupons).filter(x => x.coupon.toLowerCase() == c.toLowerCase()).length > 0) {
        app.showWarning("This coupon code is already selected")
        return false
    }

    // validate in existing in db
    const l = await app.showLoading("Checking coupon code...")
    const res = await app.getApi("epos_restaurant_2023.selling.doctype.coupon_codes.coupon_codes.check_coupon_code", { coupon: c })
    if(res.error){
         await l.dismiss();
         return false
    }
     
  
    await l.dismiss();
    return res.data
}
onMounted(async () => {
  const name = route.params.name;
  const result = await app.getDoc('Coupon Register', name);
  doc.value = result.data;
});
</script>
