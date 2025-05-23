<template>
  <div @click.stop="openSheetModal" :class="csClass" style="display: inline;" v-if="!loading">
    <slot>
      <ion-chip v-bind="$attrs" :color="selected?'secondary':''">
        <ion-label>{{ getLabel() }}</ion-label>
        <ion-icon v-if="model && clear" :icon="close" @click.stop="onClear"></ion-icon>
      </ion-chip>
    </slot>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, useSlots } from "vue"
import { modalController } from '@ionic/vue';
import ComSelectSheetModal from '@/views/components/ComSelectSheetModal.vue';
import { close } from 'ionicons/icons';
const t = window.t;
const loading = ref(false)

const props = defineProps({
  docType: String,
  options: Object,
  label: String,
  filters: Object,
  valueField: {
    type: String,
    default: "name"
  },
  csClass: {
    type: String,
    default: ""
  },
  labelField: {
    type: String,
    default: "name"
  },
  multiple: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: "chip"//chip, button,....add more if needed
  },
  clear: {
    type: Boolean,
    default: true
  },
  selectedColor: {
    type: String,
    default: "warning"
  },

  modalType: {
    modalType: String,
    default: "dialog"
  },

  labelPrefix: String,
  selectedValues: Object,//for multiple select send  array string 
  selectedValue: String,// for single select string only
  selected: Object // Array of object eg. [{name:'123', label:'Label 1'}]

})

const emit = defineEmits()

defineExpose({
  onClear
})

const meta = ref()
const selected = ref()
const slots = useSlots();
const model = defineModel()
const value = defineModel("value")

const hasDefaultSlot = ref(slots.default);



defineOptions({
  inheritAttrs: false
})



const isSelected = computed(() => {
  if (props.multiple) {
    return selected.value && selected.value.length > 0;
  }
  else {
    return selected;
  }
})
let isOpenModal = false
const openSheetModal = async () => {
  if (isOpenModal) return
  isOpenModal = true
  //end prevent double fire click
  JSON.stringify(props.options)
  const modalOption = {
    component: ComSelectSheetModal,
    swipeToClose: false,
    componentProps: { ...props, title: props.label || props.docType, selectedValue: selected.value ? selected.value[props.valueField] : "", selected: selected.value }
  }


  if (props.modalType == "sheet_modal") {

    modalOption.initialBreakpoint = 0.65,
      modalOption.breakpoints = [0, 0.5, 0.65, 0.75, 0.95]
  }


  const modal = await modalController.create(modalOption);
  await modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {

    selected.value = data;
    if (props.multiple) {
      model.value = data;
      value.value = data.map(r => r.name)
    }
    else {
      model.value = data.name;
      value.value = data.name;
    }

    emit("onSelected", data)
  }
  isOpenModal = false
};

function getLabel() {
  if (selected.value) {
    if (!props.multiple) {
      
      if (meta?.value?.title_field) return selected.value[meta?.value.title_field];
      if (selected.value.label) return selected.value.label
      if (props.labelField) return selected.value[props.labelField];


   
      return selected.value.label || selected.value.name;

    }

    if (Array.isArray(selected.value) && selected.value.length > 0) {

      if (selected.value.length == 1) {
        if (meta?.value?.title_field) return selected.value[0][meta?.value.title_field];

        if (props.labelField) return selected.value[0][props.labelField];
        return selected.value[0].name;

      } else {
        return `${selected.value.length} ${(props.label || props.docType)}s`;
      }
    }
  }

 
  return t(props.label || props.docType)

}

function onClear() {

  selected.value = null;
  model.value = null
  value.value = null
  emit("onClear");
}
onMounted(async () => {
  if (props.docType) {
    loading.value = true
    meta.value = await app.getMeta(props.docType)
    loading.value = false
  }


})
</script>

<style scoped>
ion-modal {
  --border-radius: 10px;
  padding-left: 15px;
  padding-right: 15px;
  background: red;
}

ion-modal.auto-height::part(content) {
  position: relative;
  --varPer: 50%;
  bottom: 0px;
  height: var(--varPer);
  top: calc(var(--varPer) / 2);
}
</style>