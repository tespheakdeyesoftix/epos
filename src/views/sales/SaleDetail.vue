<template>
    <ion-page>
        <ToolBar>{{ t("Sale Detail") }} - {{ doc?.name }}</ToolBar>
        <ion-content class="ion-padding">
            <ion-card button="true" class="mx-0">
                <ion-card-content class="py-3 px-0">
                    <ion-item>
                        <ion-avatar slot="start">
                        <img :alt="doc?.customer_name" src="/assets/avatar.svg" />
                        </ion-avatar>
                        <ion-label>
                            <div>{{ doc?.customer_name }}</div>
                            <div>{{ doc?.customer }} {{doc?.phone_number?'/':''}} {{ doc?.phone_number }}</div>
                        </ion-label>
                    </ion-item>
                </ion-card-content>
            </ion-card>
            <!-- group product -->
            <template v-if="getSaleProducts.length > 0">
                <template v-for="(g, index) in getSaleProductGroupByKey" :key="index">
                    <div class="bg-red-700 text-white flex items-center justify-between" style="font-size: 10px; padding: 2px;">
                        <div>
                            <ion-icon size="small" :icon="timeOutline" ></ion-icon>
                            {{dayjs(g.order_time).format('HH:mm:ss')}}
                        </div>
                        <div><v-icon icon="mdi-account-outline" size="small" class="mr-1"></v-icon>{{ g.order_by }}</div>
                    </div>
                    <!-- product section -->
                    <div>
                        <template v-for="(d, index) in doc?.sale_products" :key="index">
                            <ion-card class="ion-no-margin mb-2">
                                <ion-item lines="none">
                                    <ion-avatar>
                                        <Img v-if="d?.photo" :src="d?.photo" />
                                        <div class="avatar-placeholder" v-else>{{ getAvatarLetter(d.product_name) }}</div>
                                    </ion-avatar>
                                    <ion-label>
                                        <h2 class="card-title">{{ d.product_code }} - {{ d.product_name }}</h2>
                                        <h2 class="card-subtitle">{{d.quantity}} x <com-currency :value="d.price"/></h2>
                                        <h2 v-if="d.modifiers && !d.is_timer_product" class="card-subtitle">{{d.modifiers}} (<com-currency :value="d.modifiers_price * d.quantity"/>)</h2>
                                        
                                        <h2 class="card-subtitle flex align-items-center gap-1" v-if="d.time_in || d.time_out">
                                            <ion-icon size="small" :icon="timeOutline"></ion-icon> {{ dayjs(d.time_in).format('hh:mm A') }} {{d?.time_out?'-':''}} {{ dayjs(d.time_out).format('hh:mm A') }}
                                        </h2> 
                                        <h2 class="card-subtitle flex align-items-center gap-1" v-else>
                                            <ion-icon size="small" :icon="timeOutline" ></ion-icon> {{ dayjs(d.creation).format('hh:mm:ss A') }}
                                        </h2>
                                    </ion-label>
                                    <ion-label slot="end" class="amount-container flex flex-column align-items-center">
                                        <div class="amount"><com-currency :value="d?.price" /></div>
                                        <ion-chip color="primary">{{ d.quantity }}</ion-chip>
                                    </ion-label>
                                </ion-item> 
                            </ion-card>
                        </template>
                    </div>
                </template>
            </template>
        </ion-content>
    </ion-page>


</template>
<script setup>
import { dice, searchOutline, personAddOutline, scanCircleOutline, timeOutline } from 'ionicons/icons';
import { onMounted, ref, computed } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import dayjs from 'dayjs';
import Enumerable from 'linq';


const t = window.t;
const doc = ref()

async function loadData() {
    const l = await app.showLoading()
    const res = await app.getDoc("Sale", app.route.params.name)
    if (res.data) {
        doc.value = res.data
    }
    await l.dismiss();

}
onMounted(async () => {
    
    await loadData()
})

const getSaleProducts = computed(() => { 
   
    if (!doc.value?.sale_products) return []
    return Enumerable.from(doc?.value.sale_products).orderByDescending("$.modified").toArray()
})

const getSaleProductGroupByKey = computed(() => {
    if (!doc?.value.sale_products) {
        return []
    } else {
        if (doc?.value.sale_products) {
            const group = Enumerable.from(doc?.value.sale_products).groupBy("{order_by:$.order_by,order_time:$.order_time}", "", "{order_by:$.order_by,order_time:$.order_time}", "$.order_by+','+$.order_time");
            return group.orderByDescending("$.order_time").toArray();
        }
        return []
    }
})
</script>
<style scoped>
.card-title {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 4px;
    padding-left: 10px;
}
.card-subtitle {
    font-size: 0.875rem;
    margin: 0;
    padding-left: 10px;
    line-height: 1.4;
} 
.amount {
    font-weight: bold;
    font-size: 1.1rem;
    text-align: right;
}
</style>