<template>
    <ion-page>
        <AppBar>{{ t("Store List") }}
            <template #end>
                <ion-button class="ion-hide-md-down" shape="round" @click="onReloadData"
                    v-tooltip="`${t('Refresh Data')}`">
                    <ion-icon :icon="refreshOutline" slot="icon-only"></ion-icon>
                </ion-button>
            </template>

        </AppBar>
        <ion-content ref="contentRef">
            <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <div class="ion-padding">
                <stack row itemClass="col-6 sm:col-6 lg:col-4 p-2 ">
                    <ComCardKPI mainClass="bg-blue-500" :isCurrency="true" label="Today Revenue"
                        :value="getTotal('current_revenue')" />

                    <ComCardKPI mainClass="bg-yellow-500" label="MTD Revenue" :value="getTotal('mtd_revenue')"
                        :isCurrency="true" />
                    <ComCardKPI mainClass="bg-green-500" label="YTD Revenue" :value="getTotal('ytd_revenue')"
                        :isCurrency="true" />

                </stack>
            </div>
            <DataTable :value="data" stripedRows class="ion-padding-start ion-padding-end" tableStyle="min-width:25rem">
                <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="name" :header="t('Store Name')" sortable>
                    <template #body="slotProps">
                        <router-link :to="'/store-detail/' + slotProps.data.name">
                            {{ slotProps.data.name }} - {{ slotProps.data.vendor_name }}
                        </router-link>

                    </template>
                </Column>
                <Column field="current_revenue" :header="t('Today Revenue')" headerClass="text-right"
                    bodyClass="text-right" sortable>
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.current_revenue" />
                    </template>
                </Column>
                <Column field="mtd_revenue" :header="t('MTD Revenue')" headerClass="text-right" bodyClass="text-right"
                    sortable>
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.mtd_revenue" />
                    </template>
                </Column>
                <Column field="ytd_revenue" :header="t('YTD Revenue')" headerClass="text-right" bodyClass="text-right"
                    sortable>
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.ytd_revenue" />
                    </template>
                </Column>
                <ColumnGroup type="footer">
                    <Row>
                        <Column :footer="t('Totals:')" :colspan="2" footerStyle="text-align:right" />
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                <ComCurrency :value="getTotal('current_revenue')" />
                            </template>
                        </Column>

                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                <ComCurrency :value="getTotal('mtd_revenue')" />
                            </template>
                        </Column>
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                <ComCurrency :value="getTotal('ytd_revenue')" />
                            </template>
                        </Column>



                    </Row>
                </ColumnGroup>

            </DataTable>
        </ion-content>

    </ion-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import ComCardKPI from '@/views/dashboard/components/ComCardKPI.vue';

import { refreshOutline } from 'ionicons/icons';
const data = ref([])

const selectedRow = ref()

const t = window.t

function getTotal(fieldname) {
    return data.value?.reduce((sum, item) => sum + (item[fieldname] || 0), 0);
}

function onRowDblClick(data) {
    app.ionRouter.navigate("/store-detail/" + data.name, "forward", "push");
}

const onRefreshData = async (event) => {
    await getData();
    event.target.complete();

};
async function onReloadData() {
    const l = await app.showLoading()
    await getData();
    await l.dismiss();
}
async function getData() {

    const res = await app.getApi("epos_restaurant_2023.purchasing.doctype.vendor.vendor.get_store_revenue")
    if (res.data) {
        data.value = res.data
    }

}
onMounted(async () => {
    const loading = await app.showLoading()
    await getData()
    await loading.dismiss()
})
</script>