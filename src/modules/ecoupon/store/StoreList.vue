<template>
    <ion-page>
        <AppBar>{{ t("Store List") }}</AppBar>
        <ion-content ref="contentRef">
            {{ data }}
                <DataTable :value="data" stripedRows tableStyle="min-width: 50rem">
                    <Column field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                </DataTable>
        </ion-content>
        <ComFooter class="ion-hide-sm-down">
            <ion-button :disabled="!selectedRow" :routerLink="'/store-detail/' + selectedRow?.name">{{ t("View Detail") }}</ion-button>
         
        </ComFooter>
    </ion-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const data = ref([])

 const selectedRow = ref()
 
const t = window.t


function onRowDblClick(data){
    app.ionRouter.navigate("/store-detail/" + data.name, "forward", "push");
}
  async function getData(){

    const res = await app.getApi("epos_restaurant_2023.purchasing.doctype.vendor.vendor.get_store_revenue")
    if(res.data){
        data.value = res.data
    }

  }
  onMounted(async ()=>{
        const loading = await  app.showLoading()
    await getData()
        await loading.dismiss()
  })
</script>