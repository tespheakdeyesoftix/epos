import { alertController, toastController,loadingController,modalController } from '@ionic/vue';
import i18n from '../../i18n'; // Import i18n config
import { getApi, getCount,getDoc,updateDoc,createDoc,deleteDoc,getDocList, postApi,submitDoc,getValue,setValue  } from "@/services/api-service";
import {checkArrayType,selectDate, getTimespanRange,generateUIJsonFromMeta,showToast,showLoading,onConfirm, openModal,openPopOver,onScanBarcode,getNumber,currencyFormat } from '@/helpers/utils';
import  * as utils from '@/helpers/utils';
import  * as storageService from '@/services/storage-service.ts';
import  * as sale from "@/helpers/sale-action.js";
import  * as shift from "@/helpers/shift-action.js";
import  * as printing from "@/helpers/printing.js";
import dayjs from 'dayjs';
import { ref } from 'vue';
import { useApp } from '@/hooks/useApp';
import customDayjs from '@/helpers/dayjs';
const {getMeta} = useApp()
 
let ionRouter = ref();


// Ensure the namespace exists
globalThis.app = globalThis.app || {};


// api url 
globalThis.app.utils = utils;
globalThis.app.sale = sale;
globalThis.app.shift = shift;
globalThis.app.printing = printing;
globalThis.app.storageService = storageService;
globalThis.app.setting = {
  "station_name":"",
  "app_name":"ePOS",
  "app_menus":[],
  "pos_profile":{
    "name":"",
    "default_pos_receipt":"",
    "default_customer":"",
    "stock_location":"",
    "outlet":""},
  "property":{

  },
  "app_logo":"",
  "allow_login_multiple_site":1,
  "cashier_shift":{
    "name":""
  },
  "working_day":{
    "name":"",
    "posting_date":""
  }
}

 

globalThis.app.t =  i18n.global.t;


globalThis.app.dayjs =  customDayjs




globalThis.app.getDoc =  async function (DocType,DocName) {
  return await getDoc(DocType,DocName)
}
globalThis.app.getCount =  async function (DocType,filters) {
  return await getCount(DocType,filters)
}


globalThis.app.createDoc =  async function (DocType,params) {
  return await createDoc(DocType,params)
}

globalThis.app.getValue =  async function (DocType,name,fields) {
  return await getValue(DocType,name,fields)
}

globalThis.app.setValue =  async function (DocType,name,fields,value=null) {
  return await setValue(DocType,name,fields,value)
}


globalThis.app.deleteDoc =  async function (DocType,DocName) {
  return await deleteDoc(DocType,DocName)
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

globalThis.app.sql =  async function (statement,params) {
  return await postApi("epos_restaurant_2023.api.api.sql",{
    sql_command:statement,
    params:params
  })
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


 globalThis.app.onConfirm =  async function (title="Confirm", message ="Are you sure you want to process this action?",options={background:"success"}) {
  const isConfirm = await onConfirm(title,window.t(message),options);
  return isConfirm
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


globalThis.app.currentUser = null;
 

 
globalThis.app.showLoading = async function (message = 'Loading...',duration=1000*15) {
    const loading = await loadingController.create({
      message:window.t(message),
       duration: duration,

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
 
    if (!message) return;
    window.toast.add({ severity: 'success', summary: window.t('Success'), detail: window.t(message),   life: 3000 });

}
  globalThis.app.showWarning = async function (message){
    // const toast = await toastController.create({
    //     message: t(message),
    //     duration: 5000,
    //     position: "top",
    //     swipeGesture:"vertical",
    //     color: "warning"
    // });
    // toast.present();

    
    if (!message) return ;
    
     window.toast.add({ severity: 'warn', summary: window.t('Confirm'), detail: window.t(message),  life: 3000 });
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


 
globalThis.app.getNumber = function(n){
  return getNumber(n, app.setting.float_precision);
}

globalThis.app.currencyFormat = function(number,currency=null,format=null){
  return currencyFormat(number,currency,format);
}

globalThis.app.getMeta = async function(doctype){
  return await getMeta(doctype);
}
globalThis.app.generateUIJsonFromMeta = async function(doctype){
  const meta  =  await getMeta(doctype);
  return  generateUIJsonFromMeta(meta.fields)
}

globalThis.app.getTimespanRange =  function(timespan){
 
  const dates =   getTimespanRange(timespan)
  return {start_date:dayjs(dates.startDate).format("YYYY-MM-DD"),end_date:dayjs(dates.endDate).format("YYYY-MM-DD")}
}

globalThis.app.onSelectDate =  async function(props=null){
 
  return await selectDate(props)
}
globalThis.app.checkArrayType =    function(value){
 
  return   checkArrayType(value)
}



globalThis.app.printService = null
 