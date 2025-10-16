<template>
  <ion-page>
    <ToolBar>{{ t("Coupon Balance List") }}

       <template #end>
                <ion-button @click="onRefresh" shape="round" class="ion-hide-sm-down">
                    <ion-icon :icon="refreshOutline" slot="icon-only" />
                </ion-button>
            </template>

    </ToolBar>
    <ion-content>

      <Message severity="error" closable>
        <ion-text><h3>{{ t("Warning") }}</h3></ion-text>
        <ion-text>{{ t("We use option when main server is down.") }}</ion-text>
      </Message>
         <ion-refresher slot="fixed" @ionRefresh="onPullToRefresh">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

      <ComSearchBar ref="txtSearch" :showBarcodeScanner="true" @onSearch="onSearch"  v-model="filter.keyword" />

      <div class="mt-2">
       
        <ComSelectDateFilter  defaultTimespan="Today" :clear="false" v-model="filter.posting_date"
          @onSelect="onDateChange" />
        <ComPopOver>
          <ion-chip>{{ t("Balance Amount") }}</ion-chip>
          <template #content>
            <ion-list>
              <ion-item button @click="onFilterBalance(-1)">
                <ion-label>{{ t("Show All") }}</ion-label>
              </ion-item>
              <ion-item button @click="onFilterBalance(1)">
                <ion-label>{{ t("Balance > 0") }}</ion-label>
              </ion-item>
              <ion-item button @click="onFilterBalance(0)">

                <ion-label>{{ t("Balance = 0") }}</ion-label>

              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
        <ComPopOver>
          <ion-chip>{{ t("Status") }}</ion-chip>
          <template #content>
            <ion-list>
              <ion-item button @click="onFilterStatus(-1)">
                <ion-label>{{ t("Show All") }}</ion-label>
              </ion-item>
              <ion-item button @click="onFilterStatus(1)">
                <ion-label>{{ t("Is Redeem") }}</ion-label>
              </ion-item>
              <ion-item button @click="onFilterStatus(0)">

                <ion-label>{{ t("Not Redeem") }}</ion-label>

              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
      </div>

      <DataTable :value="couponData" dataKey="coupon_number" selectionMode="single" v-model:selection="selectedCoupon"
        showGridlines stripedRows responsiveLayout="scroll" class="mt-3"
         :sortField="filter.sort_field"
  :sortOrder="filter.sort_order"
  @sort="onSort"
        >
        <!-- No -->
        <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>

        <Column field="coupon_number" :header="t('Coupon Number')" sortable>
          <template #body="slotProps">
            <router-link :to="{
              path: '/check-balance-detail/' + slotProps.data.coupon_number,
              state: slotProps.data
            }">
              <span>{{ slotProps.data.coupon_number }}</span>
            </router-link>
          </template>
        </Column>
        <Column field="price" :header="t('Price')" sortable headerClass="text-center" bodyClass="text-right">
          <template #body="slotProps">
            <ComCurrency :value="slotProps.data.price" />
          </template>
        </Column>
        <Column field="top_up_amount" :header="t('Top Up')" sortable headerClass="text-center" bodyClass="text-right">
          <template #body="slotProps">
            <ComCurrency :value="slotProps.data.top_up_amount" />
          </template>
        </Column>
        <Column field="use_amount" :header="t('Use Amount')" sortable headerClass="text-center" bodyClass="text-right">
          <template #body="slotProps">
            <ComCurrency :value="slotProps.data.use_amount" />
          </template>
        </Column>
        <Column field="redeem_amount" :header="t('Redeem')" sortable headerClass="text-center" bodyClass="text-right">
          <template #body="slotProps">
            <ComCurrency :value="slotProps.data.redeem_amount" />
          </template>
        </Column>
        <Column field="balance_amount" :header="t('Balance Amount')" sortable headerClass="text-center" bodyClass="text-right">
          <template #body="slotProps">
            <ComCurrency :value="slotProps.data.balance_amount" />
          </template>
        </Column>
        <Column field="posting_date" :header="t('Date')" sortable headerClass="text-center" bodyClass="text-center">
          <template #body="slotProps">
            {{ dayjs(slotProps.data.posting_date).format('DD/MM/YYYY') }}
          </template>
        </Column>
        <Column field="is_redeem" :header="t('Redeem')" sortable>
          <template #body="slotProps">
            <ion-button size="small" :color="slotProps.data.is_redeem == '1' ? 'success' : 'warning'"
              :disabled="slotProps.data.is_redeem == '1'" @click="onRedeem(slotProps.data)">
              {{ slotProps.data.is_redeem == '1' ? t('Redeemed') : t('Redeem') }}
            </ion-button>
          </template>
        </Column>
      </DataTable>

      <ion-infinite-scroll @ionInfinite="onLoadMoreData" threshold="0">
        <ion-infinite-scroll-content :loading-text="t('Loading more...')"></ion-infinite-scroll-content>
      </ion-infinite-scroll>

        <ion-chip v-if="couponData.length > 0"
        style="position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 1000;">
        {{ t("Showing Record") }} {{ couponData.length }} {{ t("of") }} {{ totalRow }}
    </ion-chip>
    </ion-content>
  </ion-page>
</template>

<script setup>
import supabase from "@/services/supabase-client";
import { ref, onMounted } from 'vue';
import { useCheckCouponBalance } from '@/hooks/useCheckCouponBalance.js'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import dayjs from 'dayjs';
import ComSelectDateFilter from "@/views/components/public/ComSelectDateFilter.vue"
import ComSearchBar from "@/views/components/ComSearchBar.vue"
import { useAuth } from "@/hooks/useAuth";
import {  refreshOutline } from "ionicons/icons";

const txtSearch = ref(null)
const {checkServerURL} = useAuth();


const t = window.t

const { couponData, getData, filter, onLoadMoreData,totalRow,onRedeem,isServerRunning } = useCheckCouponBalance()

async function onSearch(data) {
  
  let keyword = data;
  if(isUrl(keyword)){
    
    keyword = app.utils.getCouponNumber(keyword)
     

  }
  filter.value.keyword = keyword
  

  couponData.value = []
  setTimeout(() => {
    txtSearch.value.setText(keyword)
  }, 300);
  const loading = await app.showLoading()
  
  await getData();
  loading.dismiss()

  
}

function isUrl(str) {
  if (!str) return false;

  const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i;
  return pattern.test(str.trim());
}


async function onFilterStatus(is_redeem) {
  filter.value.is_redeem = is_redeem
  couponData.value = []
  const loading = await app.showLoading()
  await getData();
  loading.dismiss()
}
async function onFilterBalance(is_has_balance) {
  filter.value.has_balance = is_has_balance
  couponData.value = []
  const loading = await app.showLoading()
  await getData();
  loading.dismiss()
}



async function onSort(data){
  
  filter.sort_field = data.sortField;
  filter.sort_order = data.sortOrder;

  const loading = await app.showLoading()
  await getData();
  loading.dismiss()

}

async function onRefresh(){
    const loading = await app.showLoading()
  await getData();
  loading.dismiss()
}

 

const onPullToRefresh = async (event) => {
   await getData();
     
        event.target.complete();
    
};

onMounted(async () => {
  couponData.value = []
  const loading = await app.showLoading()
  await getData();
  loading.dismiss()


    const currentProperty = await app.storageService.getItem("current_property")
  
  const checkServer = await checkServerURL(JSON.parse(currentProperty).api_url)
  isServerRunning.value = checkServer;


});


  
</script>