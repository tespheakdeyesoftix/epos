<template>
        <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title><slot></slot></ion-title>
        <ion-buttons slot="end">
          <slot name="end"></slot>
      </ion-buttons>
      </ion-toolbar>
    </ion-header>
</template>