<template>
  <ion-page>
    <ToolBar>{{ t("Close Cashier Shift") }} - {{ cashierShift?.name }}</ToolBar>
    <ion-content class="ion-padding">
        <div class="fix-container">
        <stack gap="20px">
          <stack row equal >
            <com-input v-model="cashierShift.working_day" readonly :label="t('Working Day Number')"></com-input>
            <com-input v-model="cashierShift.name" readonly :label="t('Cashier Shift Number')"></com-input>
          </stack>
          <stack row equal >
            <com-input v-model="closedDate" readonly :label="t('Working Day Number')"></com-input>
            <com-input v-model="cashierShift.shift_name" readonly :label="t('Shift Name')"></com-input>
          </stack>
          <stack row equal >
            <com-input v-model="cashierShift.pos_profile" readonly :label="t('POS Profile')"></com-input>
            <div>
              <ion-text>
                {{ t("Open Note") }}:
              </ion-text>
              <br/>
              <ion-note>
                
                {{ cashierShift.opened_note || t("No Open Note") }}
              </ion-note>

            </div>
          </stack>


        </stack>

        <ion-text color="primary">
          <h4>{{ t("Close Shift Amount") }}</h4>
        </ion-text>

        <DataTable :value="closeShiftSummary" tableStyle="min-width: 50rem">
    <Column field="payment_method" :header="t('Payment Type')"></Column>
    <Column field="input_amount" :header="t('Opening Amount')" headerClass="text-right" bodyClass="text-right">
       <template #body="slotProps">
           <ComCurrency :value="slotProps.data.input_amount" :currency="slotProps.data.currency" />
        </template>
    </Column>
    
    <Column field="system_close_amount" :header="t('System Closed Amount')" headerClass="text-right" bodyClass="text-right">
       <template #body="slotProps">
         
           <ComCurrency :value="slotProps.data.input_system_close_amount" :currency="slotProps.data.currency" />
        </template>
    </Column>
    <Column field="input_close_amount" :header="t('Closed Amount')" headerClass="text-right" bodyClass="text-right">
       <template #body="slotProps">
       
           <com-input keyboard @change="onCloseAmountChange(slotProps.data)" v-model="slotProps.data.input_close_amount" type="number"></com-input>
        </template>
    </Column>
 
    <Column field="different_amount" :header="t('Difference Amount')" headerClass="text-right" bodyClass="text-right">
       <template #body="slotProps">
           <ComCurrency  :value="slotProps.data.different_amount" :currency="slotProps.data.currency" />
        </template>
    </Column>
    <ColumnGroup type="footer">
        <Row>
            <Column :footer="t('Totals:')"   />
            <Column footerStyle="text-align:right">
              <template #footer>
                <strong>
                  <ComCurrency :value="totalOpeningAmount"/></strong>
              </template>
            </Column>
            <Column footerStyle="text-align:right">
              <template #footer>
                <strong>
                  <ComCurrency :value="totalSystemCloseAmount"/></strong>
              </template>
            </Column>
            <Column footerStyle="text-align:right">
              <template #footer>
                <strong>
                  <ComCurrency :value="totalClosedAmount"/></strong>
              </template>
            </Column>
            
            <Column footerStyle="text-align:right">
              <template #footer>
                <strong>
                  <ComCurrency :value="totalDifferenceAmount"/></strong>
              </template>
            </Column>
            
        </Row>
    </ColumnGroup>
    
</DataTable>
<div class="mt-4">
<com-input  type="text-area" :label="t('Close shift note')" keyboard v-model="cashierShift.closed_note" />
</div>


         </div>
    </ion-content>
     <ComFooter>
      
      <ion-button v-if="plateform!='mobile'" color="danger" @click="onCancel">{{ t("Cancel") }}</ion-button>
      <ion-button  :routerLink="'/shift-detail/' + cashierShift.name">{{ t("View Shift Detail") }}</ion-button>

      <ion-button color="success" @click="onCloseCashierShift">{{ t("Close Cashier Shift") }}</ion-button>
     </ComFooter>
  </ion-page>
</template>
<script setup>
import dayjs from 'dayjs';
import { computed, onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; 
import Row from 'primevue/row';  
import { useApp } from '@/hooks/useApp';
const plateform = ref(app.utils.getPlateform())

const { isCashierShiftOpened } = useApp();


const t = window.t;
const cashierShift = ref(app.setting.cashier_shift);
const closedDate = dayjs(cashierShift.value.posting_date).format('DD/MM/YYYY');
const closeShiftSummary = ref([])
 
const totalOpeningAmount = computed(()=>{
  return closeShiftSummary?.value.reduce((sum, item) => sum + (item.opening_amount || 0), 0);
})
const totalSystemCloseAmount = computed(()=>{
  return closeShiftSummary?.value.reduce((sum, item) => sum + (item.system_close_amount || 0), 0);
})
const totalClosedAmount= computed(()=>{
  return closeShiftSummary?.value.reduce((sum, item) => sum + (item.input_close_amount || 0) / (item.exchange_rate || 1), 0);
})

const totalDifferenceAmount= computed(()=>{
  return closeShiftSummary?.value.reduce((sum, item) => sum + (item.different_amount || 0) / (item.exchange_rate || 1), 0);
})


 
function onCloseAmountChange(d)
{
  d.different_amount = d.input_close_amount - d.input_system_close_amount
}



function onCancel(){
  app.ionRouter.navigate("/home","back","replace");
}

async function onCloseCashierShift(){
  


  const confirm = await app.onConfirm("Close Cashier Shift","Are you sure you want to close cashier shift?")
  if(!confirm) return
  const loading = await app.showLoading();
 
  cashierShift.value.is_closed = 1;
  cashierShift.value.closed_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
  cashierShift.value.cash_float = closeShiftSummary.value;
  const res = await app.updateDoc("Cashier Shift",cashierShift.value.name, cashierShift.value)
  if(res.data){
    isCashierShiftOpened.value = false;
    delete app.setting.cashier_shift;

  await app.showSuccess("Close shift successfully")
    await loading.dismiss()
 await printReport();
 
    app.ionRouter.navigate("/shift-detail/" + res.data.name,"push","replace");
    
  }
  loading.dismiss();
  app.utils.playSuccessSound();

}


onMounted(async ()=>{
 
  const loading = await app.showLoading()
  let res = await app.postApi("epos_restaurant_2023.api.api.get_close_shift_summary",{
    cashier_shift:cashierShift.value.name,
    show_system_closed_amount:app.setting.pos_config?.show_system_closed_amount
  })


  if(res.data){
    closeShiftSummary.value = res.data;
  }
  
  
  await loading.dismiss();
})

 

async function printReport() {
       const printSettings = app.setting.pos_config.print_settings.filter(x=>x.print_type=="Cashier Shift") || []
       for (const p of printSettings) {
            await app.printing.onPrint( {doctype:"Cashier Shift", docname: cashierShift.value.name, template:p.print_template ,printer_name:p.printer_name, lang:p.lang,copy:p.copies,show_loading:false})
        }
        

        }




</script>