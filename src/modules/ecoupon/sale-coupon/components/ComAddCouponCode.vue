<template>
    <BaseModal :title="data?.name + '-' + data.product_name_en" :hideFooter="false" @onConfirm="onConfirm">
     
        <com-input  ref="inputRef"  focus v-model="coupon" @change="onScanBarCode" :label="t('Coupon Code')"
            :placeholder="t('Please scan coupon code')" label-placement="stacked" fill="outline"></com-input>
        
            <ion-list v-if="sortedCouponList.length>0">
            <ion-item button v-for="(c, index) in sortedCouponList" :key="index">
                <ion-label>{{ c.coupon }}</ion-label>
                <ComCurrency :value="data.price" slot="end" />
                <ion-button @click="onDelete(index)" slot="end" size="large" fill="clear" shape="round" color="danger">
                    <ion-icon :icon="closeOutline"></ion-icon>
                </ion-button>
            </ion-item>
        </ion-list>
        <template v-else>
            <ion-text>{{ t("Please enter or scan qr code") }}</ion-text>
        </template>

         

        <template #footer>
            <div class="ion-padding">
                <ion-label>{{ t("Total Coupon:") }} <strong>{{ coupounList.length }}</strong></ion-label> /
                &nbsp;<ion-label>{{ t("Total Amount:") }} <strong>
                        <ComCurrency :value="coupounList.length * data.price" />
                    </strong></ion-label>
            </div>


        </template>
    </BaseModal>

</template>
<script setup>
import { modalController } from "@ionic/vue"
import dayjs from "dayjs";
import { closeOutline } from 'ionicons/icons';
import { computed, ref } from 'vue';
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const {saleDoc} = useSaleCoupon()
const inputRef = ref(null)
const props = defineProps({
    data: Object,
    
})
const t = window.t;
const coupon = ref("")
const coupounList = ref([])
const keyword=ref("")
const sortedCouponList = computed(()=>{
    if(keyword.value){
        return coupounList.value.filter(x=>x.coupon.toLowerCase().includes(keyword.value.toLowerCase())).sort((a, b) => new Date(b.creation) - new Date(a.creation));
    } else {
        return coupounList.value.sort((a, b) => new Date(b.creation) - new Date(a.creation));
    }    
})


 
async function onScanBarCode() {
 const l = await app.showLoading("Checking coupon code...")
    const canAdd = await validateCouponCode(app.utils.getCouponNumber(coupon.value))
    if (!canAdd) {
        coupon.value = ""
        await l.dismiss()
        inputRef.value.focus()
        return;
    } 
    // check 
    // check exists

    coupounList.value.push({
        product_code: props.data.name,
        product_name: props.data.product_name_en,
        photo:props.data.photo,
        quantity: 1,
        unit: props.data.unit,
        sub_total: props.data.price,
        price: props.data.price,
        total_amount: props.data.price,
        coupon: app.utils.getCouponNumber(coupon.value),
        creation: dayjs()
    })

    coupon.value = ""
    

await l.dismiss()
    inputRef.value.focus()
}

async function validateCouponCode(c){
   
    if (c == "") {
        app.showWarning("Plese enter or scan coupon code")
    }
    
    // check if exist in list 
    if(coupounList.value.filter(x=>x.coupon.toLowerCase() == c.toLowerCase()).length>0){
        app.showWarning("This coupon code is already selected")
        return false 
    }
    // if exist in sale product
    if(saleDoc.value.sale_products.filter(x=>x.coupon.toLowerCase() == c.toLowerCase()).length>0){
        app.showWarning("This coupon code is already selected")
        return false 
    }

    // validate in existing in db
    const res = await app.getDocList("Coupon Codes",{fields:["name","is_used"],filters:[["name","=",c]]})

    if(res.data.length==0){
        app.showWarning("This coupon code is not exist in the system.");
        return false
    }
    if(res.data[0].is_used == 1){
        app.showWarning("This coupon is already use.")
        return false
    }

    return true
}

function onDelete(index) {
    coupounList.value.splice(index, 1)
}

function onConfirm() {
    if(coupounList.value.length==0){
        app.showWarning("Please enter coupon code")
        return
    }
    modalController.dismiss(coupounList.value, 'confirm')
}
</script>