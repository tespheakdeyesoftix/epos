<template>
    <ion-page>
        <ToolBar>{{ t("Sale Detail") }}</ToolBar>
        <ion-content class="ion-padding">
            <ion-card button="true">
                <ion-card-content>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-chip class="m-0">
                                    <ion-avatar>
                                        <img :alt="doc?.customer_name"
                                            src="/assets/avatar.svg" />
                                    </ion-avatar>
                                    <ion-label>{{ doc?.customer_name}}</ion-label>
                                </ion-chip>
                                <ion-card-subtitle>{{ doc?.customer }} / {{ doc?.phone_number }}</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-button shape="round" size="small">
                                    <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
                                </ion-button>
                                <ion-button shape="round" size="small">
                                    <ion-icon slot="icon-only" :icon="personAddOutline"></ion-icon>
                                </ion-button>
                                <ion-button shape="round" size="small">
                                    <ion-icon slot="icon-only" :icon="scanCircleOutline"></ion-icon>
                                </ion-button>
                            </ion-col>
                        </ion-row> 
                    </ion-grid>
                    
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>


</template>
<script setup>
import { dice, searchOutline, personAddOutline, scanCircleOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';


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