<template>
    <div class="error-container">
        <ion-icon :icon="icon || documentTextOutline" class="error-icon"></ion-icon>

        <h2 class="error-title">{{  title }}</h2>
        <p class="error-message">
          {{ message }}
        </p>

        <div class="button-group">
          <ion-button v-for="(d,index) in actions" :key="index" :color="d.color"  @click="openRoute(d.router_link)">
                    {{ d.title }}
                </ion-button>
        </div>
      </div>

</template>
<script setup>
import { documentTextOutline } from 'ionicons/icons';

const t = window.t;
function openRoute(url){
    app.ionRouter.navigate(url,"forward","push")
}
const props = defineProps({
    icon:Object,
    title:String,
    message:String,
    actions:Object
})

</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.error-icon {
  font-size: 64px;

  margin-bottom: 16px;
}

.error-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.error-message {
  font-size: 16px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
  max-width: 500px;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>