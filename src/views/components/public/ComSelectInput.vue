<template>
    <div style="position:relative">
    <ComSelect :docType="docType" clear v-model="model" modalType="Dialog">
        <ion-button style="position: absolute;  right: 0px;top:5px;z-index: 999999999"  v-if="model"   @click.stop="onClear($event)" fill="clear" aria-label="Show/hide">
                <ion-icon slot="icon-only" :icon="closeOutline" aria-hidden="true"></ion-icon>
            </ion-button>
            <ion-icon  style="position: absolute;  right: 12px;top:20px;z-index: 999999999"  v-if="!model"   :icon="chevronDownOutline"></ion-icon>
            <ion-input v-bind="$attrs"  :value="model" readonly
                label-placement="floating" fill="outline">
                
            </ion-input>
        
        
    </ComSelect>

</div>
</template>
<script setup>
import { IonIcon } from '@ionic/vue';
import { ref } from 'vue';
import { chevronDownOutline, closeOutline } from 'ionicons/icons';
const ionInputRef = ref(null)


const props = defineProps({
    docType: String,
    filters: {
        type: Object,
        default: []
    }
}
)



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

function onClear(event) {
  event.stopPropagation(); // <-- prevent event bubbling manually
  model.value = null; // or whatever logic you use to clear
}



</script>