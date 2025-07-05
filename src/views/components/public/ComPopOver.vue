<template>
  <span @click="openPopover($event)">
    <slot>
      <ion-button>Open</ion-button>
    </slot>
  </span>
  <ion-popover
     :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false"
      :dismiss-on-select="true"
  >
    <ion-content class="ion-padding">
      <slot name="content" :close="closePopover">
        Hello World!
      </slot>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const popoverOpen = ref(false)
const event = ref<null | Event>(null)
 
function closePopover(){
  popoverOpen.value = false
}
 // methods
function openPopover(e: Event) {
  event.value = e
  popoverOpen.value = true
}

</script>
