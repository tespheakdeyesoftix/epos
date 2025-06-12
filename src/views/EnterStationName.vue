<template>
    <ion-page>
        <ToolBar>{{ t("Enter Station Name") }}</ToolBar>
        <ion-content>
            <stack>
            <ion-label>Please enter your station name.</ion-label>
        <com-input  ref="stationInputRef"  focus v-model="station_name"  :label="t('Station name')"
            :placeholder="t('Please enter station name')" label-placement="stacked" fill="outline"></com-input>
            <ion-button @click="onSave" size="large" shape="round">Save</ion-button>
            </stack>
            
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';

const station_name = ref("")
const stationInputRef = ref(null)
const t = window.t;

async function onSave(){
    if(!station_name.value){
        app.showWarning("Please enter system name")
        stationInputRef.value.focus()
        return
    }
 

    const res = await app.getDoc("POS Station",station_name.value);
    if(res.data){
        if(res.data.is_used == 1){
            app.utils.showWarningMessage("Confirm","This station name is already used with other device or pc. Please contact your system administrator to get station name.")
        }
        return
    }

    // get setting save to app.setting
    app.setting.station_name = station_name;
    app.setting.pos_profile = res.data.pos_profile
    
    


}
</script>