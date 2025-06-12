<template>
    <slot :data="model">
          {{ model }}
    </slot>
</template>
<script setup>
import { getApi,getDocList,getDoc } from "@/services/api-service"
import {onMounted, ref,watch} from "vue"
 
const props = defineProps({
    doctype:String,
    apiUrl:String,
    params:Object,
    docName:String
})

const model = defineModel()
 
watch(() => props.params, async (newVal, oldVal) => {
 
 await loadData()
},{ deep: true })

async function getDocListData(){
   
    const res = await getDocList(props.doctype,props.params)
    if(res.data){
        model.value = res.data
    }
}
async function getApiData(){
    const res = await getApi(props.apiUrl, props.params)
    if(res.data){
        model.value = res.data
    }
}


async function loadData(){
  
    if(props.doctype && props.docName){
        const res = await getDoc(props.doctype, props.docName)
        if(res.data){
            model.value = res.data
        }
        
        return;
    }
 
    if(props.doctype){
        await getDocListData()
    }else {
        await getApiData()
    }
}

 
defineExpose({
    loadData,
    
})
 

onMounted(async ()=>{
    await loadData()
})

</script>