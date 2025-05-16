<template>
<ion-page>
<ToolBar>{{ t("Sale Detail") }}</ToolBar>
<ion-content class="ion-padding">
sale dtail
{{ doc }}
</ion-content>
</ion-page>


</template>
<script setup>
import { onMounted, ref } from 'vue';


const t = window.t;
const doc = ref()

async function loadData(){
    const l = await app.showLoading()
    const res = await app.getDoc("Sale",app.route.params.name)
    if(res.data){
        doc.value = res.data
    }
    await l.dismiss();

}
onMounted(async ()=>{
await loadData()
})

</script>