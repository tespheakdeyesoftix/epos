import { modalController, alertController, toastController, loadingController, popoverController } from '@ionic/vue';
import ComScanBarcode from "@/views/components/ComScanBarcode.vue";
import ComSelectDate from "@/views/components/public/ComSelectDate.vue";
import ComSelectCustomer from "@/views/customer/components/ComSelectCustomer.vue";
import ComScanMemberCard from "@/views/customer/components/ComScanMemberCard.vue";
import ComAddCustomer from "@/views/customer/components/ComAddCustomer.vue";
import ComKeypad from "@/views/components/public/ComKeypad.vue";
import Keyboard from '@/views/components/public/Keyboard.vue';
import ComInputNumberModal from '@/views/components/public/ComInputNumberModal.vue';
import ComAuth from '@/views/components/public/ComAuth.vue';
import ComViewTotalVisit from "@/views/customer/components/ComViewTotalVisit.vue"; 
import ComViewTotalAnnalOrder from "@/views/customer/components/ComViewTotalAnnalOrder.vue"; 
import ComViewTotalOrder from "@/views/customer/components/ComViewTotalOrder.vue"; 
import ComCheckCoupon from "@/modules/ecoupon/coupon-codes/ComCheckCoupon.vue"; 

import { Capacitor } from '@capacitor/core';
import { onScanBarcodeAndroid } from '@/helpers/scan-barcode.js'

import { isPlatform,getPlatforms } from '@ionic/vue';
 import WebSocketPrinter from "@/helpers/websocket-printer.js"
 import { useApp } from '@/hooks/useApp';
import ComPendingOrderModal from '@/modules/ecoupon/sale-coupon/components/ComPendingOrderModal.vue';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek' // for ISO week support (if needed)
import {encrypt,decrypt} from "@/helpers/encrypt.ts"
import submitSound from '/assets/sound/submit.mp3'
const successSound = new Audio(submitSound)


dayjs.extend(isoWeek)

import { useAuth } from "@/hooks/useAuth";



window.encrypt = encrypt
window.decrypt = decrypt
const { isWorkingDayOpened,isCashierShiftOpened,exchange_rate_input,exchange_rate,change_exchange_rate } = useApp();


export function imageUrl(imageUrl, baseUrl = "") {
  if (imageUrl?.startsWith("https://") || imageUrl?.startsWith("http://")) {
    return imageUrl;
  }
  if (baseUrl !== "") {
    return baseUrl + imageUrl;
  }

  const strCurrentProperty = app.storageService.getItem("current_property");
  if (strCurrentProperty) {
    const property = JSON.parse(strCurrentProperty);
    return property.api_url + imageUrl;
  }
}

export async function showWarning(message) {
  const toast = await toastController.create({
    message: app.t(message),
    duration: 5000,
    position: "top",
    swipeGesture: "vertical",
    color: "warning"
  });
  toast.present();
}

export function getAvatarLetter(name) {
  if (!name) return '?'; // Default placeholder

  const words = name.trim().split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0][0].toUpperCase();
}

export function getGreetingMessage() {
  const hours = new Date().getHours();
  if (hours < 12) {
    return "Good Morning!";
  } else if (hours < 18) {
    return "Good Afternoon!";
  } else {
    return "Good Evening!";
  }
}

export function stripHtmlTags(text) {
  return text?.replace(/<[^>]*>/g, '');
}

export function generateRandomString() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = letters.charAt(Math.floor(Math.random() * letters.length)); // First character must be a letter

  for (let i = 1; i < 20; i++) {
    result += lettersAndNumbers.charAt(Math.floor(Math.random() * lettersAndNumbers.length));
  }

  return result;
}



export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

export async function showToast(message, color = "") {
  const toast = await toastController.create({
    message: stripHtmlTags(message),
    duration: 5000,
    position: "top",
    swipeGesture: "vertical",
    color: color
  });
  toast.present();
}

export async function showLoading(message = "Loading") {
  const loading = await loadingController.create({
    message: window.t(message)
  });

  await loading.present();
  return loading;
}

