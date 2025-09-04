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
      <ion-button v-if="keyboard && plateform == 'desktop'" @click="onOpenKeyboard" fill="clear" slot="end"
        aria-label="Show/hide">
        <ion-icon slot="icon-only" :icon="keypadOutline" aria-hidden="true"></ion-icon>
      </ion-button>
    </ion-textarea>
  </template>
  <template v-else-if="type == 'date'">
    <FloatLabel variant="on">
      <DatePicker style="height:55px" dateFormat="dd/mm/yy" size="large" v-model="model" inputId="in_label" showIcon
        iconDisplay="input" variant="filled" class="w-full" />
      <label for="in_label">{{ label }}</label>
    </FloatLabel>


  </template>
  <template v-else>
    <ion-input v-bind="$attrs" ref="ionInputRef" :value="model"  :type="type"
      :placeholder="placeholder || label" 
      :label="model?label:''" 
      @ionInput="onInput"
      @ionChange="onChange" 
      :fill="fill" 
      :clear-input="clear"
      :label-placement="labelPlacement">

      <ion-button v-if="icon && plateform === 'desktop'" fill="clear" slot="end" aria-label="Show/hide">
        <ion-icon slot="icon-only" :icon="scan" aria-hidden="true"></ion-icon>
      </ion-button>
      <ion-button v-if="icon && plateform === 'mobile'" fill="clear" slot="end" aria-label="Show/hide" @click="onIconClick">
        <ion-icon slot="icon-only" :icon="scan" aria-hidden="true"></ion-icon>
      </ion-button>

      <ion-button v-if="type == 'BarcodeScanerInput'" @click="onScanBarcode" fill="clear" slot="end"
        aria-label="Show/hide">
        <ion-icon slot="icon-only" :icon="scan" aria-hidden="true"></ion-icon>
      </ion-button>
       

      <ion-button v-if="keyboard && plateform == 'desktop'" @click="onOpenKeyboard" fill="clear" slot="end"
        aria-label="Show/hide">
        <ion-icon slot="icon-only" :icon="keypadOutline" aria-hidden="true"></ion-icon>
      </ion-button>
    </ion-input>
  </template>
</template>
<script setup>
import { IonIcon } from '@ionic/vue';
import { keypadOutline, scan } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { IonTextarea } from '@ionic/vue';
import InputNumber from 'primevue/inputnumber';

import DatePicker from 'primevue/datepicker';

import FloatLabel from 'primevue/floatlabel';
const ionInputRef = ref(null)
const inputRef = ref(null)
const plateform = app.utils.getPlateform();

async function onIconClick() {
  const result = await app.onScanBarcode()
  if (result) {
    if (props.type === "number") {
      model.value = Number(result)
    } else {
      model.value = result
    }
    
    // Simulate the same trigger as typing then pressing enter
    emit("change", model.value)
    emit("onBarcodeChange", model.value)
  }
}



const props = defineProps({
  label: String,
  placeholder: String,
  focus: Boolean,
  keyboard: Boolean,
  icon: Object,
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
  },

  clear: {
    type: Boolean,
    default: false
  },


  storageKey: String
})

defineOptions({
  inheritAttrs: false
})

const model = defineModel();
const value = defineModel("value");
const t = window.t;
const emit = defineEmits()
defineExpose({
  focus: () => {

    ionInputRef.value?.$el?.setFocus()
    const nativeInput = ionInputRef.value?.$el?.querySelector('input')
    nativeInput?.select()
  },
  select: () => {

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
 
  emit("onChange", $event.detail.value)
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
 

async function onOpenKeyboard() {
  if (props.type == "number") {
    const result = await app.utils.onOpenKeypad()
    if (result) {
      model.value = result;
      emit("onChange", model.value)
    }
  } else {
    const result = await app.utils.onOpenKeyboard({
      title: props.placeholder || props.label,
      defaultValue: model.value,
      storageKey: props.storageKey
    })
    if (result) {
      model.value = result;
      emit("onChange", model.value)
    }

  }


}


const onSelectAll = (event) => {
  // Wait for next tick to ensure input is focused before selecting
  setTimeout(() => {
    event.target.select();
  }, 0);
};


onMounted(async () => {
  if (props.focus && plateform === "desktop") {
    setTimeout(() => {
      ionInputRef.value?.$el?.setFocus();
      const nativeInput = ionInputRef.value?.$el?.querySelector('input');
      nativeInput?.select();
    }, 200);
  } 
  

  if (value.value) {
    if (props.type === "number") {
      model.value = Number(value.value);
    } else {
      model.value = value.value;
    }
  }
});


</script>