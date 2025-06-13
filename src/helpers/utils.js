import { modalController, alertController, toastController, loadingController, popoverController } from '@ionic/vue';
import ComScanBarcode from "@/views/components/ComScanBarcode.vue";
import ComSelectDate from "@/views/components/public/ComSelectDate.vue";

import { isPlatform,getPlatforms } from '@ionic/vue';
 
export function imageUrl(imageUrl, baseUrl = "") {
  if (imageUrl?.startsWith("https://") || imageUrl?.startsWith("http://")) {
    return imageUrl;
  }
  if (baseUrl !== "") {
    return baseUrl + imageUrl;
  }

  const strCurrentProperty = window.storageService.getItem("current_property");
  if (strCurrentProperty) {
    const property = JSON.parse(strCurrentProperty);
    return property.api_url + imageUrl;
  }
}

export async function showWarning(message) {
  const toast = await toastController.create({
    message: message,
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

export async function selectDate(props=null) {

 
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

  if (!props.cssClass) {
    props.cssClass = "desktop-modal";
  }

  const modal = await modalController.create({ ...props });

  modal.present();
  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    return data;
  }
  return false;
}

export async function onConfirm(title = "Confirm", message = "Are you sure you want to process this action?", options = {}) {
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
  const result = openModal({
    component: ComScanBarcode,
    componentProps: {
      title: "Scan Barcode",
    }
  });

  return result;
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

export function currencyFormat(number, format) {
  // Match the number format part (e.g., #,###,##0.00, #,###,##0.###)
  const numberPattern = /[#0.,]+/;
  const match = format.match(numberPattern);
  if (!match) return number.toString();

  const numFormat = match[0];
  const startIndex = format.indexOf(numFormat);
  const endIndex = startIndex + numFormat.length;

  const prefix = format.slice(0, startIndex).trim();
  const suffix = format.slice(endIndex).trim();

  // Parse decimal part from format
  let minFractionDigits = 0;
  let maxFractionDigits = 0;

  const decimalMatch = numFormat.match(/\.(0+|#+)$/);
  if (decimalMatch) {
    const decimalPart = decimalMatch[1];
    if (decimalPart[0] === '0') {
      // Fixed decimals - number of zeros = exact decimals
      minFractionDigits = decimalPart.length;
      maxFractionDigits = decimalPart.length;
    } else if (decimalPart[0] === '#') {
      // Optional decimals - number of # = max decimals, min 0
      minFractionDigits = 0;
      maxFractionDigits = decimalPart.length;
    }
  }

  // Format number accordingly
  const formattedNumber = number.toLocaleString('en-US', {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  });

  // Compose final string with currency symbol position
  if (prefix && !suffix) {
    return `${prefix} ${formattedNumber}`;
  } else if (!prefix && suffix) {
    return `${formattedNumber} ${suffix}`;
  } else if (prefix && suffix) {
    return `${prefix} ${formattedNumber} ${suffix}`;
  } else {
    return formattedNumber;
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
  if( isPlatform("ipad") || isPlatform("electron") || isPlatform("desktop") || isPlatform("tablate")){
    return "desktop"
  }
  return "mobile"


}

export function getCouponNumber(coupon){
  if(coupon.toLowerCase().startsWith("http")){
    const arrayCoupons =  coupon.split("=");
    
    if(arrayCoupons.length<2){
      return ""
    }
    return arrayCoupons[1]

  }
   
  return coupon
  

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

  const station_name = await app.storageService.getItem("station_name");
  
    const res = await app.postApi("epos_restaurant_2023.api.setting.get_settings",{
      station_name:station_name
    })

    console.log(res.data)

    if (res.data) {
        app.setting = { ...app.setting, ...res.data }
        if(!app.setting.property){
              let currentProperty = await app.storageService.getItem("current_property");
              if(currentProperty){
app.setting.property = JSON.stringify(currentProperty);
              }
              
        }
        if(res.data.pos_profile){
          getPOSConfig();
    }

        await app.storageService.setItem("show_login",app.setting.allow_login_multiple_site==1?0:1)
    }
}


export async function getPOSConfig(pos_config){
  const res =await app.getDoc("POS Config",pos_config)
  console.log(res);

  if(res.data){
    
    app.setting.pos_config = res.data;
  }

  
}