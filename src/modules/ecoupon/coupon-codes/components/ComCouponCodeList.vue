<template>
     <ion-list>
        <ion-item :routerLink="'/coupon-detail/'  + item.name" v-for="(item,index) in data" :key="index" lines="full">
          <ion-label>
            <h1>{{t("Coupon #")}} {{ item.coupon }} </h1>
            <p>
            
              <template v-if="item.sale">
              <strong>{{ t("Customer") }}:</strong> <router-link :to="'/customer-detail/' + item.customer"> {{ item.customer_name }} ({{ item.customer }})</router-link><br>
              <strong v-if="item.sale">{{ t("Invoice #") }}:</strong><router-link
                                    :to="'/sale-detail/'+ item.sale">
                                    {{ item.sale }}
                                </router-link><br>
              <strong>{{ t("Date") }}:</strong> {{ dayjs(item.sale_date).format("DD/MM/YYYY") }}<br>
              <strong>{{ t("Price") }}: </strong><ion-text color="danger"> <ComCurrency :value="item.price"/></ion-text>
              <br/>
              </template>  
              <ion-text color="medium">{{ t("Created By") }}: {{ item.owner.split("@")[0] }} / {{  dayjs(item.creation).fromNow() }}</ion-text>
            </p>
          </ion-label>
          <ComCurrency v-if="item.sale" :value="item.coupon_value" slot="end"/>
          <ComStatus :status="item.coupon_status" slot="end" />
        </ion-item>
      </ion-list>
</template>
<script setup>
import dayjs from 'dayjs';

const props= defineProps({
    data: {
        type: Object,
        required: true
    }
});
const t =window.t;
dayjs

</script>