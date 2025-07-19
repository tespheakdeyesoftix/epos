 
<template>
 
            <ion-card>
                <ion-card-content>
                    <stack row equal>
                        <stack row>
                            <ion-avatar>
                                <Img v-if="doc?.customer_photo" :src="doc?.customer_photo" />
                                <div class="avatar-placeholder" v-else>{{ getAvatarLetter(doc?.customer_name) }}
                                </div>
                            </ion-avatar>
                            <stack>
                                <ion-text >
                                    <RouterLink :to="'/customer-detail/' + doc?.customer"> {{ doc?.customer  }} - {{ doc?.customer_name }}</RouterLink>
                                    
                                </ion-text>
                                <ion-text>
                                    <ion-icon :icon="phonePortraitOutline" />
                                    {{ doc?.phone_number}}
                                </ion-text>
                                <ComStatus :status="doc?.sale_type" />
                            </stack>
                            
                        </stack>

                        <div>
                            
                            <stack row equal>
                                <ion-text>{{ t("Bill #") }}</ion-text>
                                <ion-text color="danger"><strong>{{ doc?.custom_bill_number || doc?.name || "New" }}</strong></ion-text>
                            </stack>
                            <stack row equal v-if="doc?.table_no">
                                <ion-text>{{ t("Table #") }}</ion-text>
                                <ion-text ><strong>{{ doc?.table_no }}</strong></ion-text>
                            </stack>
                            
                            <stack row equal>
                                <ion-text>{{ t("Posting Date") }}</ion-text>
                                <ion-text ><strong>{{ dayjs(doc?.posting_date).format("DD/MM/YYYY")}}</strong></ion-text>
                            </stack>
                            <stack row equal>
                                <ion-text>{{ t("Business Branch") }}</ion-text>
                                <ion-text ><strong>{{ doc?.business_branch }}</strong></ion-text>
                            </stack>
                            <stack row equal>
                                <ion-text>{{ t("Working Day/Cashier Shift") }}</ion-text>
                                <ion-text ><strong>{{ doc?.working_day }} / {{ doc?.cashier_shift }}</strong></ion-text>
                            </stack>
                            <stack row equal>
                                <ion-text>{{ t("Outlet") }}</ion-text>
                                <ion-text ><strong>{{ doc?.outlet }}</strong></ion-text>
                            </stack>
                            <stack row equal>
                                <ion-text>{{ t("POS Profile") }}</ion-text>
                                <ion-text ><strong>{{ doc?.pos_profile }}</strong></ion-text>
                            </stack>
                           

                        </div>
                    </stack>

                <ion-text color="primary">
                    <h3>{{ t("Sale Product List") }}</h3>
                </ion-text>

                <template v-if="doc?.sale_type=='Top Up'">
                    <ComTopCouponInforDesktop :saleProducts="saleProducts"/>
                </template>
                <template v-else>
          <DataTable stripedRows  :value="saleProducts" tableStyle="min-width: 50rem">
  <!-- Index Column -->
  <Column header="#" headerStyle="width:3rem" headerClass="text-center" bodyClass="text-center">
        <template #body="slotProps">
            {{ slotProps.index + 1 }}
        </template>
    </Column>
  <!-- Your Data Columns -->
  <Column field="product_code" :header="t('Description')">
    {{   }}
      <template #body="slotProps">
        <stack row>
           
                 <ion-avatar>
                                <Img v-if="slotProps.data.product_photo" :src="slotProps.data.product_photo" />
                                <div class="avatar-placeholder" v-else>{{ getAvatarLetter(slotProps.data.product_name) }}
                                </div>
                            </ion-avatar>
            
            <div>
   <ion-text>{{slotProps.data.product_code}} - 
           {{slotProps.data.product_name}}</ion-text>
           <br/>
         

           <ion-chip color="medium" v-for="c in getDisplayCoupon(slotProps.data.coupons)" :routerLink="'/coupon-detail/' + c.coupon_code">{{ c.coupon }}</ion-chip>
           <ion-chip @click="onViewAllCouponCodes(slotProps.data)" color="primary" v-if="slotProps.data.coupons.length - 3>0">{{ slotProps.data.coupons.length - 3 }} {{t("Mores")}}</ion-chip>

            </div>
        </stack>
                 </template>
</Column>
        <Column
  field="quantity"
  headerClass="text-center"
  bodyClass="text-center"
  :header="t('Quantity')"
>
  <template #body="slotProps">
    {{ Math.abs(slotProps.data.quantity) }}
  </template>
</Column>

  <Column field="unit" headerClass="text-center" bodyClass="text-center" :header="t('Unit')"></Column>
  <Column field="price" headerClass="text-right" bodyClass="text-right" :header="t('Price')">
      <template #body="slotProps">
        
        <ComCurrency :value="slotProps.data.price"/>
      </template>
</Column>
  <Column field="discount" headerClass="text-center" bodyClass="text-center" :header="t('Discount')">
      <template #body="slotProps">
    
        <ion-chip v-if="slotProps.data.discount_type == 'Percent' && slotProps.data.discount>0">
            {{ slotProps.data.discount }}%
        </ion-chip>
     
    
       <ComCurrency :value="slotProps.data.discount_amount || 0"/>
