<template> 
  <ion-footer>
    <ion-toolbar>
      <div style="display: flex; justify-content: center; gap: 10px;"> 
        <ion-button @click="onClose" color="danger"> {{ t('Close') }}</ion-button>
        <ComQuickPayButton/>
        <ion-button color="success" @click="onEdit"> {{ t('Edit') }}</ion-button>
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup>
import { modalController } from '@ionic/vue'
import ComEditCustomer from '@/views/customer/components/ComEditCustomer.vue'  
const t = window.t;

const props = defineProps({
  data: Object
})

const emit = defineEmits(['reload'])

function onClose(){
  app.router.back();
}

async function onEdit() {
  const modal = await modalController.create({
    component: ComEditCustomer,
    cssClass: 'edit-customer-modal',
    componentProps: {
      customerData: props.data
    }
  });

  await modal.present();

  const { data, role } = await modal.onDidDismiss();

  if (role === 'confirm' && data) {
    
    emit('reload');   
  }
}
</script>
