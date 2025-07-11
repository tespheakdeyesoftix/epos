<template>
    <BaseModal :title="t('Print Preview')" :hideFooter="false">
        <template #end>
            <ion-button size="large" shape="round" @click="onReloadData">
                <ion-icon :icon="refreshOutline"></ion-icon>
            </ion-button>
        </template>
            <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

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
import { refreshOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

const t = window.t;
const props = defineProps({
    doctype:String,
    docname:String,
    template:String,
    lang:String,
    printer_name:String
})

const data =ref()

const targetRef = ref(null);
async function getData(){
    const res = await app.getApi("epos_restaurant_2023.api.printing.get_print_data",{
        doctype:props.doctype,
        docname:props.docname,
        template:props.template,
        return_type:"html",
        lang:props.lang || "en",
        printer_name:String

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
 
    app.printing.onPrint( {...props,  show_loading:true}    )
}
function onDownloadPDF(){
   
    app.printing.downloadPdf(props)
}


async function onReloadData(){
      const l = await app.showLoading()
    await getData()
    await l.dismiss();
}
const onRefreshData = async (event) => {
   await getData()
    event.target.complete();

};


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