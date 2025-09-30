<template>
  <ion-page>
    <!-- App Bar -->
   <ToolBar>{{ t("Add Workspace") }}</ToolBar>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="fixed-container">
      <div class="form-container">
        <ion-text color="primary" style="margin: 20px;">
          <p>{{ t("Please enter your property code, username and password") }}</p>
        </ion-text>

        <!-- <ion-label>{{ t("Your current IP Address") }}</ion-label>
        <ion-text>
          <p>{{ currentIP }}</p>
        </ion-text>
        <ion-button @click="onFindServer" expand="full" size="large" color="secondary" shape="round">{{ t("Find Server") }}</ion-button> -->

        <ion-item-divider class="mb-4"/>
         
        <ion-input
          v-model="formData.property_code"
          :label="t('Property Code')"
          label-placement="floating"
          fill="outline"
          :placeholder="t('Property Code')"
          class="ion-margin-bottom" 
       
        ></ion-input>
        <ion-input
          v-model="formData.apiUrl"
          :label="t('Server URL')"
          label-placement="floating"
          fill="outline"
          placeholder="http://server-host:port-number/"
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
          {{ t("Save Workspace") }}
        </ion-button>
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Import Vue Composition API and Ionic components/hooks
import { ref, onMounted } from "vue";
import { CapacitorHttp } from '@capacitor/core';
import {
  IonPage,
  IonContent,
  IonInput,
  loadingController,
  alertController,
  useIonRouter,
  IonBackButton,
  IonButton,
  IonText,
} from "@ionic/vue";

import { getPropertyInformation } from "@/services/auth-service";
import { setFrappeAppUrl } from "@/services/api-service";
import { useRoute } from "vue-router";
import { showWarning } from "@/helpers/utils";
import { useI18n } from "vue-i18n";
import { useAuth } from "@/hooks/useAuth";
import { useApp } from "@/hooks/useApp";
const { t } = useI18n();
const currentIP = ref(null)
const route = useRoute();
const { getSetting } = useApp();
import { Capacitor } from '@capacitor/core';
const ionRouter = useIonRouter();

const { login, checkPropertyCode,checkServerURL } = useAuth();

const apiUrl = ref(import.meta.env.VITE_API_URL)

const formData = ref({
  property_code: "SR2021-0001",
  username: "Pheakdey",
  password: "112233",
});

async function onSaveWorkspace() {
  
  if (!formData.value.property_code) {
    showWarning(t("Please enter property code"));
    return;
  }
  if (!formData.value.username) {
    showWarning("Please enter username");
    return;
  }

  if (!formData.value.password) {
    showWarning("Please enter password");
    return;
  }

  if(formData.value.apiUrl) {
    const isValid  =  await checkServerURL(formData.value.apiUrl)
    if (!isValid){
      app.showWarning("Invalid server url");
    }
  }
    

  const loading = await app.showLoading("Checking property code")



  
  const response = await getPropertyInformation(formData.value.property_code,formData.value.apiUrl);
  await loading.dismiss();

  if (response.error) {
    const alert = await alertController.create({
      header: t("Check Property Information"),
      message: t("property_not_exist_message", {
        property_code: formData.value.property_code,
      }),
      buttons: [t("OK")],
    });
    await alert.present();
    return;
  }

  // get api url
  const checkPropertyCodeResponse = await checkPropertyCode(
    response.data.app_url,
    formData.value.property_code
  );
  
  if (checkPropertyCodeResponse?.error) {
    return;
  }

  // assign to frappe app, login, and save data
   
  const  loadingLogin = await app.showLoading(t("Loging In") + "...")


  const loginResponse = await login({
    ...formData.value,
    api_url: response.data.app_url,
    property_name: checkPropertyCodeResponse.data.property_name,
  });

  if (loginResponse.error) {
    await loadingLogin.dismiss();
    return;
  }

  // show current property
  const property = {
    ...checkPropertyCodeResponse.data,
    username: formData.value.username,
    password: formData.value.password,
    api_url: response.data.app_url,
  };

  updatePropertyToStorage(property);

  // save current property and user to local storage
  app.storageService.setItem("current_property", JSON.stringify(property));
  app.storageService.setItem("current_user", JSON.stringify(loginResponse.data));
  app.setting.property = property

  // setFrappeAppUrl(response.data.app_url);
  

  await loadingLogin.dismiss();

   await app.utils.getSetting()
  // navigate to home page
 
  ionRouter.navigate("/home", "forward", "replace");
}

