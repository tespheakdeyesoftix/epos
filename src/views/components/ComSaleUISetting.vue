<template>
<BaseModal :title="t('Setting')" @onConfirm="onConfirm">
    {{ userPreference }}  
    <ion-label>{{t("Product Width")}}</ion-label>
    <ion-range
    
    :min="2"
    :max="12"
    
    v-model="userPreference.sale_ui_setting.product_columns"
    :ticks="true"
    :snaps="true"
  ></ion-range>

   <ion-label>{{t("Product Height")}}</ion-label>
  <ion-range
    aria-label="Custom range"
    :min="100"
    :max="300"
    :value="userPreference.sale_ui_setting.product_card_height"
    v-model="userPreference.sale_ui_setting.product_card_height"
    
    :ticks="true"
    :snaps="true"
  
  ></ion-range>

    <ion-label>{{t("Product Container Width")}}</ion-label>
  <ion-range
    aria-label="Custom range"
    :min="30"
    :max="75"
    :value="userPreference.sale_ui_setting.product_container_width"
    v-model="userPreference.sale_ui_setting.product_container_width"
    
    :ticks="true"
    :snaps="true"
 
  ></ion-range>
  <ion-label>{{t("Font Size")}}</ion-label>
  <ion-range
    aria-label="Custom range"
    :min="14"
    :max="75"
    :value="userPreference.sale_ui_setting.product_font_size"
    v-model="userPreference.sale_ui_setting.product_font_size"
    :ticks="true"
    :snaps="true"
 
  ></ion-range>

  <!-- {{ setting }} -->



</BaseModal>

</template>
<script setup>
import { useApp } from '@/hooks/useApp';
import { IonRange } from '@ionic/vue';
  import { modalController } from '@ionic/vue';
 
    const t = window.t;
const {userPreference} = useApp()
 
 
 

async function onConfirm(){
 
   modalController.dismiss(userPreference, 'confirm')
    
}
 
</script>