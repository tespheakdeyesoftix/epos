<template>
    <BaseModal :title="t('Discount Amount')" @onConfirm="onConfirm">
        <stack gap="20px">
            <com-input v-model="discount" keyboard label="Discount Amount" type="number" focus></com-input>
            <com-input v-model="note" type="text-area" label="Discount Note" />
        </stack>

    </BaseModal>
</template>
<script setup>
import { ref } from 'vue';

import { modalController } from '@ionic/vue';
const props = defineProps({
    checkRequireNoteKey: String
})


const discount = ref(0)
const note = ref("")
const t = window.t;
function onConfirm() {
    if (Number(discount.value) == 0) {
        app.showWarning("Please enter discount amount")
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
        discount: discount.value,
        note: note.value
    }, 'confirm');

}
</script>