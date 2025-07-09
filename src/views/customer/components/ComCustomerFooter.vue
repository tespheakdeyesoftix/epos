<template> 
  <ion-footer>
    <ion-toolbar>
      <div style="display: flex; justify-content: center; gap: 10px;"> 
        <ion-button @click="onClose" color="danger"> {{ t('Close') }}</ion-button>
        <ComQuickPayButton/>
        <ion-button color="success" @click="onEdit"> {{ t('Edit') }}</ion-button>
        <ion-button color="danger" @click="onDelete">{{ t("Delete") }}</ion-button>  
        <ComUploadPhoto ref="uploadRef"  
          :customerName="props.data?.name"
          @uploaded="$emit('reload')"/>
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup>
import { ref } from 'vue'
import { modalController } from '@ionic/vue'
import ComUploadPhoto from '@/views/customer/components/ComUploadPhoto.vue'
const t = window.t;
const uploadRef = ref(null)
defineExpose({ uploadRef }) 

 
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
    app.showSuccess("Delete record successfully")
    if(window.history.length<=1){
        app.router.back()
    }else {  
        app.ionRouter.navigate(window.fromRoute, "forward","replace")
    }
    window.reloadData = true
  }
  // if (res.data) {
     
  //   app.ionRouter.navigate("/customer", "back", "replace");
  // }

  await l.dismiss();
}
 
</script>
