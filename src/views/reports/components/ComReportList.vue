<template>
   
      <ion-accordion-group v-if="reportList.length>0">
    <ion-accordion :value="parent.name" v-for="parent in reportList?.filter(x=>x.parent_system_report=='POS Report')" class="ion-no-padding">
      <ion-item slot="header" color="light">
        <ion-label>{{ t(parent.report_title) }}</ion-label>
      </ion-item>
      <div  slot="content">
        <ion-list>
            <ion-item  button v-for="r in reportList.filter(x=>x.parent_system_report == parent.name)" @click="onSelectReport(r)">
                <ion-label>{{ r.report_title }}</ion-label>
            </ion-item>
        </ion-list>
      </div>
    </ion-accordion>  
     
  </ion-accordion-group>  

</template>
<script setup>
import { onMounted, ref } from 'vue';

const emit = defineEmits()
const reportList = ref([])

const t = window.t;

function onSelectReport(r){
    emit("onSelectReport",r)
}
onMounted(async ()=>{
   const l = await app.showLoading("Loading report list...")
    const res = await  app.getApi("epos_restaurant_2023.api.api.get_system_report",{parent:"POS Report"})
    if (res.data){
        reportList.value = res.data
    }
    await l.dismiss()
})
</script>