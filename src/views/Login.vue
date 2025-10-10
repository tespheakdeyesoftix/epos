<template>
  <ion-page> 
    <ion-content :fullscreen="true" class="ion-padding login-wrapper-page">
          <ion-refresher slot="fixed" @ionRefresh="onRefresh">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
      <div class="custom-flex-login fixed-container">
        <div class="form-container ion-padding">
          <ion-grid class="cutom-gap h-100">
            <ion-row class="h-100">
              <ion-col size="12" size-md="6" class="ion-padding">
                <form @submit.prevent="onLogin" class="h-100 flex align-items-center">
                  <div> 
                  
                    <stack gap="1rem">
                      <ion-text color="primary">
                        <h1 class="m-0">{{ t("Please enter your username and password") }}</h1>
                      </ion-text> 
                      <com-input ref="txtUsername" :label="t('Username')" v-model="formData.username" 
                        label-placement="floating" fill="outline"  :placeholder="t('Username')"/> 
                      <com-input ref="txtPassword" :label="t('Password')" v-model="formData.password" type="password"
                        label-placement="floating" fill="outline" :placeholder="t('Password')"/> 
                      <ion-button shape="round" size="large" expand="full" type="submit" class="save-button">
                        {{ t("Login") }}
                      </ion-button>
                    </stack>
                    <div class="pt-3">
                      <ion-buttons class="language-buttons justify-content-center">
                        <ion-button v-for="(l, index) in languages" :key="index" @click="changeLanguage(l.lang)"
                          :color="l.lang == locale ? 'danger' : 'default'">
                          <ion-icon :src="l.icon" slot="start" />
                          {{ l.label }}
                        </ion-button>
                      </ion-buttons>
                    </div>
                  </div>
                </form>
              </ion-col>
              <ion-col size="12" size-md="6" class="ion-padding hidden md:block">
                <div class="h-100 custom-wrapper-image">
                  <ion-img class="h-100 img-cover" src="assets/retina_wood.png"></ion-img>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { ref, onMounted,nextTick } from "vue"

import {
  useIonRouter, IonButton, IonText
} from '@ionic/vue';


import { useI18n } from 'vue-i18n';
import { getPropertyInformation } from "@/services/auth-service"
import { setFrappeAppUrl } from "@/services/api-service"
import { IonIcon } from '@ionic/vue';
import { keypadOutline } from 'ionicons/icons';
import { useAuth } from "@/hooks/useAuth";
import { useRoute } from 'vue-router';
import { useApp } from '@/hooks/useApp';

const txtUsername = ref(null)
const txtPassword = ref(null)

const { locale } = useI18n();
const property = ref({"username":"","password":"","api_url":""})
const t = window.t

const route = useRoute();

const { languages } = useApp()

const ionRouter = useIonRouter();

const { login, checkPropertyCode } = useAuth()

const formData = ref({

  username: "Administrator"

})

const changeLanguage = (lang: string) => {
  locale.value = lang;
  window.localStorage.setItem("lang", locale.value)
};

async function onLogin() {
  if (!formData.value.username) {
    app.showWarning(t("Please enter your username"))
    return
  }
  
  if (!formData.value.password) {
    app.showWarning(t("Please enter your password"))
    return
  }


  const loading = await app.showLoading("Login In...")

  property.value.username = formData.value.username
  property.value.password = formData.value.password
  const response = await login(property.value);

  if(response?.error){
 
    await loading.dismiss()
    return

  }

  // login success 
  app.setting.property = property.value
  
  SaveUsername()


  if (response) {

    setFrappeAppUrl(property.value.api_url);

    // get setting
    await app.utils.getSetting();
    
    if (response.data?.home_page) {
      ionRouter.navigate(response.data.home_page, 'forward', 'replace');
    }
    else {
      ionRouter.navigate('/home', 'forward', 'replace');
    }
  }
  await loading.dismiss()
}

function SaveUsername(){
  const strProperties = app.storageService.getItem("properties");
  if (strProperties) {
    const properties = JSON.parse(strProperties)
    properties[0].username = formData.value.username
    app.storageService.setItem("properties", JSON.stringify(properties))
  }
}



const onRefresh = async (event) => {
        event.target.complete();

};


onMounted(async () => {  
  const strProperties = app.storageService.getItem("properties");
  if (strProperties) {
    const properties = JSON.parse(strProperties)
    property.value = properties[0]
    formData.value.username = property.value.username
  }
});


</script>
<style scoped>
/* .login-wrapper-page {
  background: url(public/assets/ice_pattern.png);
} */
.login-wrapper-page .custom-flex-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-wrapper-page .form-container {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  /* max-width: 60%; */
  border-radius: 12px;
  display: flex;
  align-items: center;
  background: url(/assets/topography.png);
}

.login-wrapper-page .h-100 {
  height: 100%;
}

.login-wrapper-page .img-cover {
  object-fit: cover !important;
}

.login-wrapper-page .custom-wrapper-image {
  border-radius: 5px;
  overflow: hidden;
}

.login-wrapper-page .custom-wrapper-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>