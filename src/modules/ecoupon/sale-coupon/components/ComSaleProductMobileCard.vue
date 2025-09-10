<template>
    <template v-if="data">
        <ion-card class="border-round-lg p-2" :color="activeIndex == index ? 'tertiary' : ''">
            <div class="card-sale-product ">
                <div>
                    <div class="flex gap-2">

                         
                        <div>
                        <ion-avatar class="border-1 avatar-container">
                            <Img v-if="data?.product_photo" :src="data?.product_photo" />
                            <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.product_name) }}
                            </div>
                        </ion-avatar>
                        </div>
                        <div>
                            <div>
                                <ion-text>
                                    <ion-label class="m-0">
                                        {{ data.product_code }} - {{ data.product_name }}
                                    </ion-label>
                                </ion-text>
                            </div> 
                            <ion-text>
                                <h6 class="m-0">
                                    {{ data.quantity }} x
                                    <ComCurrency :value="data.price" />
                                </h6>
                            </ion-text>
                            
                            <ion-label color="danger" v-if="data.total_coupon_value" style="font-size:  0.8rem;">

                                {{ t("Coupon Value") }}
                                <ComCurrency :value="data.total_coupon_value" />

                            </ion-label>
                            <br>
                            <ion-text v-if="data.discount_amount">
                                {{ t("Discount") }}:
                                <ComCurrency :value="data.discount_amount" />
                            </ion-text>
                            
                            <ion-text v-if="data.note">
                                <div>
                                    {{ data.note }}
                                </div>
                            </ion-text>

                        </div>


                    </div>
                </div>
                <div>
                    <ion-chip v-if="data.is_free == 1" color="success">{{ t("Free") }}</ion-chip>
                    
                    <ion-chip v-else color="danger" class="px-2 flex items-center" style="font-size: 15px;white-space: nowrap;">
                        <ion-label class="m-0  ">
                            <ComCurrency :value="data?.amount" />
                        </ion-label>
                    </ion-chip>
                    
                </div>
            </div>

            <div>
                <ion-chip v-for="(c, index) in displayCoupons" :key="index">{{ c }}</ion-chip>
            </div>
            <div v-if="activeIndex == index">
                <ion-chip  @click.stop="onEditSaleProductCoupon(data)" v-if="data.coupons.length > 3" color="primary" >{{
                    data.coupons.length - 3 }} {{ t("More(s)") }}</ion-chip>

                <ion-button @click.stop="onChangeSaleProductPrice(data)" class="btnSize">{{ t("Price") }}</ion-button>
                <!-- <ion-button class="btnSize" :disabled="data.name || data.append_quantity == 0"
                    @click.stop="onChangeSaleProductQuantity(data)">{{ t("QTY") }}</ion-button> -->
                <ion-button class="btnSize" @click.stop="onEditSaleProductCoupon(data)">{{ t("Edit") }}</ion-button>
                <ion-button class="btnSize" color="danger" @click.stop="onDeleteSaleProduct(index)">{{ t("Delete") }}</ion-button>


                <ion-button :id="popOverID" @click="handleButtonClick">{{ t("More") }}</ion-button>

                <ion-popover :trigger="popOverID" trigger-action="click" :dismiss-on-select="true">
                    <ion-content>
                        <ion-list>
                            <!-- Free -->
                            <ion-item v-if="data.allow_free == 1 && (data.is_free || 0) == 0"
                                @click="onFreeProduct(data)" button>
                                <ion-label> {{ t("Free") }}</ion-label>
                            </ion-item>

                            <!--Remove Free -->
                            <ion-item v-if="data.allow_free == 1 && (data.is_free || 0) == 1"
                                @click="onRemoveFreeProduct(data)" button>
                                <ion-label> {{ t("Remove Free") }}</ion-label>
                            </ion-item>

                            <!-- discount percent -->
                            <ion-item v-if="(data.discount_amount ?? 0) == 0" @click="onProductDiscountPercent(data)"
                                button>
                                <ion-label> {{ t("Discount Percent") }}</ion-label>
                            </ion-item>


                            <!-- discolunt amount -->
                            <ion-item v-if="(data.discount_amount ?? 0) == 0" @click="onProductDiscountAmount(data)"
                                button>
                                <ion-label> {{ t("Discount Amount") }}</ion-label>
                            </ion-item>
                            <!-- remove discount -->
                            <ion-item v-if="(data.discount_amount ?? 0) > 0" @click="onRemoveProductDiscount(data)"
                                button>

                                <ion-label color="danger"> {{ t("Remove Discount") }}</ion-label>
                            </ion-item>

                            <!-- addnote -->
                            <ion-item v-if="!data.note" @click="onAddNote" button>
                                <ion-icon :icon="documentOutline" />
                                <ion-label> {{ t("Note") }}</ion-label>
                            </ion-item>
                            <!-- remove note -->
                            <ion-item v-if="data.note" @click="onDeleteNote" button>
                                <ion-label color="danger"> {{ t("Delete Note") }}</ion-label>
                            </ion-item>
                        </ion-list>
                    </ion-content>
                </ion-popover>
            </div>

        </ion-card>

    </template>

</template>
<script setup>
import { computed } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { documentOutline } from 'ionicons/icons';
function handleButtonClick(e) {
    e.stopPropagation()
}
const {
    saleDoc,
    onEditSaleProductCoupon,
    onDeleteSaleProduct,
    onProductDiscountPercent,
    onProductDiscountAmount,
    onRemoveProductDiscount,
    onChangeSaleProductPrice,
    onChangeSaleProductQuantity,
    onFreeProduct,
    onRemoveFreeProduct
} = useSaleCoupon()
const popOverID = app.utils.generateRandomString();
const props = defineProps({
    data: Object,
    index: Number,
    activeIndex: Number,
})
const t = window.t;



const displayCoupons = computed(() => {
    const allCoupuns = (props.data.coupons || []).map(x => x.coupon);
    if (allCoupuns.length > 3) {
        return allCoupuns.slice(0, 3);
    }
    return allCoupuns
})

async function onAddNote() {
    if (saleDoc.value.sale_status == "Bill Requested") {
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    const result = await app.utils.onOpenKeyboard({
        title: t("Note on Product"),
        defaultValue: props.data.nte,
        storageKey: "sale_product_note"
    })
    if (result) {
        props.data.note = result;
    }
}

function onDeleteNote() {
    props.data.note = "";
}

</script>
<style scoped>
.card-sale-product {
    display: flex;
    justify-content: space-between;
}

.note-box {
    background-color: var(--ion-color-light-shade);
    ;
}
.avatar-container {
    width: 50px;
    height: 50px;
}
.btnSize{
    font-size: 12px;
    padding: 0;
}

</style>