<template>
    <ion-page>
        <AppBar>
            {{ t("Start Working Day") }}
        </AppBar>
        <ion-content>
            <ion-item>
                <ion-input label="POS Profile" label-placement="stacked" placeholder="POS Profile"></ion-input>
            </ion-item>
            <ion-item>
                <ion-input label="Working Date" label-placement="stacked" placeholder="Working Date"></ion-input>
            </ion-item>
        </ion-content>
    </ion-page>
</template>
<script setup>
    const t = window.t;
</script>