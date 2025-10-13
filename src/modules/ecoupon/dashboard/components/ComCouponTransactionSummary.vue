<template>

    <ion-card v-if="plateform == 'mobile'" class="ion-no-margin">
        <ion-card-header>
            <ion-card-title>
                {{ t("Coupon Transaction Summary") }} 
            </ion-card-title>
        </ion-card-header>
   <ion-card-content>
        <ion-list >
            <ion-item v-for="(d,index) in data" :key="index">
                <ion-label>
                    {{ t(d.transaction_type) }} <ion-chip>{{ d.total_transaction }}</ion-chip>
                </ion-label>
                <ion-label slot="end">
                    <ion-chip :color="getColor(d.transaction_type)"><ComCurrency :value="Math.abs( d.coupon_value)"/></ion-chip>
                </ion-label>
            </ion-item>
             
            <ion-item >
                <ion-label>
                    {{  t("Balance") }} 
                </ion-label>
                <ion-label slot="end">
                    <ion-chip class="ion-no-margin" color="success"><ComCurrency :value="Math.abs( couponBalance)"/></ion-chip>
                </ion-label>
            </ion-item>
        </ion-list>
   </ion-card-content>
    </ion-card>

    <!-- plateform != mobile -->
    <ion-card v-if="plateform != 'mobile'" class="ion-no-margin ">
        <ion-card-header>
            <ion-card-title>
                {{ t("Coupon Transaction Summary") }}
            </ion-card-title>
        </ion-card-header>
   <ion-card-content>
        <ion-list class="ion-no-padding ion-no-margin">
            <ion-item v-for="(d,index) in data" :key="index" class="ion-no-padding">
                <ion-label class="ion-no-margin">
                    {{ t(d.transaction_type) }} <ion-chip>{{ d.total_transaction }}</ion-chip>
                </ion-label>
                <ion-label slot="end" class="ion-no-margin" style="margin-bottom: 10px; margin-top: 10px;">
                    <ion-chip  class="ion-no-margin" :color="getColor(d.transaction_type)"><ComCurrency :value="Math.abs( d.coupon_value)"/></ion-chip>
                </ion-label>
            </ion-item>
            
            <ion-item class="ion-no-padding ion-no-margin">
                <ion-label>
                    {{  t("Balance") }} 
                </ion-label>
                <ion-label slot="end">
                    <ion-chip class="ion-no-margin" color="success"><ComCurrency :value="Math.abs( couponBalance)"/></ion-chip>
                </ion-label>
            </ion-item>
            
        </ion-list>

   </ion-card-content>
    </ion-card>
   
</template>
<script setup>
import { computed, ref } from 'vue';


const plateform = ref(app.utils.getPlateform());

const props = defineProps({ 
    data:Object
}
)
const t = window.t;
function getColor(transaction_type){
    if(transaction_type == "Sale Coupon" || transaction_type == "Top Up") return "success"
    if(transaction_type == "Used" || transaction_type == "Manager Used") return "warning"
    if(transaction_type == "Redeem" || transaction_type == "Redeemed") return "danger"



}

const couponBalance = computed(()=>{
        return   props.data.filter(x=>["Top Up","Sale Coupon","Used","Redeem"].includes(x.transaction_type)).reduce((sum, item) => sum + (item?.coupon_value || 0), 0);

})


</script>