import { createRouter } from '@ionic/vue-router';
import { createWebHashHistory } from 'vue-router';
import { getRoute } from './routes';

 import { useAuth } from '@/hooks/useAuth';
 import { useApp } from '@/hooks/useApp';
import dayjs from 'dayjs';
import { constructOutline } from 'ionicons/icons';

const {isAuthenticated} = useAuth();
const {isAppLoadReady,isCashierShiftOpened,isWorkingDayOpened} = useApp()

const routes = getRoute();

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes
})


router.beforeEach(async (to, from, next) => {
  // add from route path to window object, in case that we want to go back to previouse router on delete operation\
  window.fromRoute = from.path;
  
  // this logic here is set timer to check wait until all setting is geting from 
  // db then we start check router redirecting
  
  if (!isAppLoadReady.value) {
      const waitForSetup = () =>
        new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (isAppLoadReady.value) {
              clearInterval(interval)
              resolve()
            }
          }, 1000)
        })
      await waitForSetup()
    }

 
  const station_name = await app.storageService.getItem("station_name")
  const showLogin = await app.storageService.getItem("show_login")
  const currentProperty = await app.storageService.getItem("current_property")
  


  if(!currentProperty && to.path !="/select-workspace" && to.path !='/add-workspace' ){
    next("/select-workspace");
  }else  if (to.meta.requiresAuth && !isAuthenticated.value && to.path!="/select-workspace" && (app.setting.allow_login_multiple_site==1 || app.setting.allow_login_multiple_site==undefined)) {
     
    next("/select-workspace");

  }else  if (!isAuthenticated.value && to.path!="/login" && showLogin=="1" && currentProperty!=null) {
    next("/login");
   
  }else  if (to.path =="/login" && !currentProperty) {
    
    next("/select-workspace");
  } 
  else if(['/sale-coupon','/start-working-day',"/start-shift","/top-up","/redeem"].includes(to.path) && !station_name && to.path!="/enter-station-name"){
    next("/enter-station-name?return_url=" + to.path);

  }else if(['/sale-coupon',"/top-up","/redeem"].includes(to.path) && !app.setting?.cashier_shift?.name){
    // next("/start-shift?return_url=" + to.path);
      next("/message/No Shift Opened?&return_url=" + to.path)
  }
  else if(to.path == "/enter-station-name" && station_name){
       next(to.query.return_url?.toString() || "/home");
  }
  else if(to.name == "EditSaleCoupon"){
    // validate sale 
    const result = await app.sale.checkSaleDoc(to.params.name);
 
    if(result>0){
      next("/message/" + result  + "?name=" + to.params.name);
    }else {
      next()
    }
  }
  else if (to.path == "/start-working-day"){
    const result = await app.shift.checkWorkingDay()
    if(result>0){
       next("/message/" + result )
    }else {
      next();
    }
  }
  else if (to.path == "/close-shift"){
    const result = await app.shift.validateCloseShift()
    if(result!=""){
       next("/message/" + result )
    }else {
      next();
    }
  }
  else if (to.path == "/close-working-day"){
    if(isCashierShiftOpened.value){
      next("/message/204") //show error shift is alreay open and ask for close first
      return;
    }
    

    const result = await app.shift.checkWorkingDay()
   
    if(result == 0){
      app.utils.getSetting()
      next("/message/201")
    }else {
      
      next();
    }
  }
  else if (to.path == "/start-shift"){
    const result = await app.shift.checkCashierShift()
    if(result> 0){
      next("/message/" + result)
    }else {
      next();
    }
  }
  
  else {
      
      next();
   
    
  }
});



export default router
