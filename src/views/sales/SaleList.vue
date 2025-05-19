<template>
    <ion-page>
        <AppBar>{{ t("Sale") }}</AppBar>
        <ion-content>
            <ion-fab horizontal="end" vertical="bottom" slot="fixed">
                <router-link to="/add-product">
                    <ion-fab-button>
                        <ion-icon :icon="add"></ion-icon>
                    </ion-fab-button>
                </router-link>
            </ion-fab>
            <DocList docType="Sale" :options="options">
                <template v-slot:default="{ item }">
                    {{ item }}
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
    showBarcodeScanner:false,
    fields:["name"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[
    
  ],

  filterOptions:[
    {fieldname:"pos_profile", fieldtype:"Link",options:"POS Profile", label:"POS Profile"}
  ]
}
</script>