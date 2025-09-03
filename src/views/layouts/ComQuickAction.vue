
<template>
    
     
  <ion-button  @click="openPopover($event)"    shape="round">
<ion-icon :icon="addOutline" slot="icon-only" color="danger" />
  </ion-button>
  <ion-popover  :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false" :dismiss-on-select="true">
    <ion-content class="ion-padding">
        <ion-text><strong>{{ t("Quick Action") }}</strong></ion-text>
        <ion-list>
            <item :icon="giftOutline" label="New Sale Coupon" url="/sale-coupon"/>
            <item :icon="duplicateOutline" label="New Top Up" url="/top-up"/>
            <item :icon="cashOutline" label="New Redeem" url="/redeem"/>
        </ion-list>
    </ion-content>
  </ion-popover>
</template>
<script setup lang="tsx">
import { addOutline,cashOutline,duplicateOutline,giftOutline,scanOutline } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';
const t = window.t;

const popoverOpen = ref(false);
const event = ref<null | Event>(null);

function openPopover(e: Event) {
  event.value = e;
  popoverOpen.value = true;
}

const item = defineComponent({
  props: {
    icon: {
      type: [Object, String],
      required: true
    },
    label: String,
    url: String
  },
  setup(props) {
    return () => (
      <ion-item lines="full" routerLink={props.url}>
        <ion-icon icon={props.icon} slot="start"></ion-icon>
        <ion-label>{(props.label)}</ion-label>
      </ion-item>
    )
  }
})


</script>
