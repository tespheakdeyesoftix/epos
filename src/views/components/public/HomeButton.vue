<template>
 
    <ion-button  expand="full" shape="round" @click="click" :color="color" class="w-full">
            
      <div class="flex flex-column justify-center align-items-center py-2">
                    <div class="mb-2" v-if="svg" v-html="svg" style="height: 50px;width: 50px;"></div>
                    <ion-icon v-else style="height: 50px;width: 50px;" class="mb-2" :icon="icon" slot="start"></ion-icon>
                  <ion-label><slot>Button</slot></ion-label>
                </div>
              </ion-button>
</template>
<script setup>
const props=defineProps({
    color:String,
    icon:String,
    svg:Object
})
const emit=defineEmits();
function onClick(){
    emit("click");
} 
</script>
<style scoped>
ion-button {
  --border-radius: 1rem;
  font-weight: bold;
  height: 7rem;
}
</style>