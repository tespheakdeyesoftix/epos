<template>
     <ion-list>
        <ion-item v-for="(item,index) in data" :key="index" lines="full">
          <ion-label>
            <h2>Coupon # {{ item.coupon }} </h2>
            <p>
            
              <template v-if="item.sale">
              <strong>{{ t("Customer") }}:</strong> {{ item.customer_name }} ({{ item.customer }})<br>
              <strong v-if="item.sale">{{ t("Invoice #") }}:</strong><router-link
                                    :to="'/sale-detail/'+ item.sale">
                                    {{ item.sale }}
                                </router-link><br>
              <strong>{{ t("Date") }}:</strong> {{ dayjs(item.sale_date).format("DD/MM/YYYY") }}<br>
              <strong>{{ t("Coupon Value") }}: </strong><ion-text color="danger"> <ComCurrency :value="item.coupon_value"/></ion-text>
              <br/>
              </template>  
              <ion-text color="medium">{{ t("Created By") }}: {{ item.owner.split("@")[0] }} / {{  dayjs(item.creation).fromNow() }}</ion-text>
            </p>
          </ion-label>
          <ComCurrency v-if="item.sale" :value="item.price" slot="end"/>
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