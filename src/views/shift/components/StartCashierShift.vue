<template>
    <ion-page>
        <ToolBar>{{ t("Start Cashier Shift") }}</ToolBar>
        <ion-content class="ion-padding">
            <div class="fix-container">
                <stack gap="20px">
                    <stack row equal>
                        <com-input v-model="workingDay.name" readonly :label="t('Working Day Number')"></com-input>
                        <com-input v-model="workingDay.working_date" readonly :label="t('Working Date')"></com-input>
                    </stack>
                    <stack row equal>
                        <com-input v-model="workingDay.pos_profile" readonly :label="t('POS Profile')"></com-input>
                        <ComSelectInput docType="Shift Type" v-model="doc.shift_name" :label="t('Shift')"  :placeholder="t('Shift')"/>
                    </stack>
                </stack>
                <ion-text color="primary">
                    <h4>{{ t("Cash Float") }}</h4>
                </ion-text>
                <ion-grid>
                    <ion-row>
                        <ion-col size="6" v-for="pt in payment_type">
                            <com-input :label="t(pt.payment_type)" v-model="pt.input_amount" type="number" keyboard></com-input>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <ion-text color="primary">
                                <h4>{{ t('Total Cash Float') }}:
                                    <ComCurrency :value="totalCashFloat" />
                                </h4>
                            </ion-text>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <com-input v-model="doc.opened_note" type="text-area" :label="t('Open shift note')"
                                keyboard />
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <div style="display: flex; justify-content: center;gap:10px">
                   
                    <ion-button @click="onCancel" color="danger" shape="round">{{ t("Cancel") }}</ion-button>
                     <ion-button @click="onStartCashierShift" shape="round" color="success">{{ t("Start Cashier Shift")
                        }}</ion-button>
                </div>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script setup>
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { useApp } from '@/hooks/useApp';
const { isCashierShiftOpened } = useApp();

const payment_type = ref(app.setting.pos_config?.payment_type.filter(x => x.allow_cash_float == 1));
const t = window.t;
const workingDay = ref(app.setting.working_day);
workingDay.value.working_date = dayjs(workingDay.value.posting_date).format('DD/MM/YYYY')

const doc = ref({
    working_day: workingDay.value.name,
    pos_profile: workingDay.value.pos_profile,
    posting_date: workingDay.value.posting_date,
    pos_station_opened: app.station_name

})

const totalCashFloat = computed(() => {
    return payment_type?.value.reduce((sum, item) => sum + (item.input_amount || 0) / item.exchange_rate, 0);
})

function onCancel() {
    app.ionRouter.navigate("/home", "back", "replace");

}

async function onStartCashierShift() {
    if (!doc.value.shift_name) {
        app.showWarning("Please select shift name")
        return;
    }

    //validate shift name already open and close
    let res = await app.getDocList("Cashier Shift", {
        filters: [
            ["working_day", "=", doc.value.working_day],
            ["shift_name", "=", doc.value.shift_name],
            ["pos_profile", "=", doc.value.pos_profile]
        ]
    })
    let confirm = false
    if (res.data.length>0) {
        confirm = await app.onConfirm("Warning", t("shift_already_opened",{shift_name:t(doc.value.shift_name)}))
    }
    else {
        confirm = await app.onConfirm("Start Cashier Shift", "Are you sure you want start cashier shift?")
    }
    if (!confirm) return;

    const l = await app.showLoading();
    doc.value.cash_float = payment_type.value.filter(x => x.input_amount > 0);
    doc.value.cash_float.forEach(x => {
        x.payment_method = x.payment_type
    });
 

    res = await app.createDoc("Cashier Shift", doc.value);
    if (res.data) {
        app.setting.cashier_shift = res.data
        isCashierShiftOpened.value = true;
        
        if(app.route.query.return_url){
           
            app.ionRouter.navigate(app.route.query.return_url, "forward", "replace")
        }
        else {
            app.ionRouter.navigate("/home", "back", "replace")
        }
    }

    await l.dismiss();

}
</script>