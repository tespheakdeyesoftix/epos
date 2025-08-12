<template>
 

            <!-- Bill info -->
          
            <ion-list>
                <ion-item >
                    <ion-label>{{ t("Branch") }}</ion-label>
                    <ion-label slot="end">
                       {{ doc?.business_branch }}
                    </ion-label>
                </ion-item>
                <ion-item v-if="doc?.custom_bill_number">
                    <ion-label>{{ t("Bill Number") }}</ion-label>
                    <ion-label slot="end">{{ doc?.custom_bill_number }}</ion-label>
                </ion-item>
                <ion-item v-if="doc?.reference_number">
                    <ion-label>{{ t("Ref. Number") }}</ion-label>
                    <ion-label slot="end">{{doc?.reference_number}}</ion-label>
                </ion-item>
                
                <ion-item>
                    <ion-label>{{ t("Posting Date") }}</ion-label>
                    <ion-label slot="end">{{dayjs(doc?.posting_date).format("DD/MM/YYYY")}} {{dayjs(doc?.creation).format("hh:mm A")}}</ion-label>
                </ion-item>
                <ion-item v-if="doc?.tbl_number">
                    <ion-label>{{ t("Table #") }}</ion-label>
                    <ion-label slot="end">{{ doc?.tbl_number }}</ion-label>
                </ion-item>
               
                <template v-if="showMoreInfo"> 
                <ion-item>
                    <ion-label>{{ t("Outlet") }}</ion-label>
                    <ion-label slot="end">{{ doc?.outlet }}</ion-label>
                </ion-item>
                
                <ion-item>
                    <ion-label>{{ t("Stock Location") }}</ion-label>
                    <ion-label slot="end">{{ doc?.stock_location }}</ion-label>
                </ion-item>
                
                <ion-item>
                    <ion-label>{{ t("POS Profile") }}</ion-label>
                    <ion-label slot="end">{{ doc?.pos_profile }}</ion-label>
                </ion-item>
                <ion-item v-if="doc?.working_day">
                    <ion-label>{{ t("Working Day") }}</ion-label>
                    <ion-label slot="end">{{ doc?.working_day }}</ion-label>
                </ion-item>
                
                <ion-item v-if="doc?.cashier_shift">
                    <ion-label>{{ t("Cashier Shift") }}</ion-label>
                    <ion-label slot="end">{{ doc?.cashier_shift }}</ion-label>
                </ion-item>
                <ion-item v-if="doc?.shift_name">
                    <ion-label>{{ t("Shift") }}</ion-label>
                    <ion-label slot="end">{{ doc?.shift_name }}</ion-label>
                </ion-item>
                <ion-item >
                    <ion-label>{{ t("Cashier") }}</ion-label>
                    <ion-label slot="end">{{ doc?.closed_by }}</ion-label>
                </ion-item>
                 <ion-item >
                    <ion-label>{{ t("Customer") }}</ion-label>
                    <ion-label slot="end">{{ doc?.customer_name }}</ion-label>
                </ion-item>
</template>
 

            </ion-list>
            <ion-button fill="clear" expand="full"  @click="onShowMoreInfo">
                        {{ t((showMoreInfo?"Hide Info":"Show More")) }}
                    </ion-button>

 <template v-if="doc?.sale_type == 'Top Up'">
  <ComTopCouponInforMobile :saleProducts="saleProducts" />
