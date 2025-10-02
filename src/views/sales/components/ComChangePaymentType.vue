<template>
    
<BaseModal :title="t('Change Payment Type')">
    <!-- {{ paymentTypes }} -->
    <ion-list>
        
    <ion-item v-for="(p,index) in data.payment" :key="index">
        <ion-label>
            <p>
                {{ p.payment_type }}
            </p>
            <p><strong><ComCurrency :value="p.input_amount" :currency="p.currency"/></strong></p>
        </ion-label>

        
          <ion-select label="Default label" placeholder="Favorite Fruit">
        <ion-select-option value="apple">Apple</ion-select-option>
        <ion-select-option value="banana">Banana</ion-select-option>
        <ion-select-option value="orange">Orange</ion-select-option>
      </ion-select>
    </ion-item>
    </ion-list>
</BaseModal>

</template>
<script setup>
import Select from 'primevue/select'

const props = defineProps({
    data:Object
})

const paymentTypes = app.setting?.pos_config.payment_type;
 
    const t = window.t;

    function onSelectPayemntType(event, p) {
  let pt = event.value
  pt = paymentTypes.find(x => x.payment_type === pt)
  p.payment_type = pt.payment_type
  p.exchange_rate = pt.exchange_rate
  p.currency = pt.currency
}

</script>