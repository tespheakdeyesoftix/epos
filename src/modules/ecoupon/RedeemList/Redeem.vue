<template>
    <ion-page>
        <AppBar>
            {{ t("Redeem") }}

        </AppBar>
        <ion-content class="ion-padding">
            <div class="fix-container">
                <h1>Hello World</h1>
<ComSearchBarcode/>
<ComRedeemCouponList />

{{ t("Total Redeem Amount") }} : <ComCurrency :value="grandTotal" />
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
import { useSaleCoupon } from "@/hooks/useSaleCoupon";
    const t = window.t;
    const {saleDoc,grandTotal} = useSaleCoupon()
</script>