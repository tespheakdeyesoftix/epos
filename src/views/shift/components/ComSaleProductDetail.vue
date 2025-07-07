<template>
    <div class="fix-container">
        <ion-card class="ion-no-maring">
            <ion-card-header>
                <ion-card-title>
                    {{ t("Sale Product Summary") }}
                </ion-card-title>
            </ion-card-header>
            <ion-card-content>
                {{ cashier_shift }}
            </ion-card-content>
        </ion-card>
    </div>
</template>
<script setup>
const props =defineProps({
    cashier_shift:String
})
const t = window.t;
function getData(){
    const sql = "select "
}
</script>