</template>

    </Column>
   <Column field="total_amount" headerClass="text-right" bodyClass="text-right" :header="t('Total Amount')">
      <template #body="slotProps">
        <ComCurrency :value="Math.abs(slotProps.data.amount)" />
      </template>
</Column>
</DataTable>
</template>
<div style="float: left;margin-top:10px">
     {{ doc?.note || t("No sale note") }}
</div>

<div style="width: 300px;float: right;">
     <ion-list>
    <ion-item v-if="doc?.total_quantity>0 && doc?.sale_type != 'Top Up'">
        <ion-label >{{ t("Total Coupon") }}</ion-label>
        <ion-label slot="end"><strong>{{ doc?.total_quantity }}</strong></ion-label>
    </ion-item>
    <ion-item v-if="doc?.sub_total>0 && doc?.sale_type != 'Top Up'">
        <ion-label>{{ t("Sub Total") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="doc?.sub_total"/> </ion-label>
    </ion-item>

    <ion-item v-if="doc?.product_discount>0">
        <ion-label>{{ t("Sale Product Dis.") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="doc?.product_discount"/></ion-label>
    </ion-item>
    
    <ion-item v-if="(doc?.sale_discountable_amount || 0)>0 && (doc?.discount>0 || (doc?.sale_discount ||0) >0)">
        <ion-label>{{ t("Sale Discountable Amount") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="doc?.sale_discountable_amount"/></ion-label>
    </ion-item>
   
    <ion-item v-if="doc?.discount>0 || (doc?.sale_discount ||0) >0">
        <ion-label >
            {{ t("Sale Discount") }}
            <ion-text color="danger" v-if="doc?.discount_type=='Percent'">({{ doc?.discount }}% )</ion-text>     
           
        </ion-label>
         <ion-icon :icon="alertCircleOutline"  v-tooltip.top="doc?.discount_note"></ion-icon>
        <ion-label slot="end"><ComCurrency :value="doc?.sale_discount"/></ion-label>
    </ion-item>
    <ion-item v-if="(doc?.sale_discount || 0)> 0 && (doc.product_discount ||0) > 0">
        <ion-label>{{ t("Total Discount") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="doc?.total_discount || 0"/></ion-label>
    </ion-item>
    
    <ion-item v-if="doc?.grand_total>0">
        <ion-label><strong>{{ t("Grand Total") }} ({{ currency }})</strong></ion-label>
        <ion-label slot="end"><strong>
            <ComCurrency :value="doc?.grand_total || 0"/>
        </strong>
        </ion-label>
    </ion-item>
    <ion-item v-if="doc?.grand_total>0">
        <ion-label><strong>{{ t("Grand Total") }} ({{ secondCurrency }})</strong></ion-label>
        <ion-label slot="end"><strong>
            <ComCurrency :value="(doc?.grand_total || 0) * (doc?.exchange_rate ||0)" :currency="secondCurrency"/> 
        </strong>
        </ion-label>
    </ion-item>
    
    <ion-item  v-for="p in doc?.payment">
        <ion-label>{{ p.payment_type }}</ion-label>
        <ion-label slot="end"><strong>
             <ComCurrency :value="Math.abs(p.input_amount)" :currency="p.currency" />
        </strong>
        </ion-label>
    </ion-item>
    <ion-item v-if="doc?.balance>0">
        <ion-label><strong>{{ t("Balance") }} ({{ currency }})</strong></ion-label>
        <ion-label slot="end"><strong>
            <ComCurrency :value="doc?.balance || 0"/>
        </strong>
        </ion-label>
    </ion-item>
</ion-list>
</div>
<div style="clear: both;"></div>
 <div>
<ion-note>
    {{ t("Created by") }}: {{ doc?.created_by || doc?.owner.split("@")[0] }} {{ t("on_date_time") }} {{ dayjs(doc?.creation).fromNow() }}
</ion-note>

</div>
<div>
<ion-note>
    {{ t("POS Station Name") }}: {{ doc?.pos_station_name }}
</ion-note>
</div> 
</ion-card-content>
</ion-card>
 
</template>
<script setup>

import { computed } from 'vue';
import { getAvatarLetter } from "@/helpers/utils"
import { phonePortraitOutline } from 'ionicons/icons';
import ComViewAllCouponCodeModal from '@/views/sales/components/ComViewAllCouponCodeModal.vue';
import ComTopCouponInforDesktop from '@/views/sales/components/ComTopCouponInforDesktop.vue';
import dayjs from 'dayjs';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const props = defineProps({
    doc:Object
})

const currency = app.setting.currency;
const secondCurrency = app.setting.second_currency;
 
const t = window.t;
const saleProducts = computed(() => {
    const products = props.doc?.sale_products || [];

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
                amount: 0,
                total_coupon_value: 0
            };
        }

        grouped[key].quantity += p.quantity;
        grouped[key].amount += p.amount;
        grouped[key].total_coupon_value += p.total_coupon_value;
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

function getDisplayCoupon(coupons){ 
    
    if (coupons.length > 3) {
        return coupons.slice(0, 3);
    }
    return coupons
}

function onViewAllCouponCodes(data){
    app.openModal({
        component:ComViewAllCouponCodeModal,
        componentProps:{
            data:data
        }
    })
}

</script>
<style scoped>
ion-item{
  --padding-top: 0px;
  --padding-bottom: 0px;
  
}
 
</style>