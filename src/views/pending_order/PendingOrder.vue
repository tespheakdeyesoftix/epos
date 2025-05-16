<template>
    <ion-page>
        <AppBar>
            {{ t("Pending Order") }}
        </AppBar>
        <ion-content>
            <ion-refresher slot="fixed" @ionRefresh="onRefreshData($event)">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
            <ion-item :button="true">
                <ion-icon color="danger" slot="start" :icon="storefrontOutline" size="large"></ion-icon>
                <ion-label>{{ selectedPOSProfile }} </ion-label>
                <ion-button shape="round" size="default" fill="clear" color="secondary" @click="onChangePOSProfile">{{
                    t("Change Profile")
                }}</ion-button>
            </ion-item>
            <div v-if="data?.table_groups" class="ion-padding">
                <ion-segment mode="ios" v-model="selectedTableGroup" :value="selectedTableGroup" class="mb-2">

                    <ion-segment-button v-for="(g, index) in tableGroups" :key="index" :value="g.group"
                        :content-id="g.id">
                        <ion-label>{{ g.group }}</ion-label>
                    </ion-segment-button>



                </ion-segment>
                <ion-segment-view>

                    <ion-segment-content v-for="(g, index) in tableGroups" :key="'content_' + index" :id="g.id">

                        <ion-button @click="onTableClick(t,$event)" size="large" :style="{ '--background': t.background }"
                            v-for="(t, index) in g.tables" :key="'tbl_' + index">

                            {{ t.tbl_number }} <ion-badge color="danger" v-if="t.sales && t.sales.length > 0">{{
                                t.sales.length }}</ion-badge>

                            <ComCurrency :value="t.total_amount" v-if="t.total_amount" />

                        </ion-button>


                    </ion-segment-content>

                </ion-segment-view>
            </div>


            <!-- change outlet modal -->

        </ion-content>
    </ion-page>
</template>
<script setup lang="ts" >
import { computed, onMounted, ref } from 'vue';
import { IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView } from '@ionic/vue';
import { useApp } from "@/hooks/useApp"
const { currentProperty } = useApp()
import { storefrontOutline } from 'ionicons/icons';

import ComChangePOSProfile from "@/views/pending_order/components/ComChangePOSProfile.vue"
import ComSelectSaleOrder from "@/views/pending_order/components/ComSelectSaleOrder.vue"
 
const t = window.t;
const data = ref([])

const selectedPOSProfile = ref()
const selectedTableGroup = ref("")
const posProfiles = ref([])

const tabs = ["tab1", "tab2", "tab3"]
const tableGroups = computed(() => {

    return data.value?.table_groups;
})

const onRefreshData = async (event: CustomEvent) => {
  await getData();
        event.target.complete();
     
};


async function getData() {

   
    const res = await app.postApi("epos_restaurant_2023.selling.page.pending_sale_order_b.pending_order.get_pending_order", {
        param: JSON.stringify({
            "business_branch": currentProperty.value.property_name,
            "pos_profile": selectedPOSProfile.value,
        })
    })

    data.value = res.data
    if (data.value) {
        if (data.value.table_groups && data.value.table_groups.length > 0) {

            selectedTableGroup.value = data.value.table_groups[0].group
        }
    }
  


}

async function onChangePOSProfile() {
    const result = await app.openModal({
        component: ComChangePOSProfile,
        componentProps: {
            title: t("Change POS Profile"),
            data: posProfiles.value
        }

    })

    if (result) {
        selectedPOSProfile.value = result
    }

    const l = await app.showLoading();
    await getData();
    await l.dismiss()


}

async function onTableClick(t,event) {

    if (t.sales && t.sales.length == 0) {
        return
    }

    if (t.sales.length == 1) {

        app.ionRouter.navigate('/sale-detail/' + t.sales[0].name, 'forward', 'push');
    } else {
       
     const result = await   app.openPopOver({
            component:ComSelectSaleOrder,
            componentProps:{
                data:t
            }
        },event)

        if(result){
            app.ionRouter.navigate('/sale-detail/' + result, 'forward', 'push');
        }
    }
}


onMounted(async () => {
    posProfiles.value = (await app.getDocList("POS Profile", { filters: [["is_edoor_profile", "=", 0], ["business_branch", "=", currentProperty.value.property_name]] })).data
    if (posProfiles.value) {
        selectedPOSProfile.value = posProfiles.value[0].name
    }

    const l = await app.showLoading();
    await getData()
  await l.dismiss();
})


</script>