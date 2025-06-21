<template>
    <ion-page>
        <AppBar>
            {{ t("Redeem") }}

        </AppBar>
        <ion-content class="ion-padding">
            <div class="fix-container">
<ComSearchBarcode/>
<ComRedeemCouponList />
            </div>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                footer
            </ion-toolbar>
        </ion-footer>
    </ion-page>

</template>
<script setup >
import ComSearchBarcode from "@/modules/ecoupon/RedeemList/components/ComSearchBarcode.vue"
import ComRedeemCouponList from "@/modules/ecoupon/RedeemList/components/ComRedeemCouponList.vue"
    const t = window.t;
</script>