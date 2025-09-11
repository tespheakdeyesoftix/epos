<template>
    <BaseModal :title="data?.name + '-' + data.product_name_en" :hideFooter="false" @onConfirm="onConfirm">

        <stack row equal class="mb-4" itemClass="col-6 sm:col-6 lg:col-3 p-2 "
            v-if="data.is_open_product == 1 && plateform != 'mobile'">
            <com-input ref="txtPrice" :label="t('Price')" v-model="doc.price" type="number" keyboard />
            <ion-select v-model="doc.coupon_markup_type" label-placement="floating" fill="outline"
                aria-label="Markup Type" interface="popover" :placeholder="t('Markup Type')">
                <ion-select-option value="Percent">Percent</ion-select-option>
                <ion-select-option value="Amount">Amount</ion-select-option>
            </ion-select>

            <com-input :disabled="doc.coupon_markup_type == 'Amount'" :label="t('Markup Percent')"
                v-model="doc.coupon_markup_value" type="number" keyboard />

            <ion-input readonly v-if="doc.coupon_markup_type == 'Percent'" :label="t('Coupon Value')"
                label-placement="floating" fill="outline" :value="couponValue"></ion-input>
            <com-input v-else :label="t('Coupon Value')" v-model="doc.coupon_value" type="number" keyboard />
        </stack>
        <!-- scan barcode -->
        <!-- v-if="plateform != 'mobile'"  -->

        <div v-if="plateform != 'mobile'">
            <com-input ref="inputRef" focus v-model="coupon" @change="onScanBarCode" :label="t('Coupon Code')"
             
                :placeholder="t('Please scan coupon codes')" label-placement="stacked" fill="outline" >
            
      


            </com-input>
            <div style="display: flex;justify-content: center;">
                <ion-chip color="success" @click="onChangeScanMode('add')">
                    <ion-icon v-if="scanMode == 'add'" :icon="checkmarkOutline"></ion-icon>
                    <ion-label>{{ t("Scan to Add") }}</ion-label>
                </ion-chip>
                <ion-chip color="danger" @click="onChangeScanMode('remove')">
                    <ion-icon :icon="checkmarkOutline" v-if="scanMode == 'remove'"></ion-icon>
                    <ion-label>{{ t("Scan to Remove") }}</ion-label>
                </ion-chip>
            </div>
        </div>

        <div v-if="isMobile" class="ion-text-center">
            <ion-button @click="onScanWithCamera" class="w-full">{{ t("Scan Coupon Code") }}</ion-button>
        </div>


        <ion-list v-if="sortedCouponList.length > 0">
            <ion-item button v-for="(c, index) in sortedCouponList" :key="index">
                <ion-label>{{ c.coupon }}</ion-label>
                <ComCurrency :value="data.is_open_product ? doc.price : data.price" slot="end" />
                <ion-button @click="onDelete(index)" slot="end" size="large" fill="clear" shape="round" color="danger">
                    <ion-icon :icon="closeOutline"></ion-icon>
                </ion-button>
            </ion-item>
        </ion-list>
        <template v-else>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-align-items-center" style="height: 100%;">
                    <ion-col size="12" class="ion-text-center">
                        <ion-text>{{ t("Please enter or scan qr code") }}</ion-text>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </template>

        <!-- keypad for enter amount on mobile only -->
        <template v-if="plateform == 'mobile' && data.is_open_product == 1">
            <div style=" display: flex;justify-content: center;gap: 10px;">
                <ion-chip :color="selectedCurrency == 'KHR' ? 'primary' : ''" @click="onChangeInputCurrency('KHR')">{{
                    t("KHR") }}</ion-chip>
                <ion-chip :color="selectedCurrency == 'USD' ? 'primary' : ''" @click="onChangeInputCurrency('USD')">{{
                    t("USD") }}</ion-chip>
            </div>
            <ComKeyPadInput v-model="doc.price" />
        </template>


        <template #footer>
            <div class="ion-padding">
                <ion-grid class="ion-no-padding">
                    <ion-row>
                        <ion-col size="9">
                            <ion-label>{{ t("Total Coupon:") }} <strong>{{ coupounList.length }}</strong></ion-label> /
                            &nbsp;<ion-label>{{ t("Total Amount:") }} <strong>
                                    <ComCurrency
                                        :value="coupounList.length * (data.is_open_product ? doc.price : data.price)" />
                                </strong></ion-label>
                        </ion-col>
                        <ion-col size="3" class="ion-no-padding" v-if="plateform == 'mobile'">
                            <ion-button color="success" @click="onConfirm(true)" class="w-full h-full">{{ t("Payment")
                                }}</ion-button>
                        </ion-col>

                    </ion-row>
                </ion-grid>
            </div>
        </template>
        <template #footer v-if="plateform == 'mobile'">
            <div class="ion-padding">
                <ion-grid class="ion-no-padding">
                    <ion-row>
                        <ion-col size="9">
                            <div>
                                <ion-label>
                                    {{ t("Total Coupon:") }}
                                    <strong>{{ coupounList.length }}</strong>
                                </ion-label>
                            </div>
                            <div>
                                <ion-label>
                                    {{ t("Total Amount:") }}
                                    <strong>
                                        <ComCurrency :value="totalAmount" />
                                    </strong>
                                </ion-label>
                            </div>
                        </ion-col>

                        <ion-col size="3">
                            <ion-button color="success" @click="onConfirm(true)" class="w-full">{{ t("Payment")
                                }}</ion-button>
                        </ion-col>

                    </ion-row>
                </ion-grid>
            </div>
        </template>

    </BaseModal>

