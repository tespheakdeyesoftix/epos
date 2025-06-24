<template>
    <ion-page>
        <AppBar v-if="showAppBar ">
         {{ t("Coupon Detail") }}
        </AppBar>
        <ToolBar v-else>
         {{ t("Coupon Detail") }}
        </ToolBar>
        <ion-content>
            copon detail
        </ion-content>
        <ComFooter>
            <ion-button>{{ t("View Detail") }}</ion-button>
            <ion-button>{{ t("Edit") }}</ion-button>
            <ion-button color="danger">{{ t("Delete") }}</ion-button>
        </ComFooter>
    </ion-page>
</template>
<script setup>

import { ref } from 'vue';

const t = window.t;
const showAppBar = ref(app.route.query.appbar==1)
</script>