export async function selectDate(props = null) {

 
  const modal = await  app.openModal({
    component: ComSelectDate,
    componentProps: props,
    backdropDismiss: false,
    cssClass:"modal-select-date"
  })
  return modal;
}

export async function openModal(props) {
  if (!props.title) {
  props.title = "Select";
  }

  if (!props.cssClass ) {
    props.cssClass = "desktop-modal";
  }
   
 
 

  const modal = await modalController.create({  ...props });

  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm') {
    return data;
  }
  return false;
}

export async function onConfirmDanger(title = "Confirm", message = "Are you sure you want to process this action?", options = {background:"danger"}) {
  return await onConfirm(title, message, options);
}

export async function onConfirm(title = "Confirm", message = "Are you sure you want to process this action?", options = {background:"success"}) {
  let defaultButtons = [
    {
      text: window.t('Cancel'),
      role: 'cancel',
    },
    {
      text: window.t('OK'),
      role: 'confirm',
      cssClass: options.background =="success"?'alert-button-confirm-success':"alert-button-confirm-danger",
    },
  ];

  if (options.buttons) {
    defaultButtons = options.buttons;
  }

  const al = await alertController.create({
    header: window.t(title),
    subHeader: options.subHeader || "",
    message: window.t(message),
    buttons: defaultButtons
  });

  await al.present();
  const { data, role } = await al.onWillDismiss();

  if (role === "confirm") {
    return true;
  }
  return false;
}

export async function openPopOver(props, event) {
  const popover = await popoverController.create({
    component: props.component,
    componentProps: props.componentProps,
    event,
  });

  await popover.present();

  const { data, role } = await popover.onDidDismiss();
  if (role === "confirm") {
    return data;
  }
  return false;
}

export async function onScanBarcode() {
  if(Capacitor.getPlatform() == "web"){
const result = openModal({
    component: ComScanBarcode,
    componentProps: {
      title: "Scan Barcode",
    }
  });

  return result;
  } else if (Capacitor.getPlatform()=="android"){
    const result = await onScanBarcodeAndroid();
    if(result?.rawValue){
      return result.rawValue 
    }
    return false
    

  }
  
}

export function getNumber(num, decimalDigits) {
  const rounded = Number(num).toFixed(decimalDigits); // Round to given decimal digits
  const parts = rounded.split('.');

  if (!parts[1] || /^0+$/.test(parts[1])) {
    return parts[0];
  }

  const trimmedDecimals = parts[1].replace(/0+$/, '');
  return `${parts[0]}.${trimmedDecimals}`;
}

export function currencyFormat(number,currency=null, format=null) {
  const amount = formatNumber(number,currency,format);
  if (isCurrencySymbolOnRight(currency)==1){
    return amount + " " + getCurrencySymbol(currency)
  }else {
    return getCurrencySymbol(currency) + " " + amount ;
  }

}
function getCurrencySymbol(currency=null){
  if(!currency) return app.setting.currency_symbol
  if (currency == app.setting.currency) return app.setting.currency_symbol
  if(currency == app.setting.second_currency) return app.setting.second_currency_symbol

  return "$"

}

function isCurrencySymbolOnRight(currency){
  if(!currency) return app.setting.symbol_on_right
  if (currency == app.setting.currency) return app.setting.symbol_on_right
  if(currency == app.setting.second_currency) return app.setting.second_symbol_on_right

  return 0
}


 


function formatNumber(number,currency=null, format=null) {
  
  if(!format){
  
    if(!currency ) {
          return `${Number(number).toLocaleString('en-US', {
          minimumFractionDigits: app.setting.currency_precision,
          maximumFractionDigits: app.setting.currency_precision
      })}`;
    }
    
    if(currency == app.setting.currency ) {
          return `${Number(number).toLocaleString('en-US', {
          minimumFractionDigits: app.setting.currency_precision,
          maximumFractionDigits: app.setting.currency_precision
      })}`;
    }
    
    if(currency == app.setting.second_currency ) {
          return `${Number(number).toLocaleString('en-US', {
          minimumFractionDigits: app.setting.second_currency_precision,
          maximumFractionDigits: app.setting.second_currency_precision
      })}`;
    }


  }else {
    return    `${Number(number).toLocaleString('en-US')}`;
  }
}




