<template>
    <BaseModal :title="t('Order Detail')" >
      
        <div class="fix-container" v-if="plateform != 'mobile'">
            <ion-card >
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
                                <ComStatus :status="saleDoc.sale_type" />
                                
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
                            <stack row equal>
                                <ion-text>{{ t("Business Branch") }}</ion-text>
                                <ion-text ><strong>{{ saleDoc.business_branch }}</strong></ion-text>
                            </stack>
                            <stack row equal>
                                <ion-text>{{ t("Working Day/Cashier Shift") }}</ion-text>
                                 <ion-text ><strong>{{ saleDoc.working_day }} / {{ saleDoc.cashier_shift }}</strong></ion-text>
                            </stack>
                            <stack row equal>
                                <ion-text>{{ t("Outlet") }}</ion-text>
                                 <ion-text ><strong>{{ saleDoc.outlet }}</strong></ion-text>
                            </stack>
                            <stack row equal>
                                <ion-text>{{ t("Pos Profile") }}</ion-text>
                                 <ion-text ><strong>{{ saleDoc.pos_profile }}</strong></ion-text>
                            </stack>
                        </div>
                    </stack>
                    <div>
                        <ion-text>
                            {{ t("Sale Product List") }}
                        </ion-text>
                    </div>


                  <DataTable stripedRows :value="saleProducts" tableStyle="min-width: 50rem">
  <!-- Index Column -->
  <Column header="#" headerStyle="width:3rem" headerClass="text-center" bodyClass="text-center">
    <template #body="slotProps">
      {{ slotProps.index + 1 }}
    </template>
  </Column>

  <!-- Description Column -->
  <Column field="product_code" :header="t('Description')">
    <template #body="slotProps">
      <stack row>
        <ion-avatar>
          <Img v-if="slotProps.data.product_photo" :src="slotProps.data.product_photo" />
          <div class="avatar-placeholder" v-else>
            {{ getAvatarLetter(slotProps.data.product_name) }}
          </div>
        </ion-avatar>

        <div>
          <ion-text>
            {{ slotProps.data.product_code }} - {{ slotProps.data.product_name }}
          </ion-text>
          <br />

          <ion-chip
            color="medium"
            v-for="c in getDisplayCoupon(slotProps.data.coupons || [])"
            :key="c.coupon_code"
            :routerLink="'/coupon-detail/' + c.coupon_code"
          >
            {{ c.coupon }}
          </ion-chip>

          <ion-chip
            v-if="(slotProps.data.coupons?.length || 0) - 3 > 0"
            @click="onViewAllCouponCodes(slotProps.data)"
            color="primary"
          >
            {{ (slotProps.data.coupons.length - 3) }} {{ t('Mores') }}
          </ion-chip>
        </div>
      </stack>
    </template>
  </Column>

  <!-- Quantity -->
  <Column field="quantity" headerClass="text-center" bodyClass="text-center" :header="t('Quantity')">
    <template #body="slotProps">
      {{ Math.abs(slotProps.data.quantity) }}
    </template>
  </Column>

  <!-- Unit -->
  <Column field="unit" headerClass="text-center" bodyClass="text-center" :header="t('Unit')"></Column>

  <!-- Price -->
  <Column field="price" headerClass="text-right" bodyClass="text-right" :header="t('Price')">
    <template #body="slotProps">
      <ComCurrency :value="slotProps.data.price" />
    </template>
  </Column>

  <!-- Discount -->
  <Column field="discount" headerClass="text-center" bodyClass="text-center" :header="t('Discount')">
    <template #body="slotProps">
      <ion-chip
        v-if="slotProps.data.discount_type === 'Percent' && slotProps.data.discount > 0"
      >
        {{ slotProps.data.discount }}%
      </ion-chip>
      <ComCurrency :value="slotProps.data.discount_amount || 0" />
    </template>
  </Column>

  <!-- Total Amount -->
  <Column field="amount" headerClass="text-right" bodyClass="text-right" :header="t('Total Amount')">
    <template #body="slotProps">
      <ComCurrency :value="Math.abs(slotProps.data.amount)" />
    </template>
  </Column>
</DataTable>
<div style="float: left;margin-top:10px">
     {{ saleDoc.note || t("No sale note") }}
</div>

<!--  -->

