<template>
    <ion-page>
        <ToolBar>
            {{ t("Start Working Day") }}
        </ToolBar>
        <ion-content class="ion-padding">
            <div style=" max-width: 1024px; width: 100%;  margin: 0 auto;  padding: 0 16px;">
                <stack gap="20px"> 
                    <stack row equal gap="20px">
                        <com-input v-model="posting_date" :label="t('Working Date')" readonly />
                        <com-input v-model="doc.pos_profile" :label="t('POS Profile')" readonly />
                    </stack> 
                    <com-input v-model="doc.note" :label="t('Note')" type="text-area" />
                </stack>
            </div>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <div style=" display: flex;justify-content: center;gap: 10px;">
                    <ion-button @click="onStartWorkingDay">{{ t("Start Working Day") }}</ion-button>
                    <ion-button @click="onCancel" color="danger">{{ t("Cancel") }}</ion-button>
                </div>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script setup>

import dayjs from 'dayjs';
import { ref } from 'vue';
import { useApp } from '@/hooks/useApp';
const { isWorkingDayOpened } = useApp();
const t = window.t;
const posting_date = ref(dayjs().format("DD/MM/YYYY"))
const doc = ref({
    posting_date: dayjs().format("YYYY-MM-DD"),
    pos_profile: app.setting.pos_profile.name,
    note: ""
})


async function onStartWorkingDay(){
    const result = await app.onConfirm("Start Working Day","Are you sure you want to start working day.")
    if(!result) return 
    const loading = await app.showLoading();
    const res = await app.createDoc("Working Day",doc.value);
    if(res.data){
        app.setting.working_day = res.data
        isWorkingDayOpened.value = true;
        app.ionRouter.navigate('/home', 'back', 'replace');
    }
    await loading.dismiss()
}
function onCancel(){
     app.ionRouter.navigate('/home', 'back', 'replace');
}
</script>