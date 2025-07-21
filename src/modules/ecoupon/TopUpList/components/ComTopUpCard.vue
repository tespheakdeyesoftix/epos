<template>
    
    <ion-card button class="ion-no-margin mb-3"  :routerLink="'/sale-detail/' + data.name">
        <ion-item lines="none" style="--background: rgba(255, 0, 0, 0);">
             

            <!-- Middle Text -->
            <ion-label>
                <h2 class="card-title">{{ data.name }}</h2>
                <p class="card-subtitle">
                    <ion-text color="medium-tint">
                        <span>
                            {{t("Create By")}}: {{ data.closed_by.split('@')[0]}}
                        </span>
                        <div>
                            {{dayjs(data?.closed_date).format('DD/MM/YYYY hh:mm A')}}
                        </div>
                    </ion-text>
                    
                </p>
                
            </ion-label>
            <div slot="end" style="font-size: 20px;font-weight: bold;">
                <ion-label color="primary"><com-currency :value="data?.grand_total" /></ion-label>
            </div>
        </ion-item>
    </ion-card>
</template>

<script setup>

const props = defineProps({
    data: Object
})

import { ref } from "vue";
 
import dayjs from "dayjs";
 
const t = window.t;
 
const formatDate = (value) =>{
  return dayjs(value).format("DD-MM-YYYY")
} 
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
    color: #666;
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
    color: #2dd36f;
    text-align: right;
}
</style>