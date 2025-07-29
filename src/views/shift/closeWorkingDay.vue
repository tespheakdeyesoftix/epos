<template>
    <ion-page>
        <AppBar>
            {{ t("Close Working Day") }}
        </AppBar>
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
                    <ion-button @click="onCancel" color="danger">{{ t("Cancel") }}</ion-button>
               
                <ion-button :routerLink="'/working-day-detail/' + doc.name" >{{ t("View Working Day Detail") }}</ion-button>
                <ion-button @click="onCloseWorkingDay" color="success">{{ t("Close Working Day") }}</ion-button> 
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
    name:app.setting.working_day.name,
    posting_date: dayjs().format("YYYY-MM-DD"),
    pos_profile: app.setting.pos_profile.name,
    note: ""
})


async function onCloseWorkingDay(){
   
 
    const result = await app.onConfirm("Close Working Day","Are you sure you want to close working day.")
    if(!result) return 
    const loading = await app.showLoading();
    const res = await app.setValue("Working Day",app.setting.working_day.name,{
    is_closed : 1,
    close_pos_profile: app.setting.pos_profile.name,
    closed_note: doc.note,
    closed_date: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
    if(res.data){
        app.setting.working_day = ""
        isWorkingDayOpened.value = false;
         // get print 
       await printReport()

        app.ionRouter.navigate('/working-day-detail/' + res.data.name, 'push', 'replace');
    }
    await loading.dismiss()
}

async function printReport() {
       const printSettings = app.setting.pos_config?.print_settings.filter(x=>x.print_type=="Working Day") || []
       for (const p of printSettings) {
            await app.printing.onPrint({
            doctype: "Working Day",
            docname: doc.value.name,
            template: p.print_template,
            printer_name: p.printer_name,
            lang: p.lang,
            copy: p.copies,
            show_loading: false
            });
        }
        

        }

function onCancel(){
     app.ionRouter.navigate('/home', 'back', 'replace');
}
</script>