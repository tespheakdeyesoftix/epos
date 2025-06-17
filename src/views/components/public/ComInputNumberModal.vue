<template>
    <BaseModal :title="t(title || 'Enter Number')" @onConfirm="onConfirm">
        <stack gap="20px">
            <com-input v-model="inputNumber" keyboard :label="label" type="number" focus></com-input>
            <com-input v-model="note" type="text-area" :label="noteLabel" :storageKey="storageKey" />
        </stack>

    </BaseModal>
</template>
<script setup>
import { ref } from 'vue';

import { modalController } from '@ionic/vue';
const props = defineProps({
    title:String,
    required:Boolean,
    checkRequireNoteKey: String,
    requiredMessage:String,
    storageKey:String,
    label:{
        type:String,
        default:"Enter Number",
    },
    noteLabel:{
        type:String,
        default:"Enter Note"
    }
})


const inputNumber = ref(0)
const note = ref("")
const t = window.t;
function onConfirm() {
    if (props.required && Number(inputNumber.value) == 0) {
        app.showWarning(props.requiredMessage)
        return;
    }

    if (props.checkRequireNoteKey) {
        if (app.setting.pos_config[props.checkRequireNoteKey] == 1) {
            if (!note.value) {
                app.showWarning("Please enter note");
                return;
            }
        }
    }


    modalController.dismiss({
        inputNumber: inputNumber.value,
        note: note.value
    }, 'confirm');

}
</script>