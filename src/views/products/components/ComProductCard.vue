<template>
    
    <ion-card class="ion-no-margin mb-3" button :routerLink="'/add-product/' + data.name">
        <ion-item lines="none">
            <!-- Avatar -->
            <ion-avatar>
                <Img v-if="data.photo" :src="data.photo" />
                <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data.product_name_en) }}</div>
            </ion-avatar>

            <!-- Middle Text -->
            <ion-label>
                <h2 class="card-title">{{ data.product_name_en }} <ComStatus :status = "data.status" /></h2>
                <h2 class="card-subtitle">{{data.name}}</h2>
                <h2 class="card-subtitle">{{ data.product_category }}</h2>
                 
            
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

<style scoped>
.card-title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 4px;
    padding-left: 10px;
}

.card-subtitle {
    font-size: 0.875rem;
    margin: 0;
    padding-left: 10px;
    line-height: 1.4;
}


.amount-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    min-width: 70px;
}

.amount {
    font-weight: bold;
    font-size: 1rem;
    
    text-align: right;
}
</style>