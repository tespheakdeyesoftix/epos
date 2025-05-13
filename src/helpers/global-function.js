import { alertController, toastController,loadingController,modalController } from '@ionic/vue';
import i18n from '../../i18n'; // Import i18n config
// Ensure the namespace exists
globalThis.app = globalThis.app || {};

 
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
