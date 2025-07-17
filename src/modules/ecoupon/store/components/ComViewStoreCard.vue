<template>
  <div class="ion-padding">
    <stack row equal itemClass="col-6 sm:col-6 lg:col-3" gap="0px">
      <Card color="primary" label="Opening Balance" :value="data?.opening_balance || 0" />
      <Card color="warning" label="Debit" :value="data?.debit || 0" />
      <Card color="success" label="Credit" :value="data?.credit || 0" />
      <Card color="success" label="Balance" :value="data?.balance || 0" />
    </stack>
  </div>
  
</template>

<script setup lang="tsx">
import { ref, onMounted, defineComponent } from 'vue'

// Global translate function
const t = window.t

// Reactive data object
const data = ref<Record<string, any>>({})

// Card component definition
const Card = defineComponent({
  name: 'Card',
  props: {
    label: String,
    color: String,
    value: Number
  },
  setup(props) {
    return () => (
      <ion-card button color={props.color} class="ion-no-margin">
        <ion-card-content class="text-center">
          <ion-card-subtitle style="font-size: 18px;">
            <ComCurrency value={props.value ?? 0} />
          </ion-card-subtitle>
          <ion-card-subtitle class="mt-2" style="font-size: 18px;">
            {t(props.label)}
          </ion-card-subtitle>
        </ion-card-content>
      </ion-card>
    )
  }
})

// Function to fetch data from API without try/catch or .catch()
function getData() {
  // const workingDay = app.setting?.working_day?.name || new Date().toISOString().split('T')[0]

  app.getApi('epos_restaurant_2023.purchasing.doctype.vendor.vendor.get_vendor_credit_balance', {
    vendor: app.route.params.name,
    date: app.setting?.working_day?.name,
    // date: workingDay
  }).then(response => {
    if (response?.data) {
      data.value = response.data
    } else {
      console.warn('No data returned:', response)
      data.value = {}
    }
  })
   
}

onMounted(() => {
  
  getData()
})
</script>
