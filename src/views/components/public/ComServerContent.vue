<template>
    <div ref="targetRef">
  
        <div v-if="loading" style="height: 70vh; display: flex; justify-content: center; align-items: center;">
        <ion-spinner name="crescent"></ion-spinner>
        </div>

        <div v-html="html" v-else>

        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

    const props = defineProps({
        options:Object,
    })

const loading = ref(true)
    const html = ref()
    
const targetRef = ref(null);
async function getData(){
    let lang = await app.storageService.getItem("lang")
    if(lang=="kh") lang = "km"

    const res = await app.getApi("epos_restaurant_2023.api.printing.get_print_data",{
        doctype:props.options.doctype,
        docname:props.options.docname,
        template:props.options.template,
        return_type:"html",
        lang:lang || "en",
        options:props.options.options

    })
    if(res.data){
        html.value = res.data.html;

        const cssText = res.data.css || ""

        const style = document.createElement('style');
        style.innerText = cssText;

        if (targetRef.value) {
        targetRef.value.appendChild(style);
        }

    }
}
onMounted(async ()=>{
    setTimeout(async () => {
  
    await getData();
    loading.value = false;    
    }, 1000);
    
})
</script>