</template>
              <template v-else>   
            <template v-if="doc?.sale_products.length > 0">
       
                        
                        <template v-for="(d, index) in saleProducts" :key="index">
                            <ion-card class="ion-no-margin mb-2">
                                <ion-item lines="none">
                                    <ion-avatar>
                                        <Img v-if="d?.product_photo" :src="d?.product_photo" />
                                        <div class="avatar-placeholder" v-else>{{ getAvatarLetter(d.product_name) }}
                                        </div>
                                    </ion-avatar>
                                    <ion-label>
                                        <h2 class="card-title">{{ d.product_code }}</h2>
                                        <div class="card-title">{{ d.product_name }}</div>
                                        <p class="card-subtitle" style="color: black;">{{d.quantity}} x <com-currency :value="d.price"/></p>
                                        <div>
                                            <ion-chip v-for="(c,index) in (d.coupons || [])" :key="index">
                                                {{ c.coupon }}
                                            </ion-chip>
                                        </div>
                                        <p v-if="d.modifiers && !d.is_timer_product" class="card-subtitle">{{d.modifiers}} (<com-currency :value="d.modifiers_price * d.quantity"/>)</p>
                                        
                                        <p class="card-subtitle flex align-items-center gap-1" v-if="d.time_in || d.time_out">
                                            <ion-icon size="small" :icon="timeOutline"></ion-icon> {{ dayjs(d.time_in).format('hh:mm A') }} {{d?.time_out?'-':''}} {{ dayjs(d.time_out).format('hh:mm A') }}
                                        </p> 
                                    </ion-label>
                                    <ion-label slot="end" class="amount-container flex flex-column align-items-center">
                                        <ion-label color="primary"><div style="font-size: 20px;color: black;"><com-currency :value="d?.price" /></div></ion-label>
                                    </ion-label>
                                </ion-item>
                            </ion-card>
                        </template>
                  

                
            </template>
            </template>


            <!-- summary -->
            <ion-list>
                <ion-item>
                    <ion-label>{{ t("Total Quantity") }}</ion-label>
                    <ion-label slot="end">
                        <ComNumber :value="doc?.total_quantity" />
                    </ion-label>
                </ion-item>
                <ion-item v-if="doc?.sale_discount > 0 && doc?.product_discount > 0">
                    <ion-label>{{ t("Sub Total") }}</ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.sub_total" />
                    </ion-label>
                </ion-item>
                <ion-item v-if="doc?.sale_discount > 0">
                    <ion-label>{{ t("Discountable Amount") }}</ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.sale_discountable_amount" />
                    </ion-label>
                </ion-item>

                <ion-item v-if="doc?.product_discount > 0">
                    <ion-label>{{ t("Items Discount") }}</ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.product_discount" />
                    </ion-label>
                </ion-item>
                <ion-item v-if="doc?.sale_discount > 0">
                    <ion-label>{{ t("Sale Discount") }}

                        <span v-if="doc?.discount && doc?.discount_type == 'Percent'"> - {{ doc?.discount }}%</span>

                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.sale_discount" />
                    </ion-label>
                </ion-item>
                <ion-item v-if="doc?.sale_discount > 0 && doc?.product_discount > 0">
                    <ion-label>{{ t("Total Discount") }}

                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.total_discount" />
                    </ion-label>
                </ion-item>
                <!--tax  -->
                <ion-item v-if="doc?.tax_1_amount > 0">
                    <ion-label>{{ taxRule?.tax_1_name }} - {{ doc.tax_1_rate }} %
                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.tax_1_amount" />
                    </ion-label>
                </ion-item>

                <ion-item v-if="doc?.tax_2_amount > 0">
                    <ion-label>{{ taxRule?.tax_2_name }} - {{ doc.tax_2_rate }} %
                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.tax_2_amount" />
                    </ion-label>
                </ion-item>

                <ion-item v-if="doc?.tax_3_amount > 0">
                    <ion-label>{{ taxRule?.tax_3_name }} - {{ doc.tax_3_rate }} %
                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="doc?.tax_3_amount" />
                    </ion-label>
                </ion-item>

                <ion-item v-if="[doc?.tax_1_amount, doc?.tax_2_amount, doc?.tax_3_amount].filter(x => x > 0).length > 1">
                    <ion-label><strong>{{ t("Total Tax") }}</strong></ion-label>
                    <ion-label slot="end"><strong>
                            <ComCurrency :value="doc?.tax_1_amount + doc?.tax_2_amount + doc?.tax_3_amount" />
                        </strong></ion-label>
                </ion-item>

                <!-- end total tax -->



                <!-- grand total -->
                <ion-item>
                    <ion-label><strong>{{ t("Grand Total") }} </strong>
                    </ion-label>
                    <ion-text slot="end">
                         <div class="amount">
                            <ComCurrency :value="doc?.grand_total" />
                       </div>
                    </ion-text>
                </ion-item>

                <!-- paymen t -->
                <template v-if="doc?.payment">
                    <ion-item v-for="(p, index) in doc?.payment" :key="index">
                        <ion-label><strong>{{ p.payment_type }}</strong></ion-label>
                        <ion-text slot="end">
                            <div class="amount">
                                <ComCurrency :value="p.input_amount" :format="p.currency" />
                                <!-- <ComCurrency :value="p.input_amount" :format="p.currency_format" /> -->
                            </div>
                        </ion-text>
                    </ion-item>

                </template>
                <ion-item v-else>
                    <ion-label><strong>{{ t("Payment Amount") }} </strong>
                    </ion-label>
                    <ion-text slot="end">
                         <div class="amount">
                            <ComCurrency :value="doc?.total_paid" />
                        </div>
                    </ion-text>
                </ion-item>

                <ion-item v-if="doc?.balance > 0">
                    <ion-label><strong>{{ t("Balance") }} </strong>
                    </ion-label>
                    <ion-text slot="end">
                        <div class="amount">
                            <ComCurrency :value="doc?.balance" />
                        </div>
                    </ion-text>
                </ion-item>
                <ion-item v-if="doc?.changed_amount > 0">
                    <ion-label><strong>{{ t("Change Amount") }} </strong>
                    </ion-label>
                    <ion-text slot="end">
                        <div class="amount">
                            <ComCurrency :value="doc?.changed_amount" />
                        </div>
                    </ion-text>
                </ion-item>
                <ion-item v-if="doc?.note">
                    <ion-note>{{ doc?.note }}</ion-note>
                </ion-item>
            </ion-list>
  
