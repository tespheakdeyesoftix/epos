<template>
   
    <ion-card>
        <ion-card-header>
            <ion-item class="ion-no-padding" lines="none">
                <ion-label><h1>{{ t("Coupon #") }}: {{ data?.coupon_info.coupon }}</h1></ion-label>
            <ComStatus :status="data?.coupon_info.coupon_status"></ComStatus>
                </ion-item>
        </ion-card-header>
        <ion-card-content>
            <stack grap="20px">
            <stack row equal>
                <ion-label><strong> {{ t("Invoice #") }} </strong>: <router-link :to="'/sale-detail/' + data?.coupon_info.sale">{{ data?.coupon_info.sale }}</router-link></ion-label>
                <ion-label><strong> {{ t("Sale Date") }} </strong>: {{ dayjs(ata?.coupon_info.sale_date).format("DD/MM/YYYY") }}</ion-label>
            </stack>
            
            <stack row equal>
                <ion-label><strong> {{ t("Customer") }} </strong>: <router-link :to="'/customer-detail/' + data?.coupon_info.customer">{{ data?.coupon_info.customer }} - {{ data?.coupon_info.customer_name }}</router-link></ion-label>
                <ion-label><strong> {{ t("Created By") }} </strong>: {{ data?.coupon_info.created_by}}</ion-label>
            </stack>
            
            <stack row equal>
                <ion-label><strong> {{ t("Working Day #") }} </strong>: {{ data?.coupon_info.working_day }}</ion-label>
                <ion-label><strong> {{ t("Cashier Shift #") }} </strong>: {{ data?.coupon_info.cashier_shift}}</ion-label>
            </stack>
            
            <stack row equal>
                <ion-label><strong> {{ t("POS Station") }} </strong>: {{ data?.coupon_info.pos_station }}</ion-label>

            </stack>
            
            <stack row equal>
                <ion-label><strong> {{ t("Price") }} </strong>: <ComCurrency :value="data?.coupon_info.price"/></ion-label>
                <ion-label color="danger"><strong> {{ t("Coupon Value") }} </strong>: <ComCurrency :value="data?.coupon_info.coupon_value"/></ion-label>

            </stack>




            </stack>

        </ion-card-content>
    </ion-card>


    <ion-card >
        <ion-card-header>
            <ion-item class="ion-no-padding" lines="none">
                <ion-label><h1>{{ t("Coupon Transactions") }}</h1></ion-label>
            </ion-item>
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item v-for="(item, index) in data?.coupon_transaction" :key="index" lines="full">
                    <ion-label>
                        <h2>{{ item.transaction_type }}</h2>
                        <p>
                            <ion-text v-if="item.sale"><strong>{{ t("Invoice #") }}:</strong> <router-link :to="'/sale-detail/' + item.sale"> {{ item.sale }}</router-link><br></ion-text>
                            <ion-text><strong>{{ t("Actual Amount") }}:</strong> <ComCurrency :value="item.input_actual_amount"/><br></ion-text>
                        </p>
                        <ion-text color="medium">{{ t("Created By") }}: {{ item.created_by.split("@")[0] }} / {{  dayjs(item.transaction_date).fromNow() }}</ion-text>
                    </ion-label>
                    <ion-label  :color="item.coupon_amount>0?'primary':'danger'" slot="end" >
   <ComCurrency  :value="item.coupon_amount"/>
                    </ion-label>
                 
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
     {{ data }}
</template>
<script setup>
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';

const props = defineProps({
    data:Object
})
const t = window.t;

</script>