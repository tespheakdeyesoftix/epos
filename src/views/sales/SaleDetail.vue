<template>
    <ion-page>
        <ToolBar>{{ t("Sale Detail") }}</ToolBar>
        <ion-content class="ion-padding">
            <ion-card button="true" class="mx-0">
                <ion-card-content>
                    <ion-grid>
                        <ion-row>
                            <ion-col size="auto">
                                <ion-chip class="m-0">
                                    <ion-avatar>
                                        <img :alt="doc?.customer_name" src="/assets/avatar.svg" />
                                    </ion-avatar>
                                    <ion-label>{{ doc?.customer_name }}</ion-label>
                                </ion-chip>
                                <ion-card-subtitle>{{ doc?.customer }} / {{ doc?.phone_number }}</ion-card-subtitle>
                            </ion-col>
                            <ion-col class="text-right">
                                <ion-button shape="round" size="small" style="--background:#533B4D">
                                    <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
                                </ion-button>
                                <ion-button shape="round" size="small" style="--background:#7F55B1">
                                    <ion-icon slot="icon-only" :icon="personAddOutline"></ion-icon>
                                </ion-button>
                                <ion-button shape="round" size="small" style="--background:#328E6E">
                                    <ion-icon slot="icon-only" :icon="scanCircleOutline"></ion-icon>
                                </ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>

                </ion-card-content>
            </ion-card>

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
        </ion-content>
    </ion-page>


</template>
<script setup>
import { dice, searchOutline, personAddOutline, scanCircleOutline, timeOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import dayjs from 'dayjs';


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