</template>
<script setup>
import { modalController } from "@ionic/vue"
import dayjs from "dayjs";
import { checkboxOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComKeyPadInput from "@/views/components/public/ComKeyPadInput.vue"
const { saleDoc } = useSaleCoupon()
const inputRef = ref(null)
const txtPrice = ref(null)
const plateform = ref(app.utils.getPlateform())
const isMobile = ref(app.utils.isMobile())
const props = defineProps({
    data: Object,
})
const t = window.t;
const coupon = ref("")
const coupounList = ref([])
const keyword = ref("")
const scanMode = ref("add")
const selectedCurrency = ref("KHR")
const exchange_rate = ref(app.setting.exchange_rate);
const doc = ref({
    price: 0,
    coupon_value: 0,
    coupon_markup_type: "Percent",
    coupon_markup_value: 0
})

const minAmountKHR = ref(500)
const maxAmountKHR = ref(100000)
const minAmountUSD = ref(1)
const maxAmountUSD = ref(100)


const buffer = ref("");
const lastScanned = ref("");
let lastTime = 0;


const couponValue = computed(() => {
    if (doc.value.coupon_markup_type == 'Percent') {
        return (doc.value.price ?? 0) + ((doc.value.price ?? 0) * ((doc.value.coupon_markup_value ?? 0) / 100))
    } else {
        return doc.value.coupon_value;
    }
})

const totalAmount = computed(()=>{
    let price = coupounList.value.length * ( props.data.is_open_product ? doc.value.price : props.data.price);
     if(app.setting.currency != selectedCurrency.value){
        price = price / exchange_rate.value;
    }
    return price
})

const sortedCouponList = computed(() => {
    if (keyword.value) {
        return coupounList.value.filter(x => x.coupon.toLowerCase().includes(keyword.value.toLowerCase())).sort((a, b) => new Date(b.creation) - new Date(a.creation));
    } else {
        return coupounList.value.sort((a, b) => new Date(b.creation) - new Date(a.creation));
    }
})

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

async function onScanWithCamera() {
    const result = await app.utils.onScanBarcode();
    if (result) {
        coupon.value = result
        await onScanBarCode()

    }

}


async function addCoupon() {
    
    const data = await validateCouponCode(app.utils.getCouponNumber(coupon.value))
    if (!data) {
        coupon.value = ""
        inputRef.value.focus()
        return;
    }
    // check 
    // check exists

    coupounList.value.push({
        name: data.name,
        coupon: data.coupon,
        creation: dayjs()
    })

    coupon.value = ""

    if(!app.utils.isMobile()){

    
    inputRef.value.focus()
    }
}

function onRemoveCoupon() {
    const couponNumber = app.utils.getCouponNumber(coupon.value);
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
    if (saleDoc.value.sale_products.filter(r => !r.is_editing).flatMap(sp => sp.coupons).filter(x => x.coupon.toLowerCase() == c.toLowerCase()).length > 0) {
        app.showWarning("This coupon code is already selected")
        return false
    }

    // validate in existing in db
    const l = await app.showLoading("Checking coupon code...")
    const res = await app.getApi("epos_restaurant_2023.selling.doctype.coupon_codes.coupon_codes.check_coupon_code", { coupon: c })
    if (res.error) {
        await l.dismiss();
        return false
    }
    await l.dismiss();
    return res.data
}

function onDelete(index) {
    coupounList.value.splice(index, 1)
    inputRef.value.select()
    coupon.value = "";
}

function onChangeInputCurrency(currency){
    selectedCurrency.value = currency;
    
}

function onConfirm(process_payment = false) {
    
    if (coupounList.value.length == 0) {
        app.showWarning("Please enter coupon code")
        inputRef.value.select()
        return
    }
    if (props.data.is_open_product == 1 && Number(doc.value.price == 0)) {
        app.showWarning("Please enter price")
        txtPrice.value.select()

        return;
    }
    if (props.data.is_open_product == 1 && Number(couponValue.value == 0)) {
        app.showWarning("Please enter coupon value")
        return;
    }

    let price =  props.data.is_open_product == 1 ? doc.value.price : props.data.price;
    
    // validate max and min input amount to prevent wrong posting data
    if (props.data.is_open_product == 1){
       if(selectedCurrency.value =="KHR"){
            if(price<minAmountKHR.value){
                app.showWarning("Coupon amount must be greater than" + " " + minAmountKHR.value )
                return;
            }
            
            if(price>maxAmountKHR.value){
                app.showWarning("Coupon amount must be less than" + " " + maxAmountKHR.value )
                return;
            }

       } else {
        // USD
        if(price<minAmountUSD.value){
                app.showWarning("Coupon amount must be greater than" + " " + minAmountUSD.value )
                return;
            }
            
            if(price>maxAmountUSD.value){
                app.showWarning("Coupon amount must be less than" + " " + maxAmountUSD.value )
                return;
            }
            
       }
    }

    if(app.setting.currency != selectedCurrency.value){
        price = price / exchange_rate.value;
    }



    const returnData = {
        creation: app.dayjs(),
        product_code: props.data.name,
        product_name: props.data.product_name_en,
        product_photo: props.data.photo,
        quantity: coupounList.value.length,
        unit: props.data.unit,
        sub_total: props.data.price,
        price:price,
        amount: coupounList.value.length * props.data.price,
        coupons: coupounList.value,
        allow_discount: props.data.allow_discount,
        coupon_markup_type: doc.value.coupon_markup_type,
        coupon_markup_value: doc.value.coupon_markup_value,
        coupon_value: props.data.is_open_product == 1 ? couponValue.value : props.data.coupon_value,
        total_coupon_value: (props.data.is_open_product == 1 ? couponValue.value : props.data.coupon_value) * coupounList.value.length,
        is_open_product: props.data.is_open_product,
        append_quantity: props.data.append_quantity,
        allow_free: props.data.allow_free,
        regular_price: props.data.is_open_product == 1 ? doc.value.price : props.data.price,
        process_payment: process_payment

    }

    returnData.coupon_markup_percentage = ((returnData.coupon_value - returnData.price) / returnData.price) * 100
    modalController.dismiss(returnData, 'confirm')

}

// keyboard listener to hadle scan 
function onHandleScan(e) {
 
  const now = Date.now();

  // Only track printable keys or Enter
  if (e.key.length === 1 || e.key === "Enter") {
    const timeDiff = now - lastTime;
    lastTime = now;

    // If typing is too slow (>50ms), reset buffer (likely human typing)
    if (timeDiff > 50) {
      buffer.value = "";
    }

    if (e.key === "Enter") {
      if (buffer.value.length > 3) { // prevent noise
        lastScanned.value = buffer.value;
         coupon.value = buffer.value;
         addCoupon();
      }
      buffer.value = "";
    } else {
      buffer.value += e.key;
    }
  }
}
-

onMounted(async () => {
    window.disable_scan_check_coupon = true;
    window.addEventListener("keydown", onHandleScan);
    if (props.data.coupons) {
        coupounList.value = props.data.coupons;
    } else {
        if (app.utils.getPlateform() == "mobile") {
            await onScanWithCamera()
        }
    }
    doc.value.price = props.data.price
    doc.value.coupon_markup_type = props.data.coupon_markup_type
    doc.value.coupon_markup_value = props.data.coupon_markup_value
    doc.value.coupon_value = props.data.coupon_value
    // get min max setting
    minAmountKHR.value = app.storageService.getItem("min_amount_khr") || 500;
    maxAmountKHR.value = app.storageService.getItem("max_amount_khr") || 100000;
    minAmountUSD.value = app.storageService.getItem("min_amount_usd") || 1;
    maxAmountUSD.value = app.storageService.getItem("max_amount_usd") || 100;


})

onUnmounted(()=>{
    window.disable_scan_check_coupon = false;
    window.removeEventListener("keydown", onHandleScan);
})
</script>