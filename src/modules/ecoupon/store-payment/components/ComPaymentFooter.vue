<template> 
  <ion-footer>
    <ion-toolbar>
      <div style="display: flex; justify-content: center; gap: 10px;"> 
        <ion-button @click="onClose" color="danger"> {{ t('Close') }}</ion-button>
        <!-- <ComQuickPayButton/> -->
        <ion-button color="success" @click="onEdit"> {{ t('Edit') }}</ion-button>
        <ion-button color="danger" @click="onDelete">{{ t("Delete") }}</ion-button>  
        
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup>
import { ref } from 'vue'
 import ComAddPayment from "@/modules/ecoupon/store-payment/ComAddPayment.vue"; 
const t = window.t;
 
const docListRef = ref(null)
 

 
const props = defineProps({
  data: Object
})

const emit = defineEmits(['reload'])

function onClose(){
  app.router.back();
}

async function onEdit(){
   const modal = await app.openModal({

    component: ComAddPayment,
    componentProps:{
        docname:props.data.name,
        docListRef:docListRef
    },
    cssClass:"store-payment-modal"
    
  })
}
async function onDelete(){
  const confirm = await app.utils.onConfirm("Delete Store Payment", "Are you sure you want to delete this Store Payment?",{background:"danger"});
  if (!confirm) return;
  const l = await app.showLoading();
  const res = await app.deleteDoc("Store Payment", props.data.name);  
  if (res.data) {
     
    app.ionRouter.navigate("/store-payment-list", "back", "replace");
  }

  await l.dismiss();
}
 
</script>
