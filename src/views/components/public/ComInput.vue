<template>
  <template v-if="type == 'numberx'">
    <FloatLabel variant="on">
      <InputNumber inputId="on_label" :placeholder="placeholder" v-model="model" :minFractionDigits="minFractionDigits"
        fluid @focus="onSelectAll" ref="inputRef" />
      <label for="on_label">{{ label }}</label>
    </FloatLabel>

  </template>
  <template v-else-if="type == 'text-area'">

    <ion-textarea @ionInput="onInput" :value="model" :label="label" label-placement="stacked" fill="outline"
      :placeholder="placeholder || label" style="min-height: 120px;">
      <ion-button @click="onOpenKeyboard" fill="clear" slot="end" aria-label="Show/hide">
        <ion-icon slot="icon-only" :icon="keypadOutline" aria-hidden="true"></ion-icon>
      </ion-button>
    </ion-textarea>
  </template>
  <template v-else>
    <ion-input v-bind="$attrs" ref="ionInputRef" 
    :value="model"
     @ionInput="onInput" 
     :type="type"
      :placeholder="placeholder || label" 
      :label="label" @ionChange="onChange"
       :fill="fill" 
       :label-placement="labelPlacement">
      <ion-button v-if="type == 'BarcodeScanerInput'" @click="onScanBarcode" fill="clear" slot="end"
        aria-label="Show/hide">
        <ion-icon slot="icon-only" :icon="scan" aria-hidden="true"></ion-icon>
      </ion-button>
      <ion-button v-if="keyboard" @click="onOpenKeyboard" fill="clear" slot="end" aria-label="Show/hide">
        <ion-icon slot="icon-only" :icon="keypadOutline" aria-hidden="true"></ion-icon>
      </ion-button>
    </ion-input>
  </template>
</template>
<script setup>
import { IonIcon } from '@ionic/vue';
import { keyOutline, keypadOutline, scan } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Keyboard from '@/views/components/public/Keyboard.vue';
import { modalController } from "@ionic/vue";
import FloatLabel from 'primevue/floatlabel';
const ionInputRef = ref(null)
const inputRef = ref(null)


const props = defineProps({
  label: String,
  placeholder: String,
  focus: Boolean,
  keyboard: Boolean,
  fill: {
    type: String,
    default: "outline"
  },
  minFractionDigits: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: "text"
  },
  labelPlacement: {
    type: String,
    default: "stacked"
  }
})

defineOptions({
  inheritAttrs: false
})

const model = defineModel();
const t = window.t;
const emit = defineEmits()
defineExpose({
  focus: () => {

    ionInputRef.value?.$el?.setFocus()
    const nativeInput = ionInputRef.value?.$el?.querySelector('input')
    nativeInput?.select()
  }
})

function onInput($event) {

  if (props.type === "number") {
    model.value = Number($event.detail.value)
  } else {
    model.value = $event.detail.value
  }
  emit("onInput", model.value)
}


function onChange($event) {
  if (props.type === "number") {
    model.value = Number($event.detail.value)
  } else {
    model.value = $event.detail.value
  }
  emit("onChange", model.value)
}

async function onScanBarcode() {
  const result = await app.onScanBarcode();
  if (result) {
    if (props.type == "number") {
      model.value = Number(result)
    }
    model.value = result
    emit("onBarcodeChange")
  }

}

async function onOpenKeyboard(){
  
  // alert("Open Keyboard")
   const modal = await modalController.create({
    component: Keyboard,
  });
  return modal.present();
}


const onSelectAll = (event) => {
  // Wait for next tick to ensure input is focused before selecting
  setTimeout(() => {
    event.target.select();
  }, 0);
};


onMounted(() => {
   
  if (props.focus) {
    setTimeout(function () {

      ionInputRef.value?.$el?.setFocus()
      const nativeInput = ionInputRef.value?.$el?.querySelector('input')
      nativeInput?.select()
    }, 200)
  }


})

</script>