</template>
<script setup>

import { timeOutline, personOutline} from 'ionicons/icons';
import { onMounted, ref, computed } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import ComTopCouponInforMobile from "@/views/sales/components/ComTopCouponInforMobile.vue"
import dayjs from 'dayjs';
import Enumerable from 'linq';
const props = defineProps({
    doc:Object
})
const showMoreInfo = ref(false)
const t = window.t;
 
const taxRule = ref()
 
const saleProducts = computed(() => {
    const products = props.doc?.sale_products;

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
                total_amount: 0,
                 amount: 0,
                total_coupon_value: 0
            };
        }

        grouped[key].quantity += p.quantity;
        grouped[key].total_amount += p.total_amount;
        grouped[key].amount += p.amount;
        grouped[key].total_coupon_value += p.total_coupon_value;
        // grouped[key].coupons = [...(grouped[key].coupons || []),JSON.parse(p.coupons || "[]").map(r=>r.coupon)].flat()
        grouped[key].coupons = [...(grouped[key].coupons || []),JSON.parse(p.coupons || "[]").map(r=>{
            return {  
                coupon:r.coupon,
                coupon_code:r.name,           
                balance_amount:r.balance_amount,
                balance_coupon_value:r.balance_coupon_value
            } 
        })].flat()
        
        
    }

    const result = Object.values(grouped);
    return result

})


function onShowMoreInfo(){
    showMoreInfo.value = !showMoreInfo.value;
}

 
onMounted(async ()=>{
     if (props.doc?.tax_rule) {
        res = await app.getDoc("Tax Rule", props.doc.tax_rule)
        if (res.data) {
            taxRule.value = res.data
        }
    }
})

</script>
<style scoped>
.card-title {
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
    font-size: 20px;
    text-align: right;
}
</style>