export function generateUIJsonFromMeta(metaFields) {
  const layout = [];
  let currentTab = { tab: "Main", children: [] };
  let currentSection = { section: "", children: [] };
  let currentColumn = { column: "Column 1", children: [] };
  let columnCount = 1;

  let skipSection = false;

  for (const field of metaFields) {
    if (field.fieldtype === "Tab Break") {
      // Push everything in current structure
      if (!skipSection && currentColumn.children.length > 0) currentSection.children.push(currentColumn);
      if (!skipSection && currentSection.children.length > 0) currentTab.children.push(currentSection);
      if (currentTab.children.length > 0) layout.push(currentTab);

      // Reset structures
      currentTab = { tab: field.label || "Tab", children: [] };
      currentSection = { section: "", children: [] };
      currentColumn = { column: "Column 1", children: [] };
      columnCount = 1;
      skipSection = false;
      continue;
    }

    if (field.fieldtype === "Section Break") {
      // Push existing content before breaking section
      if (!skipSection && currentColumn.children.length > 0) currentSection.children.push(currentColumn);
      if (!skipSection && currentSection.children.length > 0) currentTab.children.push(currentSection);

      // Setup new section
      currentSection = { section: field.label || "", children: [] };
      currentColumn = { column: "Column 1", children: [] };
      columnCount = 1;

      // Determine whether to skip this section
      skipSection = field.hidden ? true : false;
      continue;
    }

    if (field.fieldtype === "Column Break") {
      if (skipSection) continue;

      currentSection.children.push(currentColumn);
      columnCount++;
      currentColumn = { column: `Column ${columnCount}`, children: [] };
      continue;
    }

    if (field.hidden || skipSection) {
      continue; // Skip hidden fields or fields under hidden sections
    }

    currentColumn.children.push({ ...field });
  }

  // Push remaining content if valid
  if (!skipSection && currentColumn.children.length > 0) currentSection.children.push(currentColumn);
  if (!skipSection && currentSection.children.length > 0) currentTab.children.push(currentSection);
  if (currentTab.children.length > 0) layout.push(currentTab);

  return layout;
}


export function getTimespanOptions(){
return  ["Today", "Yesterday", "Tomorrow", "This Week", "Last Week", "Next Week", "This Month", "Last Month", "Next Month", "This Quarter", "Last Quarter", "This Year", "Last Year"];

}

export function getTimespanRange(timespan) {
  const now = new Date();
  const startOfDay = d => new Date(d.setHours(0, 0, 0, 0));
  const endOfDay = d => new Date(d.setHours(23, 59, 59, 999));
  const addDays = (d, n) => new Date(d.setDate(d.getDate() + n));
  const start = new Date(now);
  const end = new Date(now);

  const getQuarterRange = (date) => {
    const quarter = Math.floor(date.getMonth() / 3);
    const start = new Date(date.getFullYear(), quarter * 3, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
    return { startDate: startOfDay(start), endDate: endOfDay(end) };
  };

  switch (timespan) {
    case "Today":
      
      return { startDate: startOfDay(start), endDate: endOfDay(end) };
    case "Yesterday":
      return {
        startDate: startOfDay(addDays(start, -1)),
        endDate: endOfDay(addDays(end, -1)),
      };
    case "Tomorrow":
      return {
        startDate: startOfDay(addDays(start, 1)),
        endDate: endOfDay(addDays(end, 1)),
      };
    case "This Week": {
      const day = now.getDay(); // 0 (Sun) - 6 (Sat)
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { startDate: startOfDay(monday), endDate: endOfDay(sunday) };
    }
    case "Last Week": {
      const current = new Date();
      const day = current.getDay();
      const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
      const lastMonday = new Date(current.setDate(diffToMonday - 7));
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);
      return { startDate: startOfDay(lastMonday), endDate: endOfDay(lastSunday) };
    }
    case "Next Week": {
      const current = new Date();
      const day = current.getDay();
      const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
      const nextMonday = new Date(current.setDate(diffToMonday + 7));
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);
      return { startDate: startOfDay(nextMonday), endDate: endOfDay(nextSunday) };
    }
    case "This Month": {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { startDate: startOfDay(firstDay), endDate: endOfDay(lastDay) };
    }
    case "Last Month": {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: startOfDay(firstDay), endDate: endOfDay(lastDay) };
    }
    case "Next Month": {
      const firstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      return { startDate: startOfDay(firstDay), endDate: endOfDay(lastDay) };
    }
    case "This Quarter":
      return getQuarterRange(new Date());
    case "Last Quarter": {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const lastQuarterStartMonth = (currentQuarter - 1 + 4) % 4 * 3;
      const lastQuarterYear = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const start = new Date(lastQuarterYear, lastQuarterStartMonth, 1);
      const end = new Date(lastQuarterYear, lastQuarterStartMonth + 3, 0);
      return { startDate: startOfDay(start), endDate: endOfDay(end) };
    }
    case "This Year": {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return { startDate: startOfDay(start), endDate: endOfDay(end) };
    }
    case "Last Year": {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31);
      return { startDate: startOfDay(start), endDate: endOfDay(end) };
    }
    default:
      return null;
  }
}


