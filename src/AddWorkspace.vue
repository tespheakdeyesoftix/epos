<template>
    <ion-page>
      <!-- App Bar -->
      <ion-header>
        <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>{{t("Add Workspace")}}</ion-title>
    </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true" class="ion-padding">
        <div class="form-container">
          <ion-text color="primary" style="margin: 20px;">
            <p>{{ t("Please enter your property code, username and password") }}</p>
          </ion-text>
  
          <ion-input
            v-model="formData.property_code"
            :label="t('Property Code')"
            label-placement="floating"
            fill="outline"
            :placeholder="t('Property Code')"
            class="ion-margin-bottom"
          ></ion-input>
 
          <ion-input
            v-model="formData.username"
            :label="t('Username')"
            label-placement="floating"
            fill="outline"
            :placeholder="t('Username')"
            class="ion-margin-bottom"
          ></ion-input>
  
          <ion-input
            v-model="formData.password"
            :label="t('Password')"
            label-placement="floating"
            fill="outline"
            :placeholder="t('Password')"
            type="password"
            class="ion-margin-bottom"
          ></ion-input>
  
          <ion-button shape="round" size="large" expand="full" @click="onSaveWorkspace" class="save-button">
            {{t("Save Workspace")}}
          </ion-button>
        </div>
      </ion-content>
    </ion-page>
  </template>

<script setup lang="ts">
import { ref ,onMounted } from "vue"

import { IonPage, IonContent, IonInput, IonSpinner, 
    loadingController, toastController, alertController,
    useIonRouter ,IonBackButton,IonButton,IonText } from '@ionic/vue';
  
import { getPropertyInformation } from "@/services/auth-service"
import { setFrappeAppUrl } from "@/services/api-service"
import { useRoute } from 'vue-router';
import { showWarning } from "@/helpers/utils";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const route = useRoute();

import { useAuth } from "@/hooks/useAuth";
const ionRouter = useIonRouter();

const {login,checkPropertyCode} = useAuth()

const formData = ref({
    property_code: "SR2021-0001",
    username: "Administrator",
    password: "123456"
})
 
async function onSaveWorkspace() {
  
    if(!formData.value.property_code){
        showWarning(t("Please enter property code"));
        return
    }
    if(!formData.value.username){
        showWarning("Please enter username");
        return
    }
    
    if(!formData.value.password){
        showWarning("Please enter password");
        return
    }


    const loading = await loadingController.create({
        message: t('Checking property code'),
    });

    loading.present();

    const response = await getPropertyInformation(formData.value.property_code);
    await loading.dismiss();
    if (response.error) {
        await loading.dismiss();
        const alert = await alertController.create({
            header: t('Check Property Information'),
            message: t("property_not_exist_message",{ property_code: formData.value.property_code }),
        
            buttons: [t('OK')],
        });
        await alert.present();

        return

    }

    // get api url 
    const checkPropertyCodeResponse = await checkPropertyCode(response.data.app_url, formData.value.property_code);
 
    if(checkPropertyCodeResponse?.error){
    await loading.dismiss();
    return;
   }

    
    // assign to frappe app
    // login
    // save current current property and username, password to local storage
     
    const loadingLogin = await loadingController.create({
        message: t('Loging In') + '...',
    });
    await loadingLogin.present();


 
    const loginResponse = await login({...formData.value,api_url: response.data.app_url,property_name:checkPropertyCodeResponse.data.property_name});
    
  
    alert(1)
    console.log(loginResponse)
    if (loginResponse.error){
        await loadingLogin.dismiss();
        return;
    }

    // show current property
    const property = {
        ...checkPropertyCodeResponse.data, 
        username:formData.value.username,
        password:formData.value.password,
        api_url:response.data.app_url
    }
    alert(2)
    updatePropertyToStorage(property);

    // save current property to local storage 
    window.storageService.setItem("current_property",JSON.stringify(property))
    // save current login user to local storage

    window.storageService.setItem("current_user",JSON.stringify(loginResponse.data));

    setFrappeAppUrl(response.data.app_url);
    
    await loadingLogin.dismiss();

    // naviage to home page
   
 
    ionRouter.navigate('/home', 'forward', 'replace');
}


function updatePropertyToStorage(data:any){
    let properties = window.storageService.getItem("properties");
    if(properties){
        properties = JSON.parse(properties);
        let property = properties.find((r:any)=>r.property_code ==data.property_code);
        if(property){
            property.property_name = data.property_name;
            property.photo = data.photo
            property.username = data.username
            property.password = data.password,
            property.api_url = data.api_url
        } else 
        {
            properties.push(data);
        }
    }else {
        properties = []

        properties.push(data);
    }

    window.storageService.setItem("properties",JSON.stringify(properties));
}

onMounted(() => {
    const { property_code } = route.params;
    
    const strProperties = window.storageService.getItem("properties");
    if(strProperties){
        const properties = JSON.parse(strProperties)
        const property = properties.find((r:any)=> r.property_code==property_code);
        if(property){
            formData.value = {
                property_code:property.property_code,
                username:property.username,
                password:property.password
            }
        }
    }
});


</script>
 