import { createRouter, createWebHistory } from '@ionic/vue-router';
import { getRoute } from './routes';

 import { useAuth } from '@/hooks/useAuth';
 import { useApp } from '@/hooks/useApp';

const {isAuthenticated} = useAuth();
const {isAppLoadReady} = useApp()

const routes = getRoute();

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
})


router.beforeEach(async (to, from, next) => {

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
          }, 100)
        })
      await waitForSetup()
    }

 
  const station_name = await app.storageService.getItem("station_name")
 
  if (to.meta.requiresAuth && !isAuthenticated.value && to.path!="/select-workspace") {
    
    next("/select-workspace");

  } 
  else if(['/sale-coupon'].includes(to.path) && !station_name && to.path!="/enter-station-name"){
    next("/enter-station-name?return_url=" + to.path);
  }else if(to.path == "/enter-station-name" && station_name){
      alert(to.query.return_url?.toString())
       next(to.query.return_url?.toString() || "/home");
     
  }
  else {
    
      next();
   
    
  }
});


export default router
