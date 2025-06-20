 

import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/hooks/useApp.ts';

const  {checkUserLogin,isAuthenticated} = useAuth();
const  {isAppLoadReady} = useApp();

export async function setup(){
    
    let currentProperty = await app.storageService.getItem("current_property");
 
    currentProperty = JSON.parse(currentProperty)
     await checkUserLogin();
    
  if (isAuthenticated.value){
    
  await app.utils.getSetting()
  }
   
  

 isAppLoadReady.value = true;

}
 