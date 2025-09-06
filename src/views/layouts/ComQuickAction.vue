
<template>
    
     
  <ion-button  @click="openPopover($event)"    shape="round">
<ion-icon :icon="addOutline" slot="icon-only" color="danger" />
  </ion-button>
  <ion-popover  :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false" :dismiss-on-select="true">
    <ion-content class="ion-padding">
        <ion-text><strong>{{ t("Quick Action") }}</strong></ion-text>
        <ion-list>
            
             <ion-item lines="full" routerLink="/sale-coupon">
              <ion-icon :icon="giftOutline" slot="start"></ion-icon>
              <ion-label>{{ t("New Sale Coupon") }}</ion-label>
            </ion-item>

            
             <ion-item lines="full" routerLink="/top-up">
              <ion-icon :icon="duplicateOutline" slot="start"></ion-icon>
              <ion-label>{{ t("New Top Up") }}</ion-label>
            </ion-item>
            
            <ion-item lines="full" routerLink="/redeem">
              <ion-icon :icon="cashOutline" slot="start"></ion-icon>
              <ion-label>{{ t("New Redeem") }}</ion-label>
            </ion-item>


        
          </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="js">
import { addOutline, cashOutline, duplicateOutline, giftOutline, scanOutline } from 'ionicons/icons'
import { ref } from 'vue'

const t = window.t

const popoverOpen = ref(false)
const event = ref(null)

function openPopover(e) {
  event.value = e
  popoverOpen.value = true
}
</script>
