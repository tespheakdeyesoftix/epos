<template>
    <BaseModal :title="t('Print Preview')" :hideFooter="false">
        <div class="container" ref="targetRef">
            <div v-html="data" />
        </div>
        <template #footer>
           <ion-toolbar>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <ion-button @click="onPrint">{{ t("Print") }}</ion-button>
                <ion-button @click="onDownloadPDF">{{ t("Download PDF") }}</ion-button>
            </div>
        </ion-toolbar>
        </template>
    </BaseModal>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const t = window.t;
const props = defineProps({
    doctype:String,
    docname:String,
    template:String,
    lang:String,
})

const data =ref()

const targetRef = ref(null);
async function getData(){
    const res = await app.getApi("epos_restaurant_2023.api.printing.get_print_data",{
        doctype:props.doctype,
        docname:props.docname,
        template:props.template,
        return_type:"html",
        lang:props.lang || "en"

    })
    if(res.data){
        data.value = res.data.html;

        const cssText = res.data.css

        const style = document.createElement('style');
        style.innerText = cssText;

        if (targetRef.value) {
        targetRef.value.appendChild(style);
        }

    }
}

function onPrint(){
      const printer = app.storageService.getItem("cashierShiftPrinter")
   
    app.printing.onPrint(props.doctype,props.docname, props.template,printer)
}
function onDownloadPDF(){
   
    app.printing.downloadPdf(props.doctype,props.docname, props.template)
}


onMounted(async ()=>{
    const l = await app.showLoading()
    await getData()
    await l.dismiss();
})


</script>
<style scoped>
.container{
	max-width: 580px; width: 100%;  margin: 0 auto; 
    
}
 
</style>