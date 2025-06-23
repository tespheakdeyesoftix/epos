<template>
    <ion-footer>
        
        <ion-toolbar  >
            <div style="display: flex; justify-content: center;gap: 10px;"> 
            <ion-button routerLink="/customer"> {{ t('Close') }}</ion-button>
            
            
            <ComQuickPayButton/>
            <ion-button color="success" @click="onPaymentClick"> {{ t('Edit') }}</ion-button>
            </div>
           
        </ion-toolbar>
    </ion-footer>
</template>
<script setup>
const t = window.t;
</script>