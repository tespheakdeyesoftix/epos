<template>
    <ion-page>
        <AppBar>{{ error.page_title }}</AppBar>
        <ion-content>
            {{ error.message }} 
            
            <ion-button v-for="(d,index) in error.actions" :key="index" :color="d.color"  @click="openRoute(d.router_link)">
                {{ d.title }}
            </ion-button>
            
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';


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
        message: t("There's no working opened."),
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