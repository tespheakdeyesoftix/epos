<template>
    <BaseModal :title ="title">
        <ion-list  >
          <ion-item :button="true" :detail="false" @click="onConfirm(d.name)" v-for="(d,index) in data" :key="index" >
            <ion-label>{{ d.name }}</ion-label>
          </ion-item>
           
        </ion-list>
    </BaseModal>
</template>
<script setup>
  import { modalController } from '@ionic/vue';
const props = defineProps({
    title:String,
    data:Object
})
function onConfirm(name){
    modalController.dismiss(name,"confirm");
}
</script>