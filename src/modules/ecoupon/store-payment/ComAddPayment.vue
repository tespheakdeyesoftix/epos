<template>
  <BaseModal 
    :title="t(docname ? 'Edit Store Payment' : 'Add Store Payment')" 
    @onConfirm="onConfirmClick" 
    :confirmText="buttonText"
    :hideConfirm="doc.docstatus!=0"
  >
  
  <Message v-if="doc.name && doc.docstatus == 0 && !docChanged" severity="info" class="mb-3">{{ t('Submit this document to confirm') }}</Message>
  <Message v-if="doc.pos_profile" severity="success" class="mb-3">{{ t('Current Balance:') }} <ComCurrency :value="creditBalance" /> </Message>
  
  <stack>
      <stack row equal>
        <ComSelectInput docType="POS Profile" v-model="doc.pos_profile" :label="t('Select Store')" @onSelected="onSelectPOSProfile" />
        <com-input type="date" :label="t('Posting Date')" v-model="doc.posting_date" />
      </stack>
    </stack>

 

    <card :header="t('Payment Type')" class="ion-padding ion-no-margin mt-4 mb-4">
      <ion-grid>
        <ion-row v-for="(p, index) in doc.payments" :key="index">
          <ion-col :size="6">
            <Select 
              size="large" 
              v-model="p.payment_type"  
              @change="(e) => onSelectPayemntType(e, p)"  
              :options="paymentTypes" 
              optionLabel="payment_type" 
              optionValue="payment_type"  
              class="w-full" 
              variant="filled" 
              style="height: 55px;"
              :placeholder="t('Select Paymnent Type')"
            />
          </ion-col>
          <ion-col :size="5">
            <com-input type="number" v-model="p.input_amount" :placeholder="t('Payment Amount')" />
          </ion-col>
          <ion-col :size="1">
            <ion-button 
              :disabled="doc.payments.length === 1" 
              color="danger" shape="round" fill="clear" 
              @click="onRemovePayment(index)"
            >
              <ion-icon :icon="removeOutline" slot="icon-only" />
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col :size="6">
            <ion-label><strong>{{ t("Total Payment") }}</strong></ion-label>
          </ion-col>
          <ion-col :size="6">
            <strong><ComCurrency :value="totalPaymentAmount" /></strong>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-button shape="round" fill="clear" @click="onAddPayment">
        <ion-icon :icon="addOutline" slot="start" />
        {{ t("Add Payment") }}
      </ion-button>

      <stack >
        <stack row equal>
          <com-input keyboard :label="t('Receive By')" v-model="doc.receive_by" />
          <com-input keyboard :label="t('Receive By Phone')" v-model="doc.receive_by_phone_number" />
        </stack>
      </stack>
    </card>

    <com-input type="text-area" keyboard :label="t('Note')" v-model="doc.note" />
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { modalController } from '@ionic/vue'
import Select from 'primevue/select'
import { addOutline, removeOutline } from 'ionicons/icons'
import dayjs from 'dayjs'
import Message from 'primevue/message';
import beep from '/assets/sound/submit.mp3'
import Stack from '@/views/components/public/Stack.vue'
const beepSound = new Audio(beep)

const props = defineProps({
  docname: String,
  docListRef:Object
})

const creditBalance = ref(0)

const t = window.t
const paymentTypes = app.setting.pos_config.payment_type

const doc = ref({
  business_branch: app.setting.property?.property_name,
  docstatus:0,
  working_day: app.setting.working_day.name,
  cashier_shift: app.setting.cashier_shift?.name,
  posting_date: new Date(app.setting.working_day.posting_date),
  payments: [{ payment_type: paymentTypes[0].payment_type }],
  note: '',
})

const originalData = ref({})

const docChanged = ref(false)

// Deep compare function using JSON.stringify
function isDocChanged(newDoc, oldDoc) {
  return JSON.stringify(newDoc) !== JSON.stringify(oldDoc)
}



// Watch doc deeply and update docChanged
watch(
  doc,
  (newVal) => {
    docChanged.value = isDocChanged(newVal, originalData.value)
  },
  { deep: true, immediate: false }
)

const isEditing = computed(() => !!props.docname)

const buttonText = computed(() => {

  if (!doc.value.name) return t('Save')
  
  if (!isEditing.value) return t('Submit')
  return docChanged.value ? t('Save') : t('Submit')
})

const totalPaymentAmount = computed(() => {
  return doc.value.payments.reduce(
    (sum, item) => sum + (item?.input_amount || 0) / (item.exchange_rate || 1),
    0
  )
})

function onSelectPOSProfile(profile){
 
  const res = app.getApi("epos_restaurant_2023.selling.doctype.store_payment.store_payment.get_vendor_credit_balance",{
    pos_profile:profile.name
  });
  if(res.data){
    creditBalance.value = res.data
  }

}

function onSelectPayemntType(event, p) {
  let pt = event.value
  pt = paymentTypes.find(x => x.payment_type === pt)
  p.payment_type = pt.payment_type
  p.exchange_rate = pt.exchange_rate
  p.currency = pt.currency
}

function onRemovePayment(index) {
  doc.value.payments.splice(index, 1)
}

function onAddPayment() {
  doc.value.payments.push({})
}

async function onSubmit() {
  const confirm = await app.onConfirm("Confirm","Are you sure you want to submit this document?")
  if(!confirm) return;

  const l =await app.showLoading();
  const saveDoc = JSON.parse(JSON.stringify(doc.value))
  saveDoc.posting_date = dayjs(saveDoc.posting_date).format('YYYY-MM-DD')
  await app.submitDoc(saveDoc)

       beepSound.currentTime = 0
      beepSound.play()
    app.showSuccess("Submit successfully")  
  props.docListRef.value.onRefresh();
  modalController.dismiss();

  await l.dismiss();
}

async function onSave() {
  const loading = await app.showLoading()
  const saveDoc = JSON.parse(JSON.stringify(doc.value))
  saveDoc.posting_date = dayjs(saveDoc.posting_date).format('YYYY-MM-DD')

  const result = saveDoc.name
    ? await app.updateDoc('Store Payment', saveDoc.name, saveDoc)
    : await app.createDoc('Store Payment', saveDoc)

  if (result.data) {
        updateDocChangeStatus(result.data);
    app.showSuccess(saveDoc.name ? 'Update successfully.' : 'Added successfully.')

  }
  
  await loading.dismiss()
  // props.docListRef.value.onRefresh();

}

function onConfirmClick() {
  if (!doc.value.name) {
    onSave();
    return;
  }

  if (docChanged.value) {
    onSave()
  } else {
    onSubmit()
  }

}

function updateDocChangeStatus(data){
    doc.value = data
      if (doc.value.posting_date) {
        doc.value.posting_date = new Date(doc.value.posting_date)
      }
 originalData.value = JSON.parse(JSON.stringify(doc.value)) // deep clone
      docChanged.value = false
}

onMounted(async () => {
  if (props.docname) {
    const l = await app.showLoading()
    const res = await app.getDoc('Store Payment', props.docname)
    if (res.data) {
    
     updateDocChangeStatus(res.data);
    }
    await l.dismiss()
  } else {
     updateDocChangeStatus(doc.value);
    
  }
})
</script>
