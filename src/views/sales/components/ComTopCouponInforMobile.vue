<template>
 
<!-- {{ saleProducts }} -->
    <template v-for="(d, index) in saleProducts" :key="index">
            <ion-card class="ion-no-margin ion-no-padding">
                                <ion-item lines="none">
                                    <!-- <ion-avatar>
                                        <Img v-if="d?.product_photo" :src="d?.product_photo" />
                                        <div class="avatar-placeholder" v-else>{{ getAvatarLetter(d.product_name) }}
                                        </div>
                                    </ion-avatar> -->
                                    <ion-label class="ion-no-padding ">
                                        <ion-item class="card-title">
                                            <ion-label>
                                                {{t("Coupon Code")}} 
                                            </ion-label>
                                            <ion-label slot="end">
                                                {{ d.product_code }}
                                            </ion-label>
                                        </ion-item>
                                        <ion-item class="card-title">
                                            <ion-label>
                                                {{t("Coupon Name")}}
                                            </ion-label>
                                             <ion-label slot="end">
                                                {{ d.product_name }}
                                            </ion-label>
                                        </ion-item>
                                        <ion-item class="card-title">
                                            <ion-label>
                                                {{t("Remaining Amount") }}
                                            </ion-label>
                                            <ion-label slot="end">
                                                <ComCurrency :value="d.coupons?.[0]?.balance_amount" />
                                            </ion-label>
                                        </ion-item>
                                        <ion-item class="card-title">
                                            <ion-label>
                                                {{t("Remaining Value")}} 
                                            </ion-label>
                                            <ion-label slot="end">
                                                <ComCurrency :value="d.coupons?.[0]?.balance_coupon_value" />
                                            </ion-label>
                                        </ion-item>
                                        <ion-item class="card-title">
                                            <ion-label>
                                                {{t("Top Up Amount") }}
                                            </ion-label>
                                            <ion-label slot="end">
                                                <ComCurrency :value="d.amount"/>
                                            </ion-label>
                                        </ion-item>
                                        <ion-item class="card-title">
                                            <ion-label>
                                                {{t("Top Up Value")}} 
                                            </ion-label>
                                            <ion-label slot="end">
                                                <ComCurrency :value="d.total_coupon_value"/>
                                            </ion-label>
                                        </ion-item>
                                        <ion-item class="card-title">
                                            <ion-label>
                                                {{t("Total Amount")}} 
                                            </ion-label>
                                            <ion-label slot="end">
                                                <ComCurrency :value="Math.abs((d.coupons?.[0]?.balance_coupon_value || 0) + (d.total_coupon_value || 0))" />
                                            </ion-label>
                                        </ion-item>
                                        <ion-item class="card-title">
                                            <ion-label>
                                            {{t("Total Value")}}
                                            </ion-label>
                                            <ion-label slot="end">
                                            <ComCurrency :value="Math.abs((d.coupons?.[0]?.balance_amount || 0) + (d.amount || 0))" />
                                            </ion-label>
                                        </ion-item>       
                                    </ion-label>
                                    
                                     
                                </ion-item>
                            </ion-card>                    
    </template>

</template>

<script setup>
const t = window.t;
const props = defineProps({
    saleProducts: Object
});
</script>