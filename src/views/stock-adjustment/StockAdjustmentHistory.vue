<template>
    <ion-page>
        <ToolBar>{{ t("Stock Adjustment History") }}</ToolBar>
        <ion-content>
            <ion-fab horizontal="end" vertical="bottom" slot="fixed">
                <router-link to="/stock-adjustment">
                    <ion-fab-button>
                        <ion-icon :icon="add"></ion-icon>
                    </ion-fab-button>
                </router-link>
            </ion-fab>
            <DocList docType="Single Product Adjustment" :options="options">
                <template v-slot:default="{ item }">
                    <ion-card v-for="(d, index) in item" :key="index" :data="d" class="ion-padding" button>
                        <ion-card-title>
                            {{ d.product_code }} - {{ d.product_name }}

                          

                        </ion-card-title>
                        <ion-subtitle>
                            
                            {{ d.name }} <br />
                            {{ d.stock_location }}<br/>
                            {{t("Quantity")}}: <strong><ComNumber :value="d.current_quantity" /></strong> to <strong><ComNumber :value="d.new_quantity" /></strong><br/>
                            {{ t("Cost") }}:  <strong><ComCurrency :value="d.current_cost"/></strong> to <strong><ComCurrency :value="d.new_cost"/></strong><br/>
                            <span  v-tooltip="`${dayjs(d.creation)}`">
                            By: {{d.owner.split("@")[0]}} on {{ dayjs(d.creation).fromNow() }}
                            </span>
                        </ion-subtitle>
                        

                    </ion-card>
                </template>
            </DocList>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import { add } from 'ionicons/icons';
const t = window.t
import dayjs from 'dayjs';

const options = {
    showSearchBar:true,
    showBarcodeScanner:true,
    fields:['name',"product_code","product_name","stock_location","current_quantity", "new_quantity","current_cost","new_cost","creation","owner"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filterOptions:[
    {fieldname:"product_code", fieldtype:"Link",options:"Product", label:"Product"},
    {fieldname:"product_category", fieldtype:"Link",options:"Product Category", label:"Category"},
    {fieldname:"stock_location", fieldtype:"Link",options:"Stock Location", label:"Warehouse"},
    
  ]
}
</script>