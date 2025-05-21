import { ref } from "vue";
import { handleErrorMessage } from "@/helpers/error-message";
import { alertController, loadingController } from '@ionic/vue';
import { setFrappeAppUrl, logoutApi } from '@/services/api-service';
import { useApp } from "./useApp";
import { CapacitorHttp } from '@capacitor/core';

const isAuthenticated = ref(false);
const currentUser = ref();

export function useAuth() {
  const appCtrl = useApp();

  async function login(data) {
    try {
      const options = {
        url: data.api_url + "api/method/epos_restaurant_2023.api.auth.login",
        headers: { "Content-Type": "application/json" },
        data: {
          property: data.property_name,
          usr: data.username,
          pwd: data.password,
        }
      };

      const response = await CapacitorHttp.post(options);
      if (response.status !== 200) {
        handleErrorMessage(response.data);
        throw new Error(response.data);
      }

      currentUser.value = response.data.message;
      window.storageService.setItem("current_user", JSON.stringify(currentUser.value));
      setFrappeAppUrl(data.api_url);
      isAuthenticated.value = true;

      return { data: response.data.message, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function logout() {
    const loading = await loadingController.create({
      message: window.t("Logout") + '...',
    });
    await loading.present();

    await logoutApi();
    window.storageService.removeItem("current_user");
    isAuthenticated.value = false;
    currentUser.value = {};
    
    await loading.dismiss();
  }

  function setCurrentLoginUser(data) {
    currentUser.value = data;
  }

  async function checkPropertyCode(api_url, property_code) {
    try {
      const options = {
        url: api_url + "api/method/epos_restaurant_2023.api.auth.check_api_url?property_code=" + property_code,
      };

      const response = await CapacitorHttp.get(options);
      if (response.status === 200) {
        currentUser.value = response.data.message;
        isAuthenticated.value = true;
        return { data: response.data.message, error: null };
      } else {
        handleErrorMessage(response.data);
        throw new Error(response.data);
      }
    } catch (error) {
      if (typeof error === "object") {
        if (JSON.stringify(error).includes("Failed to parse URL from")) {
          const alert = await alertController.create({
            header: 'Invalid Server',
            message: `This property code contains an invalid server URL. Please contact your system administrator for assistance.`,
            buttons: ['OK'],
          });
          await alert.present();
        }
      }
      return { data: null, error };
    }
  }

  async function checkUserLogin() {
    let returnUrl = ""
    const loading = await loadingController.create({
      message: window.t('Loading...'),
    });
    await loading.present();

    const strCurrentProperty = window.storageService.getItem("current_property");
    if (strCurrentProperty) {
      const property = JSON.parse(strCurrentProperty);
      const strCurrentUser = window.storageService.getItem("current_user");

      if (strCurrentUser) {
        const user = JSON.parse(strCurrentUser);
        currentUser.value = user;

        const checkResponse = await checkUserSession(property.api_url, JSON.stringify(atob(user.token)), property.property_name);

        if (checkResponse.data === "Guest") {
          isAuthenticated.value = false;
          window.storageService.removeItem("current_user");

          app.router.push('/select-workspance');
        } else {
          if (checkResponse.data) {
            isAuthenticated.value = true;
            appCtrl.currentProperty.value = property;
            app.setCurrentProperty(property);
            setFrappeAppUrl(property.api_url);
            app.router.push('/home');
          } else {
            window.storageService.removeItem("current_user");
            isAuthenticated.value = false;
            app.router.push('/select-workspace');
          }
        }
      }
      await loading.dismiss();
    } else {
      isAuthenticated.value = false;
      await loading.dismiss();
    }
  }

  async function checkUserSession(api_url, token, property_name) {
    try {
      const options = {
        url: api_url + "api/method/epos_restaurant_2023.api.auth.check_user_login?property=" + property_name,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token ' + token.replaceAll('"', ""),
        }
      };

      const response = await CapacitorHttp.get(options);
      if (response.status !== 200) {
        handleErrorMessage(response.data);
        throw new Error(response.data);
      }

      currentUser.value = response.data.message;
      isAuthenticated.value = true;
      return { data: response.data.message, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  return {
    isAuthenticated,
    checkUserLogin,
    logout,
    login,
    checkPropertyCode,
    setCurrentLoginUser,
    currentUser
  };
}
