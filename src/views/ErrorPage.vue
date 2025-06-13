<template>
    <ion-page>
        <AppBar>{{ error.page_title }}</AppBar>
        <ion-content>
            {{ error.message }} 
            
            <ion-button v-for="(d,index) in error.actions" :key="index" :color="d.color" :routerLink="d.router_link">
                {{ d.title }}
            </ion-button>
            
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';


const t = window.t;
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
}

const error = ref(errorCodes[app.route.params.id])
</script>