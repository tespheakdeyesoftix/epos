<template>
    <ion-page>
        <AppBar>{{ error.page_title }}</AppBar>
        <ion-content class="ion-padding" :fullscreen="true">
      <div class="error-container">
        <ion-icon :icon="error.icon || warningOutline" class="error-icon"></ion-icon>

        <h2 class="error-title">{{  error.page_title }}</h2>
        <p class="error-message">
          {{ error.message }}
        </p>

        <div class="button-group">
          <ion-button v-for="(d,index) in error.actions" :key="index" :color="d.color"  @click="openRoute(d.router_link)">
                    {{ d.title }}
                </ion-button>
        </div>
      </div>
    </ion-content>
         
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import { alertCircleOutline, warningOutline, calendarOutline } from 'ionicons/icons';

const t = window.t;
function openRoute(url){
    app.ionRouter.navigate(url,"back","replace")
}
// error code here is static set

const errorCodes =
{
    1: {
        
        message: t("This sale coupon transaction number " + app.route.query.name + " is not exist."),
        page_title:t("Sale Coupon Not Found"),
        icon:"",
        actions:[
            {title:t("Go Home"),router_link:"/home","color":"primary"},
            {title:t("New Sale Coupon"),router_link:"/sale-coupon","color":"success"},
        ]
    },
    2:{
        message: t("This sale coupon is already closed"),
        page_title:t("Sale Coupon is Closed"),
        actions:[
            {title:t("Go Home"),router_link:"/home","color":"primary"},
            {title:t("New Sale Coupon"),router_link:"/sale-coupon","color":"success"},
        ]
    },
    200:{
        message: t("Working is already opened"),
        page_title:t("Working Day"),
        actions:[
            {title:t("Go Home"),router_link:"/home","color":"primary"}
        ]
    },
    201:{
        message: t("There's no working day opened."),
        page_title:t("Close Working Day"),
        actions:[
            {title:t("Go Home"),router_link:"/home","color":"primary"}
        ]
    },
    202:{
        message: t("Cashier shift is already opened"),
        page_title:t("Start Cashier Shift"),
        actions:[
            {title:t("Go Home"),router_link:"/home","color":"primary"}
        ]
    },
    203:{
        page_title:t("Start Cashier Shift"),
        message: t("There's no working day opened. Please start working day first."),
        icon:calendarOutline,
        actions:[
            {title:t("Go Home"),router_link:"/home","color":"primary"},
            {title:t("Start Working Day Now"),router_link:"/start-working-day","color":"secondary"}
        ]
    },
    204:{
        page_title:t("Close Working Day"),
        message: t("There's cashier shift opened. Please close cashier shift first"),
        actions:[
            {title:t("Go Home"),router_link:"/home","color":"primary"},
            {title:t("Close Cashier Shift Now"),router_link:"/close-shift","color":"danger"}
        ]
    },
}

const error = ref(errorCodes[app.route.params.id])
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
      margin-top: -100px;
}

.error-icon {
  font-size: 64px;
  color: var(--ion-color-danger);
  margin-bottom: 16px;
}

.error-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.error-message {
  font-size: 16px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
  max-width: 500px;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>