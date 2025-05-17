import { alertController, toastController,loadingController,modalController } from '@ionic/vue';
import i18n from '../../i18n'; // Import i18n config
import { getApi, getDoc,updateDoc,createDoc,getDocList, postApi,submitDoc  } from "@/services/api-service";
import { showToast,showLoading, openModal,openPopOver,onScanBarcode } from '@/helpers/utils';
import { ref } from 'vue';

let ionRouter = ref();

// Ensure the namespace exists
globalThis.app = globalThis.app || {};


// api url 
globalThis.app.getDoc =  async function (DocType,DocName) {
  return await getDoc(DocType,DocName)
}

globalThis.app.createDoc =  async function (DocType,params) {
  return await createDoc(DocType,params)
}

globalThis.app.updateDoc =  async function (DocType,name,params) {
  return await updateDoc(DocType,name,params)
}

 
globalThis.app.getApi =  async function (api_url,param) {
  return await getApi(api_url,param)
}

 
globalThis.app.postApi =  async function (api_url,param) {
  return await postApi(api_url,param)
}

globalThis.app.getDocList =  async function (DocType,param) {
  return await getDocList(DocType,param)
}

globalThis.app.renameDoc =  async function (DocType,oldName,newName) {
  return await postApi("epos_restaurant_2023.api.api.rename_doc",{data:{doctype:DocType, old_name:oldName,new_name:newName}})
}
globalThis.app.submitDoc =  async function (doc) {
  return await submitDoc(doc)
}


// global variable
 
 globalThis.app.openModal =  async function (props) {
  return await openModal(props)
}
 globalThis.app.onScanBarcode =  async function () {
  return await onScanBarcode()
}

globalThis.app.openPopOver =  async function (props,event) {
  return await openPopOver(props,event)
}

// utils function
// ionRouter.navigate('/home', 'forward', 'replace');
 
globalThis.app.ionRouter = null;
 globalThis.app.setIonRouter = function(router){
  
  globalThis.app.ionRouter =router; 
 }

//  route
globalThis.app.route = null;
 globalThis.app.setRoute = function(route){
 
  globalThis.app.route =route; 
 }
// vue router
globalThis.app.router = null;
 globalThis.app.setRouter = function(router){
 
  globalThis.app.router =router; 
 }


 
globalThis.app.showLoading = async function (message = 'Loading...') {
    const loading = await loadingController.create({
      message:window.t(message)
    });
  
    await loading.present();  
    return loading;  
  }
 
globalThis.app.showConfirm = async function (message = 'Loading...') {
    const loading = await loadingController.create({
      message:window.t(message)
    });
  
    await loading.present();  
    return loading;  
  }
 

  globalThis.app.showSuccess = async function (message){
    const toast = await toastController.create({
        message: message,
        duration: 5000,
        position: "top",
        swipeGesture:"vertical",
        color: "success"
    });
    toast.present();
}
  globalThis.app.showWarning = async function (message){
    const toast = await toastController.create({
        message: message,
        duration: 5000,
        position: "top",
        swipeGesture:"vertical",
        color: "warning"
    });
    toast.present();
}

  
  
  globalThis.app.Confirm  =  async function ( title="Confirm", message="Are you sure you want to process this action?",options=[]) {
   
  let defaultButtons = [
      {
        text: window.t('Cancel'),
        role: 'cancel',
         
      },
      {
        text: window.t('OK'),
        role: 'confirm',
        cssClass: 'alert-button-confirm',
        
      },
    ]
    if(options.buttons){
      defaultButtons = options.buttons;
    }
    
    const al = await alertController.create({
        header: window.t(title),
        subHeader:options.subHeader || "",
        message: window.t(message),
        buttons: defaultButtons
      });
  
      await al.present();
        const { data, role } = await al.onWillDismiss();
        if (role=="confirm"){
           
            return true
        }
        return false
        
        
}
