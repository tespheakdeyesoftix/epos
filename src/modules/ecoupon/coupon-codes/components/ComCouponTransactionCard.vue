<template>
    
    <ion-card button class="ion-no-margin mb-3" :routerLink="'/coupon-detail/' + data.coupon_code" >
        <ion-item lines="none" style="--background: rgba(255, 0, 0, 0);">   

            <!-- Middle Text -->
            <ion-label>
                <h2 class="card-title">{{ data.coupon_number }}</h2>
                <p class="card-subtitle">
                    <ion-text color="medium-tint">
                        <span>
                            {{t("Create By")}}: {{ data.created_by.split('@')[0]}}
                        </span>
                        <div>
                            {{dayjs(data?.creation).format('DD/MM/YYYY hh:mm A')}}
                        </div>
                    </ion-text>

                </p>
                <p><ComStatus :status="data?.transaction_type"/></p>
                
            </ion-label>
            <div slot="end" style="font-size: 20px;font-weight: bold;">
                <ion-text :color="getColor(data.transaction_type)"><com-currency :value="Math.abs(data?.actual_amount)" /></ion-text>
            </div>
        </ion-item>
    </ion-card>
</template>

<script setup>
const props = defineProps({
    data: Object
})

 function getColor(transaction_type){
    if(transaction_type == "Sale Coupon" || transaction_type == "Top Up") return "success"
    if(transaction_type == "Used") return "warning"
    if(transaction_type == "Redeem" || transaction_type == "Redeemed") return "danger"

}

import dayjs from "dayjs";
 
const t = window.t;
 
 
</script>

<style scoped>
.card-title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 4px;
    padding-left: 10px;
}

.card-subtitle {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
    padding-left: 10px;
    line-height: 1.4;
}


.amount-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    min-width: 70px;
}

.amount {
    font-weight: bold;
    font-size: 1rem;
    color: #2dd36f;
    text-align: right;
}
</style>