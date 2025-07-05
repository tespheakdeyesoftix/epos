<template>
    <BaseModal :title="t('Print Preview')" :hideFooter="false">
        <div class="container" ref="targetRef">
            <div v-html="data" />
        </div>
        <template #footer>
           <ion-toolbar>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <ion-button>{{ t("Print") }}</ion-button>
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
    template:String
})

const data =ref()
const targetRef = ref(null);
async function getData(){
    const res = await app.getApi("epos_restaurant_2023.api.printing.get_print_data",{
        doctype:props.doctype,
        docname:props.docname,
        template:props.template,
        return_type:"html"
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