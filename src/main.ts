import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { storageService } from '@/services/storage-service';
import { useAuth } from '@/hooks/useAuth';
import "@/helpers/global-function.js"
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';


import Aura from '@primeuix/themes/aura';
import "/node_modules/primeflex/primeflex.css"

import { 
  IonLabel, 
  IonChip, 
  IonPage,
  IonContent, 
  IonicVue,
  useIonRouter,
  IonRippleEffect,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle, 
  IonIcon ,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonSearchbar,
  IonList,
  IonItem,
  IonFab,
  IonFabButton,
  IonSegment,
  IonSegmentButton,
  IonSegmentView,
  IonRefresherContent,
  IonRefresher,
  IonProgressBar,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFooter,
  IonModal,
  IonPopover,
  IonAvatar,
  IonDatetime,
  IonDatetimeButton,
  IonAccordionGroup,
  IonAccordion,
  IonText,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */


/* import '@ionic/vue/css/palettes/dark.always.css';*/
/* import '@ionic/vue/css/palettes/dark.class.css';  */

import '@ionic/vue/css/palettes/dark.system.css'; 

/* Theme variables */
import './theme/variables.css';
import AppBar from '@/views/layouts/AppBar.vue';
import ToolBar from '@/views/layouts/ToolBar.vue';
import Loading from '@/views/components/Loading.vue';
import Img from "@/views/components/Img.vue"
import ComCurrency from '@/views/components/public/ComCurrency.vue';
import ComStatus from '@/views/components/public/ComStatus.vue';
import BaseModal from '@/views/components/BaseModal.vue';
import i18n from '../i18n'; // Import i18n config
import { showToast,showLoading, openModal } from '@/helpers/utils';
import longPress from '@/directives/long-press';

import ComSelect from '@/views/components/ComSelect.vue';
import DocList from '@/views/components/document-list/DocList.vue';
import Document from '@/views/components/document-list/Document.vue';
import ComInput from '@/views/components/public/ComInput.vue';

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/km' // import Khmer locale
let currentLang = storageService.getItem("lang") || 'km'
dayjs.locale(currentLang) 
dayjs.extend(relativeTime)

// attach service to window easy to call it later

window.storageService = storageService;

// register function to window object
window.t = i18n.global.t;
window.showWarning = (message: string) => showToast(message, "warning");
window.showSuccess = (message: string) => showToast(message, "success");
window.showError = (message: string) => showToast(message, "danger");
window.showLoading = (message: string='Loading') => showLoading(message);
window.openModal = ( props:object) =>openModal(props);

const  {checkUserLogin} = useAuth(router);
const app = createApp(App)
.use(IonicVue)



async function init() {
  
  // check if have current login user then login
 
  await checkUserLogin();
  
  // set frappe app

 
  app.use(router);
  app.use(i18n);
  app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

  app.component('AppBar', AppBar)
  app.component('ToolBar', ToolBar)
  app.component('ComSelect', ComSelect)
  app.component('ion-footer', IonFooter)
  app.component('Loading', Loading)
  app.component('ion-ripple-effect', IonRippleEffect)
  app.component('ion-infinite-scroll', IonInfiniteScroll)
  app.component('ion-infinite-scroll-content', IonInfiniteScrollContent)
  app.component('ion-card', IonCard)
  app.component('ion-card-title', IonCardTitle)
  app.component('ion-card-content', IonCardContent)
  app.component('ion-card-header', IonCardHeader)
  app.component('ion-card-subtitle', IonCardSubtitle)
  app.component('ion-page', IonPage)
  app.component('ion-content', IonContent)
  app.component('ion-icon',IonIcon)
  app.component('ion-chip',IonChip)
  app.component('ion-avatar',IonAvatar)
  app.component('ion-label',IonLabel)
  app.component('ion-button',IonButton)
  app.component('ion-buttons',IonButtons)
  app.component('ion-back-button',IonBackButton)
  app.component('ion-header',IonHeader)
  app.component('ion-toolbar',IonToolbar)
  app.component('ion-title',IonTitle)
  app.component('ion-img',IonImg)
  app.component('ion-searchbar',IonSearchbar)
  app.component('ion-list',IonList)
  app.component('ion-item',IonItem)
  app.component('ion-fab',IonFab)
  app.component('ion-fab-button',IonFabButton)
  app.component('ion-segment',IonSegment)
  app.component('ion-segment-button',IonSegmentButton)
  app.component('ion-segment-view',IonSegmentView)
  app.component('ion-refresher-content',IonRefresherContent)
  app.component('ion-refresher',IonRefresher)
  app.component('ion-progress-bar',IonProgressBar)
  app.component('ion-spinner',IonSpinner)
  app.component('ion-modal',IonModal)
  app.component('ion-popover',IonPopover)
  app.component('ion-datetime',IonDatetime)
  app.component('ion-datetime-button',IonDatetimeButton)
  app.component('ion-accordion-group',IonAccordionGroup)
  app.component('ion-accordion',IonAccordion)
  app.component('ion-text',IonText)
  app.component('ion-input',IonInput)
  app.component('ion-select',IonSelect)
  app.component('ion-select-option',IonSelectOption)
  

  app.component('Img',Img)
  app.component('ComCurrency',ComCurrency)
  app.component('DocList',DocList)
  app.component('Document',Document)
  app.component('ComStatus',ComStatus)
  app.component('ComInput',ComInput)

  app.component('BaseModal',BaseModal)
  app.directive('longPress', longPress);
  app.directive('tooltip', Tooltip);

  await router.isReady();
  
  app.mount("#app");
}

init();

