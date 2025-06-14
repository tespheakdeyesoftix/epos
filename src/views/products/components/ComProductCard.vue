<template>
   <div style="margin-bottom: -10px;">
     <ion-card class="ion-no-margin mb-3 product-item-card" button :routerLink="'/add-product/' + data.name">
        <ion-item lines="none">
            <!-- Avatar -->
            <ion-avatar style="height: 50px;width: 50px;">
                <Img v-if="data.photo" :src="data.photo" />
                <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data.product_name_en) }}</div>
            </ion-avatar>
            <!-- Middle Text -->
            <ion-label>
                <h2 class="card-title">{{ data.product_name_en }}</h2>
                <h2 class="card-subtitle">{{data.name}}</h2>
                <p class="card-subtitle">
                    <ion-text color="dark">
                        <span v-tooltip="dayjs(data?.modified).format('ddd, DD MM YYYY HH:mm A')">
                    {{t("Last modified:")}} {{ data.modified_by.split('@')[0]}} - {{ dayjs(data?.modified).fromNow() }}</span>
                    </ion-text>
                </p>
            </ion-label>
            <!-- Right-aligned Amount -->
            <div slot="end" class="amount-container">
                <div class="amount"><com-currency :value="data?.price" />
                </div>
            </div>
        </ion-item>
    </ion-card>
   </div>
</template>

<script setup>
const props = defineProps({
    data: Object
})
const route = useRoute();

import { ref } from "vue";
import { useRoute } from "vue-router";
import { getAvatarLetter } from "@/helpers/utils"
import dayjs from "dayjs";
const t = window.t;
</script> 