function updatePropertyToStorage(data) {
  let properties = app.storageService.getItem("properties");
  if (properties) {
    properties = JSON.parse(properties);
    let property = properties.find((r) => r.property_code === data.property_code);
    if (property) {
      property.property_name = data.property_name;
      property.photo = data.photo;
      property.username = data.username;
      property.password = data.password;
      property.api_url = data.api_url;
    } else {
      properties.push(data);
    }
  } else {
    properties = [];
    properties.push(data);
  }
  app.storageService.setItem("properties", JSON.stringify(properties));
}

 
 import { NetworkInterface } from "@awesome-cordova-plugins/network-interface";

const getLocalIP = async () => {
 
  try {
    const address = await NetworkInterface.getWiFiIPAddress();
    currentIP.value =address.ip;
     
  } catch (err) {
     
  }
};

const found = ref()
const stopRequested = ref(false)
const concurrency = 20
const timeoutMs = 2500

const onFindServer = async () => {
  const loading = await app.showLoading("Find Server...")
  
 
  const base = cidr24FromIp(currentIP.value)
 
 
  stopRequested.value = false
 
  found.value = null
   
  await scanCidr24(base)

  if (found.value) {
    alert("u fond me")
     await loading.dismiss()
  
  } else {
   alert("not dound")
  }

 await loading.dismiss()
}
const scanCidr24 = async (base) => {
  if (!base) return
  const ips = []
  for (let i = 1; i <= 254; i++) ips.push(`${base}.${i}`)
  
  let next = 0
  const worker = async () => {
    while (next < ips.length && !found.value && !stopRequested.value) {
      const idx = next++
      const ip = ips[idx]
      await probeIp(ip)
    }
  }

  // start concurrency workers
  await Promise.all(new Array(concurrency).fill(0).map(() => worker()))
}
const probeIp = async (ip) => {
  if (found.value || stopRequested.value) return null

  const url = `http://${ip}:1216/api/method/ping`

  try {
    const res = await CapacitorHttp.get({ url })
 
    if (res?.status !== 200 || !res?.data) {
      
      return null
    }

  
    const data = res.data // JSON parsed automatically
 
    if (data?.message?.toLowerCase() === 'pong') {
      alert("fond")
      found.value = `http://${ip}:1216`
      stopRequested.value = true
      return ip
    }
  } catch (err) {
    console.log(err)
  } finally {
    
  }

  return null
}

const cidr24FromIp = (ip) => {
  const m = ip && ip.match(/^(\d+\.\d+\.\d+)\.\d+$/)
  return m ? m[1] : null
}


onMounted(() => {
  // if(Capacitor.getPlatform() == "android"){
  //   getLocalIP();
  // }
  if(import.meta.env.VITE_MODE == "development"){
    formData.value = {
      property_code: import.meta.env.VITE_PROPERTY_CODE,
      username: "pheakdey",
      password: "112233",
    }
  } else {
 formData.value = {
      property_code: import.meta.env.VITE_PROPERTY_CODE,
      username: "",
      password: "",
    }
  }
  const { property_code } = route.params;

  const strProperties = app.storageService.getItem("properties");
  if (strProperties) {
    const properties = JSON.parse(strProperties);
    const property = properties.find((r) => r.property_code === property_code);
    if (property) {
      formData.value = {
        property_code: property.property_code,
        username: property.username,
        password: property.password,
      };
    }
  }
});
</script>
