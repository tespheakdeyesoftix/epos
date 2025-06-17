<template>

    
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button />
          </ion-buttons>
          <ion-title><slot></slot></ion-title>
           <ion-buttons slot="end">
            <slot name="end"></slot>
 <ComUserProfile />
           </ion-buttons>
         
        </ion-toolbar>
      </ion-header>

  </template>
  <script setup lang="ts">
  import {  IonButtons, IonTitle, IonMenuButton } from '@ionic/vue';
 
    import ComUserProfile from "@/views/layouts/ComUserProfile.vue"  
  
    import { useAuth } from '@/hooks/useAuth';
    const {isAuthenticated} = useAuth();


  </script>
  