<template>
    <ion-page>
        <ToolBar>{{ t("Enter Station Name") }}</ToolBar>
        <ion-content class="ion-padding">
            <stack class="fix-container flex">
                <ion-label>{{t("Please enter your station name.")}}</ion-label>
                <com-input  ref="stationInputRef"  focus v-model="station_name"  :label="t('Station name')"
                    :placeholder="t('Please enter station name')" label-placement="stacked" fill="outline"></com-input>
                    <ion-button @click="onSave" size="default" shape="round">{{ t("Save") }}</ion-button>
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
    const loading = await app.showLoading();
    if(!station_name.value){
        app.showWarning("Please enter system name")
        stationInputRef.value.focus()
        await loading.dismiss();
        return
    }
 

    const res = await app.getDoc("POS Station",station_name.value);
     

    if(res.data){
        if(res.data.is_used == 1){
            app.utils.showWarningMessage("Confirm","This station name is already used with other device or pc. Please contact your system administrator to get station name.")
         await loading.dismiss();
            return
        }
      
    
    
 
    app.setting.station_name = station_name.value;
    await app.storageService.setItem("station_name",station_name.value);
    
    await app.utils.getSetting();
    
    await app.setValue("POS Station",station_name.value,"is_used",1);

    app.ionRouter.navigate(app.route.query.return_url, 'back', 'replace');
 loading.dismiss();
    } else {
         loading.dismiss();
    }


}
</script>