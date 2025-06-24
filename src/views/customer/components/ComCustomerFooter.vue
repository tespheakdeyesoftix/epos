<template>
    <ion-footer>
        
        <ion-toolbar  >
            <div style="display: flex; justify-content: center;gap: 10px;"> 
            <ion-button  @click="onClose" color="danger"> {{ t('Close') }}</ion-button>
            
            <ComQuickPayButton/>
            <ion-button color="success" @click="onPaymentClick"> {{ t('Edit') }}</ion-button>
            </div>
           
        </ion-toolbar>
    </ion-footer>
</template>
<script setup>
const t = window.t;
function onClose(){
    app.router.back();
}
</script>