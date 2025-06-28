<template>
    <ion-card class="ion-no-padding ion-no-margin">
        <ion-card-header>
            <ion-card-title>
                {{ t("Recent Transactions") }}
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-segment @ionChange="onSelected" >
                <ion-segment-button v-for="(d,index) in transactionType" :key="index" :value="d.label" :content-id="'recent_' + index">
                    <ion-label>{{ t(d.label) }}</ion-label>
                </ion-segment-button>
                
            </ion-segment>
            <ion-segment-view>
                <ion-segment-content v-for="(d,index) in transactionType" :key="index"  :id="'recent_' + index">
                    <component :is="d.component"  v-if="d.is_loaded==true"/>
                </ion-segment-content>
                 
            </ion-segment-view>
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import { ref } from 'vue';
import ComRecentSaleCoupon from '@/modules/ecoupon/dashboard/components/recent-transaction/ComRecentSaleCoupon.vue';
import ComRecentTopUp from '@/modules/ecoupon/dashboard/components/recent-transaction/ComRecentTopUp.vue';
import ComRecentUseCoupon from '@/modules/ecoupon/dashboard/components/recent-transaction/ComRecentUseCoupon.vue';
import ComRecentRedeem from '@/modules/ecoupon/dashboard/components/recent-transaction/ComRecentRedeem.vue';


const t = window.t;
const transactionType = ref([
    { label: "Sale Coupon", is_loaded: true, component: ComRecentSaleCoupon },
    { label: "Top Up", is_loaded: false, component: ComRecentTopUp },
    { label: "Use Coupon", is_loaded: false, component: ComRecentUseCoupon },
    { label: "Redeem", is_loaded: false, component: ComRecentRedeem }
])

function onSelected(event) {
    const selected = transactionType.value.find(x=>x.label == event.detail.value);
    selected.is_loaded = true;
}
</script>