export function checkArrayType(value) {
  if (!Array.isArray(value)) {
    return null;
  }

  if (value.every(item => typeof item === 'string')) {
    return "string"
  }

  if (value.every(item => typeof item === 'number')) {
    return "number"
  }

  if (value.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
    return "json"
  }

  return 'mix';
}


export function getPlateform(){
  
   const screenWidth = window.innerWidth;
  if(window.matchMedia('(max-width: 640px)').matches){
      return "mobile"
  }
  if(isPlatform("tablet")){
    return "tablet"
  }
  if( screenWidth>=1024 || isPlatform("ipad") || isPlatform("electron") || isPlatform("desktop")){
    return "desktop"
  }
  return "mobile"

}

export function isMobile(){
  
   const screenWidth = window.innerWidth;
  if(window.matchMedia('(max-width: 640px)').matches){
      return true
  }
  if(isPlatform("tablet")){
    return true
  }
  if( screenWidth>=1024 || isPlatform("ipad") || isPlatform("electron") || isPlatform("desktop")){
    return false
  }
  return true

}

export function getCouponNumber(coupon){
  coupon = (coupon || "").replaceAll("Shift","");
  if(coupon.toLowerCase().startsWith("http")){
   
    const arrayCoupons =  coupon.split("?c=");
 
   
    if(arrayCoupons.length<2){
      return ""
    }
    return decrypt(arrayCoupons[1])

  }
 
  return decrypt(coupon)
  
}
 

export async function showWarningMessage(title = "Confirm", message = "Are you sure you want to process this action?") {
    let defaultButtons = [
        {
            text: app.t('OK'),
            role: 'confirm',
            cssClass: 'alert-button-warning'
        }
        
    ];



    const al = await alertController.create({
        header: app.t(title),
        subHeader:app.t(message)  ,
        buttons: defaultButtons,
        cssClass:"warning-alert"
    });

    await al.present();
    const { role } = await al.onWillDismiss();
    return role === 'confirm';
}
 

export async function getSetting() {

  const loading = await app.showLoading("Loading setting...")

  const station_name = await app.storageService.getItem("station_name");

  const res = await app.postApi("epos_restaurant_2023.api.setting.get_settings", {
    station_name: station_name
  })
  
 

  if (res.data) {
    app.setting = { ...app.setting, ...res.data }
    
    if (!app.setting.property) {
      let currentProperty = await app.storageService.getItem("current_property");
      if (currentProperty) {
        app.setting.property = JSON.stringify(currentProperty);
      }

    }
    if (res.data.pos_profile) {
      if (res.data.pos_profile.pos_config) {
        // we not wait here becuse we dont want to delay loading time
        await getPOSConfig(res.data.pos_profile.pos_config);
      }
      // set working day open state
      isWorkingDayOpened.value = res.data.working_day?true:false ;
      isCashierShiftOpened.value = res.data.cashier_shift?true:false  ;
      getPrintPrintFormat()
    }

    
    await loading.dismiss()
    await app.storageService.setItem("show_login", app.setting.allow_login_multiple_site == 1 ? 0 : 1)

    app.setting.station_name = app.storageService.getItem("station_name")
    // get exchange rate
    getExchangeRate()
  }
  
  await loading.dismiss();
}

