<template>
   
<ion-grid>
  <ion-row>
    <ion-col size="6" size-md="3">
      <ion-chip class="m-0 w-full" color="primary">
        <strong>
          {{ t("Coupon Amount") }} <br>
          <ComCurrency :value="(data?.coupon_info.price || 0) + (topUp.price || 0)" />
        </strong>
      </ion-chip>
    </ion-col>

    <ion-col size="6" size-md="3">
      <ion-chip class="m-0 w-full" color="warning">
        <strong>
          {{ t("Used Amount") }} <br>
          <ComCurrency :value="usedAmount.price" />
        </strong>
      </ion-chip>
    </ion-col>

    <ion-col size="6" size-md="3">
      <ion-chip class="m-0 w-full" color="danger">
        <strong>
          {{ t("Redeem Amount") }} <br>
          <ComCurrency :value="redeemAmount.price" />
        </strong>
      </ion-chip>
    </ion-col>

    <ion-col size="6" size-md="3">
      <ion-chip class="m-0 w-full" color="success">
        <strong>
          {{ t("Balance") }} <br>
          <ComCurrency :value="totalAmount.price" />
        </strong>
      </ion-chip>
    </ion-col>
  </ion-row>
</ion-grid>



    <ion-card>
        <ion-card-header>
            <ion-item class="ion-no-padding" lines="none">
                <ion-label><h1>{{ t("Coupon #") }}: {{ data?.coupon_info.coupon }}</h1></ion-label>
            <ComStatus :status="data?.coupon_info.coupon_status"></ComStatus>
                </ion-item>
        </ion-card-header>
        <ion-card-content v-if="data?.coupon_info.sale">
            <stack grap="20px">
            <stack row equal>
                <ion-label><strong> {{ t("Invoice #") }} </strong>: <router-link :to="'/sale-detail/' + data?.coupon_info.sale">{{ data?.coupon_info.sale }}</router-link></ion-label>
                <ion-label><strong> {{ t("Sale Date") }} </strong>: {{ dayjs(data?.coupon_info.sale_date).format("DD/MM/YYYY") }}</ion-label>
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
                <ion-label><strong> {{ t("Expired Date") }} </strong>: {{ dayjs(data?.expired_date).format('DD/MM/YYYY h:mm A') }}</ion-label>

            </stack>

            
            <stack row equal>
                <ion-label><strong> {{ t("Price") }} </strong>: <ComCurrency :value="data?.coupon_info.price"/></ion-label>
                <ion-label color="danger"><strong> {{ t("Coupon Value") }} </strong>: <ComCurrency :value="data?.coupon_info.coupon_value"/></ion-label>

            </stack>

            </stack>
        </ion-card-content>
    </ion-card>

    <ion-card v-if="data?.coupon_transaction.length>0">
        <ion-card-header>
            <ion-card-title>
               <ion-item class="ion-no-padding" lines="none">
                <ion-label><h1>{{ t("Coupon Amount Summary") }}</h1></ion-label>
            </ion-item> 
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row>
                    <ion-col>{{ t("Transaction Type") }}</ion-col>
                    <ion-col class="text-right">{{ t("Actual Amount") }}</ion-col>
                     <ion-col class="text-right">{{ t("Coupon Value") }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>{{ t("Sale Coupon") }}</ion-col>
                    <ion-col class="text-right"><ComCurrency :value="data?.coupon_info.price"/></ion-col>
                    <ion-col class="text-right"><ComCurrency :value="data?.coupon_info.coupon_value"/></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>{{ t("Top Up") }}</ion-col>
                    <ion-col class="text-right"><ComCurrency :value="topUp.price"/></ion-col>
                    <ion-col class="text-right"><ComCurrency :value="topUp.coupon_value"/></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>{{ t("Use Amount") }}
                    </ion-col>
                    <ion-col class="text-right"><ComCurrency :value="usedAmount.price"/></ion-col>
                    <ion-col class="text-right"><ComCurrency :value="usedAmount.coupon_value"/></ion-col>
                </ion-row>
                
                <ion-row>
                    <ion-col>{{ t("Redeem") }}</ion-col>
                    <ion-col class="text-right"><ComCurrency :value="redeemAmount.price"/></ion-col>
                    <ion-col class="text-right"><ComCurrency :value="redeemAmount.coupon_value"/></ion-col>
                </ion-row>
                
                <ion-row>
                    <ion-col><strong>{{ t("Total/Balance") }}</strong></ion-col>
                    <ion-col class="text-right"><strong><ComCurrency :value="totalAmount.price"/></strong></ion-col>
                    <ion-col class="text-right"><strong><ComCurrency :value="totalAmount.coupon_value"/></strong></ion-col>
                </ion-row>



            </ion-grid>
 
        </ion-card-content>
    </ion-card>
 

    <ion-card v-if="data?.coupon_transaction.length>0">
        <ion-card-header>
            <ion-item class="ion-no-padding" lines="none">
                <ion-label><h1>{{ t("Coupon Transactions") }}</h1></ion-label>
            </ion-item>
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                    <ion-label>{{ t("Description") }}</ion-label>
                    <ion-label slot="end">{{ t("Coupon Value") }}</ion-label>
                </ion-item>
                <ion-item v-for="(item, index) in data?.coupon_transaction" :key="index" lines="full">
                    <ion-label>
                        
                        <ion-text :color="getColor(item.transaction_type)"><h2>{{ t(item.transaction_type) }}</h2></ion-text>
                        <p>
                            <ion-text v-if="item.sale"><strong>{{ t("Invoice #") }}:</strong> <router-link :to="'/sale-detail/' + item.sale"> {{ item.sale }}</router-link><br></ion-text>
                            <ion-text><strong>{{ t("Actual Amount") }}:</strong> <ComCurrency :value="item.input_actual_amount" :currency="item.currency"/><br></ion-text>
                            <ion-text><strong>{{ t("POS Profile") }}:</strong> {{ item.pos_profile }}/{{ item.pos_station }}<br></ion-text>
                            
                        </p>
                         
                        <ion-text color="medium">{{ t("Created by") }}: {{ item.created_by.split("@")[0] }} / 
                            <span v-tooltip.top="`${dayjs(item.transaction_date)}`">{{  dayjs(item.transaction_date).fromNow() }}</span></ion-text>                    </ion-label>
                    
                            <ion-chip  :color="getColor(item.transaction_type)" slot="end" >
                            <ComCurrency  :value="item.coupon_amount"/>
                    </ion-chip>
                 
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
    <ion-note class="ion-padding">
       
        {{ t("This coupon is register by:") }} {{ data?.coupon_info.owner.split("@")[0] }} {{ t("on_date_time") }} <ion-text v-tooltip.top="`${creationDate}`">{{ dayjs(data?.coupon_info.creation).fromNow() }}</ion-text>
    </ion-note>

</template>
<script setup>
import { IonLabel } from '@ionic/vue';
import dayjs from 'dayjs';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    data:Object
})
const t = window.t;
const creationDate = ref(dayjs(props.data?.coupon_info.creation))
function getColor(transaction_type){
    if(transaction_type == "Sale Coupon" || transaction_type == "Top Up") return "success"
    if(transaction_type == "Used") return "warning"
    if(transaction_type == "Redeem" || transaction_type == "Redeemed") return "danger"

}

