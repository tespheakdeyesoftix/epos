<template>
    <BaseModal :title="t('View All Coupon Codes')">
        <ion-card class="ion-no-margin">
            <ion-card-content>
                <stack row>
                  <ion-avatar>
                                <Img v-if="data.product_photo" :src="data.product_photo" />
                                <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data.product_name) }}
                                </div>
                            </ion-avatar>
                            <stack>
                                <ion-label>{{ data.product_code }} - {{ data.product_name }}</ion-label>
                                <ion-label>{{ data.quantity }} {{ data.unit }} x <ComCurrency :value="data.price"/></ion-label>
                            </stack>

                            </stack>
                            <div style="position: absolute;top:10px;right:10px">
                                <ion-text color="danger">
                                    <h1><ComCurrency :value="data.amount"/></h1>
                                </ion-text>
                            </div>
            </ion-card-content>
        </ion-card>
        <ion-text color="primary">
            <h4>{{ t("Coupon Code List") }}</h4>
        </ion-text>
        <ion-list>
            <ion-item button v-for="c in data.coupons" :key="c"  @click="closeModal(c)">
                <ion-label>{{ c.coupon }}</ion-label>
                <ion-label slot="end"><ComCurrency :value="data.price"/></ion-label>
            </ion-item>
        </ion-list>
    </BaseModal>
</template>
<script setup>
 import { modalController } from '@ionic/vue';
import { getAvatarLetter } from "@/helpers/utils"
const props = defineProps({
    data:Object
})
const t  = window.t

function closeModal(c){
    modalController.dismiss();
    app.ionRouter.navigate("/coupon-detail/" + c.coupon_code, "forward", "push");
}

</script>
