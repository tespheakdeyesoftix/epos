<template>
  <ion-app>
    <DrawerMenu v-if="isAuthenticated && !hideDrawerRoutes.includes(currentRoute)" />
    <ion-router-outlet id="main-content" />

  </ion-app>
  <Toast />
</template>

<script setup lang="ts">
import { watch, ref, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from 'vue-router';
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/hooks/useAuth';
import DrawerMenu from "@/views/layouts/DrawerMenu.vue"
import { Capacitor } from '@capacitor/core';
import { initializeScanner } from '@/helpers/scan-barcode.js'
import { StatusBar, Style } from '@capacitor/status-bar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
 import useBarcodeDetector from '@programic/vue-barcode-detector';
const barcodeDetector = useBarcodeDetector();
const toast = useToast();
 
 


const ionRouter = useIonRouter();
const { isAuthenticated } = useAuth();

const route = useRoute();
const title = ref(route.meta.title || 'ePOS');
const hideTab = ref(false);
const currentRoute = route.path
const hideDrawerRoutes = ["/login", "/select-workspace"]

const router = useRouter();




// set ion router to app so it easy to access from compoennty
app.setIonRouter(ionRouter)
app.setRoute(route)
app.setRouter(router)


// Watch for route changes and update the title
watch(() => route.meta.title, (newTitle) => {
  title.value = newTitle || 'ePOS';

});


function onListeningScanBarCode() {
  
  barcodeDetector.listen(async (barcodeData) => {
      if(!barcodeData.value) return;
    if (barcodeData.value && !window.disable_scan_check_coupon) {
      app.utils.checkCouponCodeModal(barcodeData.value)
    }

  });
}

onMounted(async () => {
 
  barcodeDetector.stopListening();
  
  onListeningScanBarCode();

  window.toast = toast;
  if (Capacitor.getPlatform() !== "web") {
    const toolbarColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--ion-toolbar-background')
      .trim();
    await StatusBar.setOverlaysWebView({ overlay: false }); // Optional: ensures webview doesn't go under status bar
    await StatusBar.setStyle({ style: Style.Light }); // Use white icons for dark background
    await StatusBar.setBackgroundColor({ color: toolbarColor }); // Use white icons for dark background
    await initializeScanner();
  }
})

</script>

<style>
@media (max-width: 640px) {
  .p-toast {
    width: 90vw !important;
  }

}
</style>
