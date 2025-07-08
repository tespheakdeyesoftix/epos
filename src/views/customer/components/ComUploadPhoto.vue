<template>
     <ion-button color="primary" @click="test">{{ t("Upload Photo") }}</ion-button> 
     <ion-button color="primary" >{{ t("Take Photo") }}</ion-button> 
</template>
<script setup>
const t = window.t;

function test(){
    alert('test')
}
</script>