export async function getExchangeRate(){

 
  const res=await app.getApi("epos_restaurant_2023.api.setting.get_exchange_rate");
  if(res.data){
    app.setting.exchange_rate = res.data[0].exchange_rate;
    app.setting.change_exchange_rate = res.data[0].change_exchange_rate;
    app.setting.exchange_rate_input = res.data[0].exchange_rate_input;
    exchange_rate.value = res.data[0].exchange_rate;
    exchange_rate_input.value = res.data[0].exchange_rate_input;
    change_exchange_rate.value = res.data[0].change_exchange_rate;
  }
}

export async function getPrintPrintFormat(){
  const res=await app.getApi("epos_restaurant_2023.api.setting.get_print_format",{
    pos_profile:app.setting.pos_profile.name
  });
  if(res.data){
   app.setting.print_formats  = res.data;
 
  }
}

export async function getPOSConfig(pos_config){

  const res =await app.getDoc("POS Config",pos_config)
 

  if(res.data){
    
    // clean up unuse key
    const remove_key = ["owner","creation","modified","modified_by","docstatus","doctype","idx"]
    remove_key.forEach(k => {
      delete res.data[k] ; 
    });
    // clean payment type
    res.data.payment_type.forEach(pt=>{
      remove_key.forEach(k => {
      delete pt[k] ; 
    });
    })
    // clean print setting
    res.data.print_settings.forEach(pt=>{
      remove_key.forEach(k => {
      delete pt[k] ; 
    });
    })
    
   
    app.setting.pos_config = res.data;

    // update print service url
    
    app.printService = new WebSocketPrinter({
      url: res.data.print_service_url,
      onConnect: () => {
         
      },
       onPrinterList: function (printers) {
        
      },
      //  onUpdate: (msg) => .log("Message:", msg),


});
  }

  
}
 


export async function onSelectCustomer(){
  const modal = await app.openModal({
    component:ComSelectCustomer
  })

  return modal;
}
export async function onViewTotalVisit(){
  const modal = await app.openModal({
    component:ComViewTotalVisit
  })

  return modal;
}
export async function onViewTotalAnnalOrder(){
  const modal = await app.openModal({
    component:ComViewTotalAnnalOrder
  })

  return modal;
}
export async function onViewTotalOrder(){
  const modal = await app.openModal({
    component:ComViewTotalOrder
  })

  return modal;
}
export async function onScanMemberCard(){
  const modal = await app.openModal({
    component: ComScanMemberCard,
    cssClass:"scan-member-ship-modal"
  })

  return modal;
}
export async function onAddCustomer(docname=""){
  const modal = await app.openModal({
    component: ComAddCustomer,
    componentProps:{
      docname:docname
    },
    cssClass: getPlateform() == "desktop"?"add-customer-modal":""
  })

  return modal;
}

 
export async function onOpenKeypad(title="Enter Number"){
  
  const result = await app.openModal({
    component: ComKeypad,
    componentProps:{title:title},
    cssClass:getPlateform() =="desktop"?"keypad-modal":""
  })

  return result;
}
export async function onInputPinCode(title="Enter Pin Code"){
  const result = await app.openModal({
    component: ComAuth,
    componentProps:{title:title},
     cssClass:getPlateform() =="desktop"?"keypad-modal":""
  })
   
  return result;
}

export async function onOpenKeyboard(props={}){
  if(!props.title){
    props.title = t("Enter Text")
  }
  const result = await app.openModal({
    component: Keyboard,
    componentProps:props,
    cssClass:"keyboard-modal"
  })


  return result;
}

