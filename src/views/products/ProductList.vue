<template>
    <ion-page>
        <AppBar>{{ t("Product List") }}</AppBar>
        <ion-content>
            <ion-fab horizontal="end" vertical="bottom" slot="fixed">
                <router-link to="/add-product">
                    <ion-fab-button>
                        <ion-icon :icon="add"></ion-icon>
                    </ion-fab-button>
                </router-link>
            </ion-fab>
            <DocList docType="Product" :options="options">
                <template v-slot:default="{ item }">
                    <ComProductCard v-for="(d, index) in item" :key="index" :data="d" />
                </template>
            </DocList>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import ComProductCard from '@/views/products/components/ComProductCard.vue';
import { add } from 'ionicons/icons';
const t = window.t
const options = {
    showSearchBar:true,
    showBarcodeScanner:true,
    fields:['name','product_name_en','product_name_kh','product_category',"photo","price","status","modified","modified_by"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[
    ["disabled","=",0]
  ],

  filterOptions:[
    {fieldname:"product_category", fieldtype:"Link",options:"Product Category", label:"Category"},
    {fieldname:"revenue_group", fieldtype:"Link",options:"Revenue Group"}

  ]
}
</script>