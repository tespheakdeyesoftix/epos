<template>
    <div class="m-2">
        <stack row gap="10px">
            <template  v-for="(f, index) in filterOptions" :key="index">
                <ComSelect :color="filter[f.fieldname]?'primary':''" v-if="f.fieldtype=='Link'" :docType="f.options" :label="f.label || f.options"  v-model ="filter[f.fieldname]" @onSelected="onSelected" @onClear="onClear"/> 
                <ComSelectDateFilter v-else-if="f.fieldtype=='Date'" :label="f.label"   v-model ="filter[f.fieldname]" :clear="f.clear"  @onSelect="onSelected" @onClear="onClear" :modalType="f.modal_type"/> 
            </template>
        </stack>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
    filterOptions: Object
})
const emit = defineEmits()
const filter = ref({})
function onSelected(selectedData){
   
    const cleaned = Object.fromEntries(
  Object.entries(filter.value).filter(([_, value]) => value !== null)
);
    emit("onFilter", cleaned)
}

function onClear(){
    const cleaned = Object.fromEntries(
  Object.entries(filter.value).filter(([_, value]) => value !== null)
);
 
    emit("onFilter", cleaned)
}


 
</script>