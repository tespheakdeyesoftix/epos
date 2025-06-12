 

import { useAuth } from '@/hooks/useAuth';
const  {checkUserLogin,isAuthenticated} = useAuth();

export async function setup(){
    
    let currentProperty = await app.storageService.getItem("current_property");
 
    currentProperty = JSON.parse(currentProperty)
     await checkUserLogin();
 alert(123)
  if (isAuthenticated.value){
    
  await getSetting()
  }
   
 
    
}

async function getSetting(){

const res = await app.postApi("epos_restaurant_2023.api.setting.get_settings")
console.log(res.data)
alert(123)
if(res.data){
    app.setting = {...app.setting, ...res.data.setting}
}
}
