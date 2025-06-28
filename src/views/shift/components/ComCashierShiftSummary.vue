<template>
    <div class="fix-container">
    <ion-grid>
        <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-content>
                    <stack row equal>
                        <ion-label><strong>{{ t("Cashier Shift #") }}:</strong></ion-label>
                        <ion-label>{{ data?.shift_doc.name }}</ion-label>
                    </stack>
                    
                    <stack row equal>
                        <ion-label><strong>{{ t("Working Day #") }}:</strong></ion-label>
                        <ion-label>{{ data?.shift_doc.working_day }}</ion-label>
                    </stack>
                    
                    <stack row equal>
                        <ion-label><strong>{{ t("Business Branch") }}:</strong></ion-label>
                        <ion-label>{{ data?.shift_doc.business_branch }}</ion-label>
                    </stack>
                    
                    <stack row equal>
                        <ion-label><strong>{{ t("Outlet") }}:</strong></ion-label>
                        <ion-label>{{ data?.shift_doc.outlet }}</ion-label>
                    </stack>
                    
                    <stack row equal>
                        <ion-label><strong>{{ t("POS Profile") }}:</strong></ion-label>
                        <ion-label>{{ data?.shift_doc.pos_profile }}</ion-label>
                    </stack>
                    <stack row equal>
                        <ion-label><strong>{{ t("Exchange Rate") }}:</strong></ion-label>
                        <ion-label>
                            
                            <ComCurrency :value="1"/> = <ComCurrency :value="data?.exchange_rate" :currency="secondCurrency" />
                        </ion-label>
                    </stack>

                </ion-card-content>
            </ion-card>
        </ion-col>
        <ion-col>
            <ion-card>
                <ion-card-content>
                     <stack row equal>
                        <ion-label><strong>{{ t("Posting Date") }}:</strong></ion-label>
                        <ion-label>{{ dayjs(data?.shift_doc.posting_date).format("DD/MM/YYYY") }}</ion-label>
                    </stack>
                     <stack row equal>
                        <ion-label><strong>{{ t("Opened By") }}:</strong></ion-label>
                        <ion-label>{{  data?.shift_doc.owner.split("@")[0] }}</ion-label>
                    </stack>
                     <stack row equal>
                        <ion-label><strong>{{ t("Created Date") }}:</strong></ion-label>
                        <ion-label>{{  dayjs(data?.shift_doc.creation).format("DD/MM/YYYY hh:mm A") }}</ion-label>
                    </stack>
                     <stack row equal>
                        <ion-label><strong>{{ t("Status") }}:</strong></ion-label>
                        <ComStatus status="Opened" color="danger" v-if="data?.shift_doc.is_closed == 0"/>
                        <ComStatus status="Closed"  v-else />
                    </stack>
                    
                     <stack row equal v-if="data?.shift_doc.is_closed == 1">
                        <ion-label><strong>{{ t("Closed By") }}:</strong></ion-label>
                        <ion-label>{{  data?.shift_doc.closed_by.split("@")[0] }}</ion-label>
                    </stack>
                     <stack row equal v-if="data?.shift_doc.is_closed == 1">
                        <ion-label><strong>{{ t("Closed Date") }}:</strong></ion-label>
                       <ion-label>{{  dayjs(data?.shift_doc.closed_date).format("DD/MM/YYYY hh:mm A") }}</ion-label>
                    </stack>
                    
                </ion-card-content>
            </ion-card>
        </ion-col>

        </ion-row>
        <ion-row>
            
        </ion-row>
    </ion-grid>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { ref } from 'vue';


const props = defineProps({
    data:Object
})
const t = window.t;
const secondCurrency = ref(app.setting.second_currency)
</script>