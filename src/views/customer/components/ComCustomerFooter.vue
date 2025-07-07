<template> 
  <ion-footer>
    <ion-toolbar>
      <div style="display: flex; justify-content: center; gap: 10px;"> 
        <ion-button @click="onClose" color="danger"> {{ t('Close') }}</ion-button>
        <ComQuickPayButton/>
        <ion-button color="success" @click="onEdit"> {{ t('Edit') }}</ion-button>
        <ion-button color="danger" @click="onDelete">{{ t("Delete") }}</ion-button>  
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup>
import { ref } from 'vue'
import { modalController } from '@ionic/vue'
import ComEditCustomer from '@/views/customer/components/ComEditCustomer.vue'  
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
   const result =await app.utils.onAddCustomer(props.data.name);
     
   if(result){
        const l = await app.showLoading();
         emit('reload');
        await l.dismiss();
   }
}
async function onDelete(){
  const confirm = await app.utils.onConfirm("Delete Customer", "Are you sure you want to delete this customer?");
  if (!confirm) return;
  const l = await app.showLoading();
  const res = await app.deleteDoc("Customer", props.data.name);  
  if (res.data) {
    await onRefresh();
    app.ionRouter.navigate("/customer", "back", "replace");
  }

  await l.dismiss();
}
 
</script>
