<template>
  {{ options }}
 <div v-if="options">
  <template v-for="(d,index) in options" :key="index">
    <ComSelect v-if="d.ft='Link'" :docType="d.options" v-model="filter[d.f]"/>  
    <span v-else>{{ d }}</span>
  </template>
 </div>
  <!-- <ComSelectDateFilter clear v-model="date_range"  @onSelect="onSelectDate" defaultTimespan="This Month"/> -->
  
</template>
<script setup>
import { onMounted, ref } from 'vue';
const emit = defineEmits()
const props = defineProps({
  filterOptions:Object
})
const t = window.t;
const filter = ref({})
const date_range = ref()
const options = ref()
function onSelectDate(){
    if(date_range){
      filter.value.start_date = date_range.value.start_date;
      filter.value.end_date = date_range.value.end_date;
    }else {
      filter.value.start_date = null;
      filter.value.end_date = null;
    }
    emit("onFilter",filter.value)
}

onMounted(()=>{
  if((typeof props.filterOptions)=="string"){
    options.value = JSON.parse(props.filterOptions)
  }else {
    options.value = props.filterOptions;
  }
})

</script>