const topUp = computed(()=>{
    const topUpList = props.data?.coupon_transaction?.filter(x=>x.transaction_type == "Top Up")

    return {       
        price: topUpList?.reduce((sum, item) => sum + (item?.input_actual_amount ||0), 0),
        coupon_value : topUpList?.reduce((sum, item) => sum + (item?.coupon_amount ||0), 0),
    }
})
const usedAmount = computed(()=>{
    const transaction = props.data?.coupon_transaction?.filter(x=>x.transaction_type == "Used")

    return {       
        price: transaction?.reduce((sum, item) => sum + (item?.input_actual_amount ||0) / (item.exchange_rate || 1), 0),
        coupon_value : transaction?.reduce((sum, item) => sum + (item?.coupon_amount ||0), 0),
    }
})
const redeemAmount = computed(()=>{
    const transaction = props.data?.coupon_transaction?.filter(x=>x.transaction_type == "Redeem")

    return {       
        price: transaction?.reduce((sum, item) => sum + (item?.input_actual_amount ||0), 0),
        coupon_value : transaction?.reduce((sum, item) => sum + (item?.coupon_amount ||0), 0),
    }
})

const totalAmount = computed(()=>{
    const transaction = props.data?.coupon_transaction;

    return {       
        price: transaction?.reduce((sum, item) => sum + (item?.input_actual_amount ||0) /  (item.exchange_rate || 1), 0),
        coupon_value : transaction?.reduce((sum, item) => sum + (item?.coupon_amount ||0), 0),
    }
})
</script>