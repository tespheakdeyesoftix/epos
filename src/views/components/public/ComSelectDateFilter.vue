<template>
  <slot>
 <ion-chip @click="onSelectDate" :color="model?'secondary':''">
   
        {{ t(getLabel) }}
        <ion-icon v-if="model && clear" :icon="close" @click.stop="onClear" ></ion-icon>
  </ion-chip>
</slot>
</template>
<script setup>
import ComSelectDateModal from "@/views/components/public/ComSelectDateModal.vue"
import dayjs from "dayjs"
import { close } from "ionicons/icons"
import { computed, onMounted } from "vue"

const props = defineProps({
  label:{
    type:String,
    default:"Select Date"
  },
  clear:Boolean,
  defaultTimespan:String
})
const model = defineModel()
const emit = defineEmits()
const t = window.t;
const getLabel=computed(()=>{
  if(model.value){
    // check if have time span

    if(model.value.timespan) return model.value.timespan
    if(model.value.start_date == model.value.end_date) return dayjs(model.value.start_date).format("DD/MM/YYYY")

    return dayjs(model.value.start_date).format("DD/MM/YYYY") + " " + t("To Date") + " " + dayjs(model.value.end_date).format("DD/MM/YYYY")
  }
  return props.label;
})
async function  onSelectDate(){
  const result = await app.openModal({
    component:ComSelectDateModal,
    initialBreakpoint:0.65,
    breakpoints : [0,0.35, 0.5,0.65, 0.75, 0.95]
  })
  if(result){
    model.value = result
    emit("onSelect",result);
  }
}

function onClear(){
  model.value = null
  emit("onSelect",null);
}

onMounted(()=>{
  if(props.defaultTimespan){
    model.value = {...app.getTimespanRange(props.defaultTimespan),timespan:props.defaultTimespan};
  }
})


</script>