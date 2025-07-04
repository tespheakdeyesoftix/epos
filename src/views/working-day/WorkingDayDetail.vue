<template>
    <ion-page>
        <ToolBar>
            {{ t("Working Detail") }} - {{ name }}
        </ToolBar>
    <ion-content>
          <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
       <div style="position: sticky; top: 0; z-index: 10; background: white;">
        <ion-segment>
    <ion-segment-button value="Shift Information" content-id="first">
      <ion-label>{{ t("Shift Information") }}</ion-label>
    </ion-segment-button>
    <ion-segment-button value="second" content-id="second">
      <ion-label>Receipt List</ion-label>
    </ion-segment-button>
    <ion-segment-button value="third" content-id="third">
      <ion-label>Sale Product Breawkdown</ion-label>
    </ion-segment-button>
  </ion-segment>
  </div>
  <ion-segment-view>
    <ion-segment-content id="first">
        <ComCashierShiftSummary :data="data"/>
    </ion-segment-content>
    <ion-segment-content id="second">Second</ion-segment-content>
    <ion-segment-content id="third">Third</ion-segment-content>
  </ion-segment-view>
    </ion-content>
    <ComFooter>
       
    </ComFooter>
    </ion-page>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import ComCashierShiftSummary from "@/views/shift/components/ComCashierShiftSummary.vue"
import ToolBar from '../layouts/ToolBar.vue';
const t = window.t;
const data = ref()
const name = ref(app.route.params.name)
async function getData(){
  const l = await app.showLoading()
  const res = await app.getApi("epos_restaurant_2023.api.mobile.coupon_cashier_shift.get_cashier_shift_summary_inrormation",{
    cashier_shift:app.route.params.name
  })
  if(res.data){
    data.value = res.data;
  }
  await l.dismiss();
  
}
const onRefreshData = async (event) => {
    await getData()
    event.target.complete();
  
};


onMounted(async ()=>{
await getData();
})


</script>