<template>
    <ion-card v-if="plateform == 'mobile'" class="ion-no-margin">
        <ion-card-header>
            <ion-card-title>
                {{ t("Coupon Transaction Summary") }}
            </ion-card-title>
        </ion-card-header>
   <ion-card-content>
        <ion-list>
            <ion-item v-for="(d,index) in data" :key="index">
                <ion-label>
                    {{ t(d.transaction_type) }} <ion-chip>{{ d.total_transaction }}</ion-chip>
                </ion-label>
                <ion-label slot="end">
                    <ion-chip :color="getColor(d.transaction_type)"><ComCurrency :value="Math.abs( d.coupon_value)"/></ion-chip>
                </ion-label>
            </ion-item>
        </ion-list>
   </ion-card-content>
    </ion-card>

    <!-- plateform != mobile -->
    <ion-card v-if="plateform != 'mobile'" class="ion-no-margin ml-2  ">
        <ion-card-header>
            <ion-card-title>
                {{ t("Coupon Transaction Summary") }}
            </ion-card-title>
        </ion-card-header>
   <ion-card-content>
        <ion-list>
            <ion-item v-for="(d,index) in data" :key="index">
                <ion-label>
                    {{ t(d.transaction_type) }} <ion-chip>{{ d.total_transaction }}</ion-chip>
                </ion-label>
                <ion-label slot="end">
                    <ion-chip :color="getColor(d.transaction_type)"><ComCurrency :value="Math.abs( d.coupon_value)"/></ion-chip>
                </ion-label>
            </ion-item>
        </ion-list>
   </ion-card-content>
    </ion-card>
   
</template>
<script setup>
import { ref } from 'vue';


const plateform = ref(app.utils.getPlateform());

const props = defineProps({ 
    data:Object
}
)
const t = window.t;
function getColor(transaction_type){
    if(transaction_type == "Sale Coupon" || transaction_type == "Top Up") return "success"
    if(transaction_type == "Used") return "warning"
    if(transaction_type == "Redeem" || transaction_type == "Redeemed") return "danger"

}


</script>