<template>
    <BaseModal :title="t('Order Detail')">
        <div class="fix-container">
            <ion-card>
                <ion-card-content>

                    <stack row equal>
                        <stack row>
                            <ion-avatar>
                                <Img v-if="customer.photo" :src="customer.photo" />
                                <div class="avatar-placeholder" v-else>{{ getAvatarLetter(customer.customer_name_en) }}
                                </div>
                            </ion-avatar>
                            <stack>
                                <ion-text>
                                    {{ customer.name  }} - {{ customer.customer_name_en }}
                                </ion-text>
                                
                                <ion-text>
                                    <ion-icon :icon="phonePortraitOutline" />
                                    {{ customer.phone_number}}
                                </ion-text>
                                
                            </stack>
                        </stack>

                        <div>
                            
                            <stack row equal>
                                <ion-text>{{ t("Bill #") }}</ion-text>
                                <ion-text color="danger"><strong>{{ saleDoc.name || "New" }}</strong></ion-text>
                            </stack>
                            
                            <stack row equal v-if="saleDoc.table_no">
                                <ion-text>{{ t("Table #") }}</ion-text>
                                <ion-text ><strong>{{ saleDoc.table_no }}</strong></ion-text>
                            </stack>
                            
                            <stack row equal>
                                <ion-text>{{ t("Posting Date") }}</ion-text>
                                <ion-text ><strong>{{ dayjs(saleDoc.posting_date).format("DD/MM/YYYY")}}</strong></ion-text>
                            </stack>


                        </div>
                    </stack>
                    {{ saleProducts }}
                </ion-card-content>
            </ion-card>
        </div>
    </BaseModal>
</template>
<script setup>
import { useSaleCoupon } from '@/hooks/useSaleCoupon';
import { computed } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import { phonePortraitOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
const { saleDoc, customer } = useSaleCoupon();
const t = window.t;
const saleProducts = computed(() => {
    const products = saleDoc.value.sale_products;

    const grouped = {};

    for (const p of products) {
        const key = [
            p.product_code,
            p.unit,
            p.is_free,
            p.portion,
            JSON.stringify(p.modifiers),
            p.discount,
            p.discount_type,
            p.price,
            p.modifiers_price
        ].join(',');

        if (!grouped[key]) {
            grouped[key] = {
                product_code: p.product_code,
                product_name: p.product_name,
                product_name_kh: p.product_name_kh,
                modifiers_price: p.modifiers_price,
                portion: p.portion,
                modifiers: p.modifiers,
                unit: p.unit,
                discount: p.discount,
                discount_type: p.discount_type,
                product_photo: p.product_photo,
                price: p.price,
                is_free: p.is_free,
                quantity: 0,
                total_amount: 0
            };
        }

        grouped[key].quantity += p.quantity;
        grouped[key].total_amount += p.total_amount;
    }

    const result = Object.values(grouped);
    return result

})
</script>