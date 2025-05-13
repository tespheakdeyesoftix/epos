<template>
 
      <Loading v-if="loading"></Loading>
      <template v-else>
        <ion-refresher slot="fixed" @ionRefresh="onRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <slot :item="data">
          {{ data }}
             
        </slot>
      </template>
       
    
    
</template>
<script setup lang="ts">
import { useDocument } from '@/hooks/useDocument';
import {defineModel} from "vue"
const props = defineProps({
    docType:String,
    docName:String,
    showActivity:{
      type:Boolean,
      default:true
    }
})
const doc = defineModel("doc");
const docInfo = defineModel('docInfo')
const {data,onRefresh,loading} = useDocument(props,doc,docInfo)


</script>