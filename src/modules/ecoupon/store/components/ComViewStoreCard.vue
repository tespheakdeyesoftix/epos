<template>
  <div class="ion-padding">
  
    <stack row equal itemClass="col-6 sm:col-6 lg:col-4" gap="0px">
      <Card color="primary" label="Today Revenue" :value="data?.current_revenue || 0" />
      <Card color="secondary" label="MTD Revenue" :value="data?.mtd_revenue || 0" />
      <Card color="success" label="YTD Revenue" :value="data?.ytd_revenue || 0" />
    </stack>
  </div>
</template>

<script setup lang="tsx">
import dayjs from 'dayjs'
import { ref, onMounted, defineComponent } from 'vue'

const t = window.t

// Reactive data object
// const data = ref<Record<string, any>>({})
const data = ref(null)
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


async function getData() {
  const workingDay = app.setting?.working_day?.posting_date || dayjs().format("YYYY-MM-DD")
  const res = await app.getApi('epos_restaurant_2023.purchasing.doctype.vendor.vendor.get_store_revenue', {
    vendor: app.route.params.name,
    posting_date: workingDay
  })
 if(res.data){
  data.value = res.data
 } 
}


onMounted(() => {
  getData()
})
</script>
