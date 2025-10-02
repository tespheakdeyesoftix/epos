<template>
    <ion-page>
        <AppBar>{{ t("Store Shift List") }}</AppBar>
        <ion-content>
           
            <DataTable v-if="plateform != 'mobile'" :value="data" stripedRows class="ion-padding-start ion-padding-end" tableStyle="min-width:25rem">
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
                    <Column field="cashier_shift_number" :header="t('Cashier Shift Number')" headerClass="text-center" bodyClass="text-center" sortable >
                        <template #body="slotProps">
                          
                            {{ slotProps.data.cashier_shift_number }}

                        </template>
                    </Column>
                    <Column field="creation" :header="t('Date')" headerClass="text-center" bodyClass="text-center" sortable >
                        <template #body="slotProps">
                            
                             {{ slotProps.data.creation ? dayjs(slotProps.data.creation).format("DD/MM/YYYY") : "" }}
                        </template>
                    </Column>
                    <Column field="is_closed" :header="t('Status')" headerClass="text-center" bodyClass="text-center" sortable >
                        <template #body="slotProps">
                          <ComStatus :status="getStatus(slotProps.data.is_closed)" />
                        </template>
                    </Column>
            
        </DataTable>

        <div v-if="plateform == 'mobile'">
            <ion-card v-for="(d,index) in data" :key="index">
                <ion-card-content>
                    <stack row equal>
                        <ion-text>{{t("Store Name")}}:</ion-text>
                        <router-link :to="'/store-detail/' + d.name ">
                            <ion-text> {{ d.name }} - {{ d.vendor_name }}</ion-text>
                        </router-link>
                    </stack>
                    <stack row equal>
                        <ion-text>{{t("Cashier Shift Number")}}:</ion-text>
                        <ion-text> {{ d.cashier_shift_number }}</ion-text>
                    </stack>
                    <stack row equal>
                        <ion-text>{{t("Date")}}:</ion-text> 
                        <ion-text>  {{ d.creation ? dayjs(d.creation).format("DD/MM/YYYY") : "" }}</ion-text>
                    </stack>
                    <stack row equal>
                        <ion-text>{{t("Status")}}:</ion-text> 
                     <ComStatus :status="getStatus(d.is_closed)" /> 
                    </stack>  
                </ion-card-content>
            </ion-card>
        </div>
        </ion-content>

    </ion-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';
import ComStatus from '@/views/components/public/ComStatus.vue';
const data = ref([])

const selectedRow = ref()
const plateform = ref(app.utils.getPlateform())
const t = window.t
  
async function getData() {

    const res = await app.getApi("epos_restaurant_2023.api.coupon.get_store_cashier_shift_info")
    if (res.data) {
        data.value = res.data
    }

}


const getStatus = (value) => {
  if (value === 0) return 'Opened'
  if (value === 1) return 'Closed'
  return 'Not Opened'
}

onMounted(async () => {
    const loading = await app.showLoading()
    await getData()
    await loading.dismiss()
})
</script>