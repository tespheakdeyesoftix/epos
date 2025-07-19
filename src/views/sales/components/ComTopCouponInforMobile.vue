<template>
 
{{ saleProducts }}
    <template v-for="(d, index) in saleProducts" :key="index">
            <ion-card class="ion-no-margin mb-2">
                 
                         
                                <ion-item>
                                    
                                    <ion-avatar>
                                        <Img v-if="d?.product_photo" :src="d?.product_photo" />
                                        <div class="avatar-placeholder" v-else>{{ getAvatarLetter(d.product_name) }}
                                        </div>
                                    </ion-avatar>
                                    <ion-label style="margin-left: 10px;">
                                        <h2 class="card-title">{{t("Coupon Code")}} - {{ d.product_code }}</h2>
                                        <div class="card-title">{{t("Coupon Name")}} - {{ d.product_name }}</div>
                                        <h2 class="card-title">{{t("Top Up Amount") }} - <com-currency :value="d.amount"/></h2>
                                        <div class="card-title">{{t("Top Up Value")}} - {{ d.total_coupon_value }}</div>
                                        <h2 class="card-title">{{t("Top Up Amount") }} - <com-currency :value="d.amount"/></h2>
                                        <div class="card-title">{{t("Top Up Value")}} - {{ d.total_coupon_value }}</div>
                                        <p class="card-subtitle" style="color: black;"><com-currency :value="d.price"/></p>
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