export async function hasPermission(key,operation=""){
  const {currentUser} = useAuth();
  
    let user = {full_name:currentUser.value.full_name,username:currentUser.value.name, note:""}
    let posPermission = currentUser.value.pos_permission
    if(operation){
      if(app.setting.pos_config[operation] ==1){
          const result = await onInputPinCode()

          if(result){
         
            user.full_name = result.full_name
            user.username = result.username;
            posPermission = result.permission;
          }else {
            return  false;
          }
      }
      
    }



    if(posPermission[key]==0){
      await app.showWarning("You don't have permission to perform this action.")
      return false 
    }
    
    // check require note
    
    return user
}

export async function getOperationNote(title, operation){
  // operation is from pos config
  if( app.setting.pos_config[operation] == 0) return ""

  const note = await onOpenKeyboard({
    title:title,
    storageKey:operation
  })
  if(note){
    return note
  }
  return  false 
  

}
export async function onViewPendingOrder() {
  const result = await app.openModal({
    component:ComPendingOrderModal,
    cssClass:"pending-order-modal"
  })
  return result

}

export async function onInputNumber(props={title:"Enter Number"}) {
  const result = await app.openModal({
    component:ComInputNumberModal,
    componentProps:props,
    cssClass:"input-number-modal"
  })
  return result

}


export function bankersRound(number, decimals = null) {
  if(decimals == null){
    decimals = app.setting.currency_precision;
    
  }

  const factor = Math.pow(10, decimals);
  const n = number * factor;
  const integer = Math.floor(n);
  const fraction = n - integer;

  if (fraction > 0.5) return (integer + 1) / factor;
  if (fraction < 0.5) return integer / factor;

  // fraction == 0.5, round to even
  return (integer % 2 === 0 ? integer : integer + 1) / factor;
  
}


export function getWeekStartAndEnd(dateInput) {
  const date = dayjs(dateInput)

 const startOfWeek = date.startOf('isoWeek') // Monday
  const endOfWeek = date.endOf('isoWeek')     // Sunday

  return {
    start: startOfWeek.format('YYYY-MM-DD'),
    end: endOfWeek.format('YYYY-MM-DD')
  }
}

export function getDocStatusText(id){
  const status = [window.t("Draft"), window.t('Submitted'), window.t("Cancelled")]
  return status[id]
}

export function playSuccessSound(){
   successSound.currentTime = 0
            successSound.play()

}



export async function checkCouponCodeModal(barcode){
  if(barcode){

 
      const coupon = app.utils.getCouponNumber(barcode)

      const res = await app.getApi("epos_restaurant_2023.api.coupon.validate_coupon_code_exists",{
        coupon:coupon
      })
       if(!res.data){
        await app.showWarning(t("No coupon code found"));
        return;
      }
      
      
      window.disable_scan_check_coupon = true;
      await app.openModal({
        component:ComCheckCoupon,
        componentProps:{
          coupon_code:coupon,
          coupon_id: res.data
        },
        cssClass:"full"
      })

      window.disable_scan_check_coupon = false;

      
  }
  
}


export function getThisWeekAndLastWeekDate() {
  const today = new Date();

  // Get current week's Monday
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1 ...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // adjust if Sunday
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() + diffToMonday);
  thisWeekStart.setHours(0, 0, 0, 0);

  // Current week's Sunday
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
  thisWeekEnd.setHours(23, 59, 59, 999);

  // Last week's Monday
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  // Last week's Sunday
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

  return[ 
 {
 
      title:"Last Week",
      start: dayjs( dayjs(lastWeekStart).format("YYYY-MM-DD")),
      end:  dayjs( dayjs(lastWeekEnd).format("YYYY-MM-DD"))
    },
    {
   
      title:"This Week",
      start: dayjs(dayjs(thisWeekStart).format("YYYY-MM-DD")),
      end: dayjs(dayjs(thisWeekEnd).format("YYYY-MM-DD"))
    },
  ]
}
