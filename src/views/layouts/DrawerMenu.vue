<template>
  <ion-menu content-id="main-content">
    
      <!-- Profile Section -->
       
      <div class="profile-section"> 
       
        <ion-avatar class="profile-avatar"> 
          <Img v-if="currentUser?.photo"  :src="currentUser?.photo"/>
          <div class="avatar-placeholder" v-else>{{ getAvatarLetter(currentUser.full_name) }}</div> 
        </ion-avatar>
        <ion-label class="profile-name">{{ currentUser.full_name }}</ion-label>
      </div> 
      <ion-content>
      <!-- Menu List -->
        <!-- start loop menu -->
         <template v-for="p in drawerMenus.filter(x=>!x.parent_mobile_app_module)" :key="p.name" >
            <ion-menu-toggle v-if="p.is_group==0">  
          <ion-item lines="full" button :routerLink="p.route_url">
              <div  v-html="p.icon" :style="{height: '25px',width: '25px',marginRight: '20px',color:`var(--ion-color-${p.color})`}"></div>
                <ion-label>{{ t(p.title) }}</ion-label>
            </ion-item>
            </ion-menu-toggle>
           
<!-- if is group == 1 we render accoundioun -->
<ion-accordion-group v-else  class="ion-no-padding ion-no-margin" style=" border-bottom: 1px solid #ddd; ">
        <ion-accordion>
      <ion-item slot="header"   >
        <div  v-html="p.icon" :style="{height: '25px',width: '25px',color:`var(--ion-color-${p.color})`}"></div>
        <ion-label class="ml-4">{{ t(p.title) }}</ion-label>
      </ion-item>
      <div  slot="content">
          <ion-menu-toggle v-for="m in drawerMenus.filter(r=>r.parent_mobile_app_module==p.name)" :key="m.name">  
          <ion-item lines="full" button :routerLink="m.route_url">
            <ion-icon slot="start" :icon="chevronForwardOutline" class="ion-no-margin" style="margin-right:15px;margin-left: 10px;"></ion-icon>
            <ion-label>{{ t(m.title) }}</ion-label>
            </ion-item>
            </ion-menu-toggle>

      </div>
    </ion-accordion>
    </ion-accordion-group>
         </template>
      
         </ion-content>
         <ion-footer>
         
      <!-- Bottom Section -->
      
        <div class="app-info">
          <ion-label class="app-name" color="medium">{{ t("ePOS by ESTC") }}</ion-label>
          <ion-label class="app-version">{{ t("Version") }} 1.0.0</ion-label>
        </div>
        <ion-button expand="full" class="logout-button" color="danger" shape="round" @click="onLogout">
          <ion-icon  :icon="logOutOutline" slot="start"></ion-icon>
          {{ t("Logout") }}
        </ion-button>
     
         </ion-footer>

  
  </ion-menu>
</template>

<script setup >
import {
  IonMenuToggle
} from '@ionic/vue';
import {
   
  chevronForwardCircleOutline,
  chevronForwardOutline,
  logOutOutline
  
} from 'ionicons/icons'; 
import { useAuth } from '@/hooks/useAuth'; 
const { logout, currentUser } = useAuth();
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
 
import {getAvatarLetter} from "@/helpers/utils"
import { onMounted, ref } from 'vue'; 

const drawerMenus = ref([])


const onLogout = async () => {
  await logout();
  ionRouter.navigate('/select-workspace', 'back', 'replace');
};

onMounted(async ()=>{
  const res = await app.getDocList("Mobile App Module",{
    fields:["name","parent_mobile_app_module","is_group","title","route_url","icon","color"],
    filters:[["show_in_drawer_menu","=","1"],["is_active","=",1]],
     orderBy: {
            field: 'sort_order',
            order: 'asc',
        }
  })
 if (res.data){
  drawerMenus.value =res.data
 
 }
})

</script>

<style scoped>
/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
                url(/assets/home-bg.jpeg) no-repeat center center / cover; 
  padding: 20px 0;
}
 
/* Center Avatar */
.profile-avatar {
  width: 80px;
  height: 80px;
  border: 3px solid white;
  margin-bottom: 10px;
}
/* Placeholder styling when no image */
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  /* Blue background */
  color: white;
  font-size: 25px;
  font-weight: bold;
  border-radius: 50%;
  text-transform: uppercase;

}
/* Profile Name */
.profile-name {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-top: 5px;
}
  
 
 
/* App Info */
.app-info {
  margin-top:10px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}

.app-name {
  font-weight: bold;
  display: block;
}

.app-version {
  opacity: 0.7;
}
</style>
