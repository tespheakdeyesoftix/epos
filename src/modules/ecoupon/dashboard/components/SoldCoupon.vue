<template>
    <ion-page>
        <AppBar>{{ t("Sold Coupon") }}</AppBar>
        <ion-content  ref="pageRef" :scrollEvents="true" @ionScroll="handleScroll">
 
            <DocList docType="Coupon Codes" :options="options"
            v-model:selectedRow="selectedRow"
            @onRowDblClick="onRowDblClick"
            ref="docListRef"
            >
             <template #price="{ item, index }">
                  <template v-if="item.price>0">
                      <ComCurrency v-tooltip.left="`${t('Price')}`" :value="item.price" />
                      <template v-if="item.price != item.coupon_value">

                      
                      / <ComCurrency v-tooltip.right="`${t('Coupon Value')}`" :value="item.coupon_value"/>
                      </template>
                  </template>
                  <span v-else>-</span>

                   
                </template>
                <template #top_up_amount="{ item, index }">
                  <template  v-if="item.top_up_amount>0">
                    <ComCurrency v-tooltip.left="`${t('Price')}`" :value="item.top_up_amount" /> 
                    <template v-if="item.top_up_amount!=item.top_up_coupon_value">
                    / <ComCurrency v-tooltip.right="`${t('Coupon Value')}`" :value="item.top_up_coupon_value"/>
            </template>
                  </template>
                  <span v-else>-</span>
                   
                </template>
                <!-- Use Amount -->
                <template #use_amount="{ item, index }">
                  <template  v-if="item.use_amount!=0">
                    <ComCurrency v-tooltip.left="`${t('Actual Amount')}`" :value="item.use_amount" />
                    <template v-if="item.use_amount != item.use_coupon_value">
                    / <ComCurrency v-tooltip.right="`${t('Coupon Value')}`" :value="item.use_coupon_value"/>
                    </template>
                  </template>
                  <span v-else>-</span>
                </template>
                
                <!-- Redeem -->
                <template #redeem_amount="{ item, index }">
                  <template  v-if="item.redeem_amount!=0">
                    <ion-text color="danger">
                    <ComCurrency v-tooltip.left="`${t('Price')}`" :value="Math.abs(item.redeem_amount)" />
                    <template v-if="item.redeem_amount !=item.redeem_coupon_value">
/ <ComCurrency v-tooltip.right="`${t('Coupon Value')}`" :value="Math.abs(item.redeem_coupon_value)"/>
                    </template>
                    </ion-text>
                  </template>
                  <span v-else>-</span>
                   
                </template>
                
                <!-- Balance -->
                <template #balance_amount="{ item, index }">
                  <template  v-if="item.balance_amount!=0">
                    <ComCurrency v-tooltip.left="`${t('Balance')}`" :value="item.balance_amount" />
                    <template v-if="item.balance_amount !=item.balance_coupon_value">
/ <ComCurrency v-tooltip.right="`${t('Coupon Value')}`" :value="Math.abs(item.balance_coupon_value)"/>
                    </template>
                    
                  </template>
                  <span v-else>-</span>
                </template>



                <template #coupon_status="{ item, index }">
                    <ComStatus :status="item.coupon_status"/>
                </template>
                <template #sale_date="{ item, index }">
                    
                    <ion-label v-if="(item.sale_date || '')!=''">{{ dayjs(item.sale_date).format("DD/MM/YYYY") }}</ion-label>
                    <ion-label v-else></ion-label>
                </template>
                
            </DocList>
             
            <transition name="fade">
        <ion-fab v-if="showFab" vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="scrollToTop" color="primary">
            <ion-icon :icon="arrowUpOutline" />
          </ion-fab-button>
        </ion-fab>
      </transition>

        </ion-content>
        <ComFooter>
             <ion-button :disabled="!selectedRow" :routerLink="'/coupon-detail/' + selectedRow?.name">{{ t("View Detail") }}</ion-button>
           
        </ComFooter>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';

import dayjs from 'dayjs';
import { arrowUpOutline } from 'ionicons/icons';
import {  onIonViewDidEnter } from '@ionic/vue';
const docListRef = ref()

const plateform = ref(app.utils.getPlateform())
const pageRef = ref(null)
const selectedRow = ref()
const t = window.t
const options = {
    columns:[
        {fieldname:"coupon",header:"Coupon #",url:"/coupon-detail",id_field:"name"},
        {fieldname:"coupon_status",header:"Status",},
        {fieldname:"sale",header:"Sale #", url:"/sale-detail"},
        {fieldname:"sale_date",header:"Sale Date", fieldtype:"Date"},
        {fieldname:"customer_name",header:"Customer", url:"/customer-detail",id_field:"customer"},
        
        {fieldname:"price",header:"Price",fieldtype:"Currency"},
        {fieldname:"top_up_amount",header:"Top Up",fieldtype:"Currency"},
        {fieldname:"use_amount",header:"Used Amount",fieldtype:"Currency"},
        {fieldname:"redeem_amount",header:"Redeem",fieldtype:"Currency"},
        {fieldname:"balance_amount",header:"Balance",fieldtype:"Currency"},
        {fieldname:"created_by",header:"Created By",},
        {fieldname:"sale_creation",header:"Date",fieldtype:"Datetime"},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name","customer","coupon_value","top_up_coupon_value","redeem_coupon_value","use_coupon_value","balance_coupon_value"],
    orderBy:{
      field: "sale_creation",
      order: "desc",
  },
  filters:[
    ["sale", "is", "set"],
  ],
  filterOptions:[
   
    {fieldname:"sale_date", fieldtype:"Date",   label:t('Sale Date')},
    {fieldname:"working_day", fieldtype:"Link",options:"Working Day", label:t("Working Day")},
    {fieldname:"cashier_shift", fieldtype:"Link",options:"Cashier Shift", label:t("Cashier Shift")},
    {fieldname:"sale", fieldtype:"Link",options:"Sale", label:t("Sale #")}
    
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/coupon-detail/" + data.name, "forward", "push");
}
const showFab = ref(false)

const scrollToTop = () => {
  pageRef.value?.$el.scrollToTop(500)
}

const handleScroll = (ev) => {
  const scrollTop = ev.detail.scrollTop;
  showFab.value = scrollTop > 200; // show after scrolling 200px
};
onIonViewDidEnter(async ()=>{
 
 
    if((window.refresh_page || 0) == 1){
     
      const l = await app.showLoading();
       await docListRef.value.onRefresh()
       window.history.replaceState({}, '', '/coupon-code-list');
       await l.dismiss();
       window.refresh_page = 0;

    }
})

</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>