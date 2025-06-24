<template>
    <ion-page>
        <AppBar v-if="showAppBar ">
         {{ t("Coupon Detail") }}
        </AppBar>
        <ToolBar v-else>
         {{ t("Coupon Detail") }}
        </ToolBar>
        <ion-content>
           <div class="fix-container">
            <ion-card class="ion-padding">
                <ion-card-title>{{ t("Coupon Code Information") }}</ion-card-title>
                <ion-card-cotent>
                    {{t("Coupon Code")}}: 123 || 
                    {{t("Created By")}}: Phealkdey || 
                    {{t("Created Date")}}: Phealkdey || 
                </ion-card-cotent>
            </ion-card>
           
            <ion-card class="ion-padding"> 
                <ion-card-title>{{ t("Sale Information") }}</ion-card-title>
                <ion-on-card-content>
                    <ion-grid >
                        <ion-row>
                            <ion-col>
                                <ion-list>
                                    <ion-item  class="ion-no-padding">
                                        <ion-label>{{ t("Sale #") }}</ion-label>
                                        <ion-label slot="end">123</ion-label>
                                    </ion-item>
                                    <ion-item class="ion-no-padding">
                                        <ion-label>{{ t("Sale Date") }}</ion-label>
                                        <ion-label slot="end">123</ion-label>
                                    </ion-item>
                                    <ion-item  class="ion-no-padding">
                                        <ion-label>{{ t("Working Day") }}</ion-label>
                                        <ion-label slot="end">123</ion-label>
                                    </ion-item>
                                    
                                    <ion-item class="ion-no-padding">
                                        <ion-label>{{ t("Cashier Shift") }}</ion-label>
                                        <ion-label slot="end">123</ion-label>
                                    </ion-item>
                                    
                                    <ion-item class="ion-no-padding">
                                        <ion-label>{{ t("POS Station") }}</ion-label>
                                        <ion-label slot="end">123</ion-label>
                                    </ion-item>
                                    
                                    <ion-item class="ion-no-padding">
                                        <ion-label>{{ t("Customer") }}</ion-label>
                                        <ion-label slot="end">General Customer</ion-label>
                                    </ion-item>



                                </ion-list>
                            </ion-col>
                            <ion-col>
                                <ion-list>
                                    <ion-item  class="ion-no-padding">
                                        <ion-label>{{ t("Product") }}</ion-label>
                                        <ion-label slot="end">CP001 - $5.00 Coupon</ion-label>
                                    </ion-item>
                                    <ion-item  class="ion-no-padding">
                                        <ion-label>{{ t("Price") }}</ion-label>
                                        <ion-label slot="end">50</ion-label>
                                    </ion-item>
                                    
                                    <ion-item class="ion-no-padding">
                                        <ion-label>{{ t("Coupon Value") }}</ion-label>
                                        <ion-label color="danger"   slot="end">150</ion-label>
                                    </ion-item>

                                </ion-list>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-on-card-content>
            </ion-card>
            <ion-card class="ion-padding">
                <ion-card-title>{{ t("Coupon Transaction History") }}</ion-card-title>
            </ion-card>
        </div>

        </ion-content>
        <ComFooter>
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
<style scoped>
ion-list,ion-item{
     --background: transparent; 
     background: transparent !important;
}
</style>