<div style="width: 300px;float: right;">
     <ion-list>
    <ion-item v-if="totalQuantity>0">
        <ion-label >{{ t("Total Coupon") }}</ion-label>
        <ion-label slot="end">{{ totalQuantity }}</ion-label>
    </ion-item>
    <ion-item v-if="subTotal>0  ">
        <ion-label>{{ t("Sub Total") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="subTotal"/> </ion-label>
    </ion-item>

    <ion-item v-if="saleDoc.product_discount>0">
        <ion-label>{{ t("Sale Product Dis.") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="saleDoc.product_discount"/></ion-label>
    </ion-item>
    
    <ion-item v-if="(saleDiscoutableAmount || 0)>0 && (saleDoc.discount>0 || (saleDoc.sale_discount ||0) >0)">
        <ion-label>{{ t("Sale Discountable Amount") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="saleDiscoutableAmount"/></ion-label>
    </ion-item>
   
    <ion-item v-if="saleDoc.discount>0 || (saleDoc.sale_discount ||0) >0">
        <ion-label >
            {{ t("Sale Discount") }}
            <ion-text color="danger" v-if="saleDoc.discount_type=='Percent'">({{ saleDoc.discount }}% )</ion-text>     
           
        </ion-label>
         <ion-icon :icon="alertCircleOutline"  v-tooltip.top="saleDoc.discount_note"></ion-icon>
        <ion-label slot="end"><ComCurrency :value="saleDoc.sale_discount"/></ion-label>
    </ion-item>

    <ion-item v-if="(saleDoc.sale_discount || 0)> 0 && (saleDoc.product_discount ||0) > 0">
        <ion-label>{{ t("Total Discount") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="saleDoc.total_discount || 0"/></ion-label>
    </ion-item>
    
    <ion-item v-if="grandTotal>0">
        <ion-label><strong>{{ t("Grand Total") }} ({{ currency }})</strong></ion-label>
        <ion-label slot="end"><strong>
            <ComCurrency :value="grandTotal || 0"/>
        </strong>
        </ion-label>
    </ion-item>
    <ion-item v-if="grandTotal>0">
        <ion-label><strong>{{ t("Grand Total") }} ({{ secondCurrency }})</strong></ion-label>
        <ion-label slot="end"><strong>
            <ComCurrency :value="(grandTotal || 0) * (saleDoc.exchange_rate ||0)" :currency="secondCurrency"/> 
        </strong>
        </ion-label>
    </ion-item>
    
    <ion-item  v-for="p in saleDoc.payment">
        <ion-label>{{ p.payment_type }}</ion-label>
        <ion-label slot="end"><strong>
             <ComCurrency :value="Math.abs(p.input_amount)" :currency="p.currency" />
        </strong>
        </ion-label>
    </ion-item>
    <ion-item v-if="saleDoc.balance>0">
        <ion-label><strong>{{ t("Balance") }} ({{ currency }})</strong></ion-label>
        <ion-label slot="end"><strong>
            <ComCurrency :value="saleDoc.balance || 0"/>
        </strong>
        </ion-label>
    </ion-item>
</ion-list>
</div>
<div style="clear: both;"></div>
 <div>
<ion-note>
    {{ t("Created by") }}: {{ saleDoc?.created_by || saleDoc?.owner?.split("@")[0] }} {{ t("on_date_time") }} {{ dayjs(saleDoc?.creation).fromNow() }}
</ion-note>

</div>
<div>
<ion-note>
    {{ t("POS Station Name") }}: {{ saleDoc?.pos_station_name }}
</ion-note>
</div>               
                </ion-card-content>
            </ion-card>
             
               <!-- {{ saleDoc }} -->
               <!-- {{ saleProducts }} -->
        </div>
<!-- mobile  -->

<div v-else>

<ion-list>
                <ion-item >
                    <ion-label>{{ t("Branch") }}</ion-label>
                    <ion-label slot="end">
                       {{ saleDoc?.business_branch }}
                    </ion-label>
                </ion-item>
                <ion-item v-if="saleDoc?.sale_status">
                    <ion-label>{{ t("Bill Number") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.sale_status }}</ion-label>
                </ion-item>
                <ion-item v-if="saleDoc?.reference_number">
                    <ion-label>{{ t("Ref. Number") }}</ion-label>
                    <ion-label slot="end">{{saleDoc?.reference_number}}</ion-label>
                </ion-item>
                
                <ion-item>
                    <ion-label>{{ t("Posting Date") }}</ion-label>
                    <ion-label slot="end">{{dayjs(saleDoc?.posting_date).format("DD/MM/YYYY")}} {{dayjs(saleDoc?.creation).format("hh:mm A")}}</ion-label>
                </ion-item>
                <ion-item v-if="saleDoc?.tbl_number">
                    <ion-label>{{ t("Table #") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.tbl_number }}</ion-label>
                </ion-item>
               
                <template v-if="showMoreInfo"> 
                <ion-item>
                    <ion-label>{{ t("Outlet") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.outlet }}</ion-label>
                </ion-item>
                
                <ion-item>
                    <ion-label>{{ t("Stock Location") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.stock_location }}</ion-label>
                </ion-item>
                
                <ion-item>
                    <ion-label>{{ t("POS Profile") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.pos_profile }}</ion-label>
                </ion-item>
                <ion-item v-if="saleDoc?.working_day">
                    <ion-label>{{ t("Working Day") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.working_day }}</ion-label>
                </ion-item>
                
                <ion-item v-if="saleDoc?.cashier_shift">
                    <ion-label>{{ t("Cashier Shift") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.cashier_shift }}</ion-label>
                </ion-item>
                <ion-item v-if="saleDoc?.shift_name">
                    <ion-label>{{ t("Shift") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.shift_name }}</ion-label>
                </ion-item>
                <ion-item v-if="saleDoc?.pos_station_name">
                    <ion-label>{{ t("POS Station") }}</ion-label>
                    <ion-label slot="end">{{ saleDoc?.pos_station_name }}</ion-label>
                </ion-item>
                 <ion-item >
                    <ion-label>{{ t("Customer") }}</ion-label>
                    <ion-label slot="end">{{ customer.customer_name_en }}</ion-label>
                </ion-item>
</template>
 

            </ion-list>
            <ion-button fill="clear" expand="full"  @click="onShowMoreInfo">
                        {{ t((showMoreInfo?"Hide Info":"Show More")) }}
                    </ion-button>

                    <!-- Mobile Card detail -->
        <template v-if="saleDoc?.sale_products.length > 0">
       
                        
                        <template v-for="(d, index) in saleProducts" :key="index">
                            <ion-card class="ion-no-margin mb-2">
                                <ion-item lines="none">
                                    <ion-avatar >
                                        <Img v-if="d?.product_photo" :src="d?.product_photo" />
                                        <div class="avatar-placeholder" v-else>{{ getAvatarLetter(d.product_name) }}
                                        </div>
                                    </ion-avatar>
                                    <ion-label class="ml-2">
                                        <h2 class="card-title">{{ d.product_code }}</h2>
                                        <div class="card-title">{{ d.product_name }}</div>
                                        <p class="card-subtitle" style="color: black;">{{d.quantity}} x <com-currency :value="d.price"/></p>
                                        <div  >
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
                                        <ion-label color="primary"><div style="font-size: 20px;color: black;"><com-currency :value="d?.amount" /></div></ion-label>
                                    </ion-label>
                                </ion-item>
                            </ion-card>
                        </template>
                  

                
            </template>
            <ion-list style="margin-bottom: 30px;">
                <ion-item>
                    <ion-label>{{ t("Total Quantity") }}</ion-label>
                    <ion-label slot="end">
                        {{ totalQuantity }}
                    </ion-label>
                </ion-item>

                <ion-item v-if="subTotal > 0  ">
        <ion-label>{{ t("Sub Total") }}</ion-label>
        <ion-label slot="end"><ComCurrency :value="subTotal"/> </ion-label>
    </ion-item>
    
                <ion-item >
                    <ion-label>{{ t("Discountable Amount") }}</ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="saleDoc?.sale_discount" />
                    </ion-label>
                </ion-item>

                    
                <ion-item v-if="saleDoc?.product_discount > 0">
                    <ion-label>{{ t("Items Discount") }}</ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="saleDoc?.product_discount" />
                    </ion-label>
                </ion-item>
                <ion-item v-if="saleDoc.discount>0 || (saleDoc.sale_discount ||0) >0">
        <ion-label >
            {{ t("Sale Discount") }}
            <ion-text color="danger" v-if="saleDoc.discount_type=='Percent'">({{ saleDoc.discount }}% )</ion-text>     
           
        </ion-label>
         <ion-icon :icon="alertCircleOutline"  v-tooltip.top="saleDoc.discount_note"></ion-icon>
        <ion-label slot="end"><ComCurrency :value="saleDoc.sale_discount"/></ion-label>
    </ion-item>
                <ion-item v-if="saleDoc?.sale_discount > 0 && saleDoc?.product_discount > 0">
                    <ion-label>{{ t("Total Discount") }}

                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="saleDoc?.total_discount" />
                    </ion-label>
                </ion-item>
                
                <!--tax  -->
                <ion-item v-if="saleDoc?.tax_1_amount > 0">
                    <ion-label>{{ taxRule?.tax_1_name }} - {{ saleDoc.tax_1_rate }} %
                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="saleDoc?.tax_1_amount" />
                    </ion-label>
                </ion-item>

                <ion-item v-if="saleDoc?.tax_2_amount > 0">
                    <ion-label>{{ taxRule?.tax_2_name }} - {{ saleDoc.tax_2_rate }} %
                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="saleDoc?.tax_2_amount" />
                    </ion-label>
                </ion-item>

                <ion-item v-if="saleDoc?.tax_3_amount > 0">
                    <ion-label>{{ taxRule?.tax_3_name }} - {{ saleDoc.tax_3_rate }} %
                    </ion-label>
                    <ion-label slot="end">
                        <ComCurrency :value="saleDoc?.tax_3_amount" />
                    </ion-label>
                </ion-item>

                <ion-item v-if="[saleDoc?.tax_1_amount, saleDoc?.tax_2_amount, saleDoc?.tax_3_amount].filter(x => x > 0).length > 1">
                    <ion-label><strong>{{ t("Total Tax") }}</strong></ion-label>
                    <ion-label slot="end"><strong>
                            <ComCurrency :value="saleDoc?.tax_1_amount + saleDoc?.tax_2_amount + saleDoc?.tax_3_amount" />
                        </strong></ion-label>
                </ion-item>

                <!-- end total tax -->



                <!-- grand total -->
                <ion-item>
                    <ion-label><strong>{{ t("Grand Total") }} </strong>
                    </ion-label>
                    <ion-text slot="end">
                         <div class="amount">
                            <ComCurrency :value="grandTotal" />
                       </div>
                    </ion-text>
                </ion-item>

                <!-- paymen t -->
                        <ion-item  v-for="p in saleDoc?.payment">
                <ion-label>{{ p.payment_type }}</ion-label>
                <ion-label slot="end"><strong>
                    <ComCurrency :value="Math.abs(p.input_amount)" :currency="p.currency" />
                </strong>
                </ion-label>
            </ion-item>
                

                <ion-item v-if="saleDoc?.balance > 0">
                    <ion-label><strong>{{ t("Balance") }} </strong>
                    </ion-label>
                    <ion-text slot="end">
                        <div class="amount">
                            <ComCurrency :value="saleDoc?.balance" />
                        </div>
                    </ion-text>
                </ion-item>
                <ion-item v-if="saleDoc?.changed_amount > 0">
                    <ion-label><strong>{{ t("Change Amount") }} </strong>
                    </ion-label>
                    <ion-text slot="end">
                        <div class="amount">
                            <ComCurrency :value="saleDoc?.changed_amount" />
                        </div>
                    </ion-text>
                </ion-item>
                <ion-item v-if="saleDoc?.note">
                    <ion-note>{{ SaleDoc?.note }}</ion-note>
                </ion-item>
            </ion-list>
</div>     
<!-- {{ saleDoc }} -->
                  <!-- {{ saleProducts }} -->
      
    </BaseModal>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useSaleCoupon } from '@/hooks/useSaleCoupon';
import { getAvatarLetter } from "@/helpers/utils";
import { phonePortraitOutline } from 'ionicons/icons';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';

const showMoreInfo = ref(false)
const currency = app.setting.currency;
const secondCurrency = app.setting.second_currency;
const plateform = ref(app.utils.getPlateform());

const { saleDoc,
      customer,
      grandTotal,
      totalQuantity,
      subTotal,
      saleDiscoutableAmount

     } = useSaleCoupon();
const t = window.t;

 
function getDisplayCoupon(coupons = []) {
  
  return [...coupons].slice(0, 3);
}

 
const saleProducts = computed(() => {
  const products = saleDoc.value?.sale_products || [];

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
      p.balance,
      p.exchange_rate,
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
        coupons: p.coupons || [],
        quantity: 0,
        amount:0,
        balance: p.balance,
        exchange_rate:p.exchange_rate,
        total_amount: 0
      };
    }

    grouped[key].quantity += p.quantity;
    grouped[key].amount += p.amount;
    grouped[key].balance += p.balance;
    grouped[key].total_amount += p.total_amount;
  }

   
  return Object.values(grouped).map(item =>
    JSON.parse(JSON.stringify(item))
  );
});

function onShowMoreInfo(){
    showMoreInfo.value = !showMoreInfo.value;
}
</script>
