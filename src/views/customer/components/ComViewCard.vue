<template>
  <div class="ion-padding">
  <stack row equal itemClass="col-6 sm:col-6 lg:col-4 " gap="0px">
    <card color="primary" :value = "data?.total_visit ?? 0" label="Total Visit" />
    <card color="warning" :value = "data?.total_annual_order ?? 0" label="Total Anual Order" />
    <card color="success" :value = "data?.total_order ?? 0" label="Total Order" />
  </stack>
  </div>
   <!-- {{ data }} -->
</template>

<!-- <script setup>
import { ref,  } from 'vue'
const t = window.t
const data = ref({"total_visit":0,"total_annual_order":0,"total_order":0})
</script> -->

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
import ComCurrency from "@/views/components/public/ComCurrency.vue"

const t = window.t
const data = ref({ total_visit: 0, total_annual_order: 0, total_order: 0 })

// Define child component "card"
const card = defineComponent({
  props: {
    label: String,
    color: String,
    value: Number
  },
  setup(props) {
    return () =>
      h('ion-card',
        { button: true, color: props.color, class: 'ion-no-margin' },
        [
          h('ion-card-content', { class: 'text-center' }, [
            h('ion-card-subtitle',
              { slot: 'end', style: 'font-size: 18px;' },
              [h(ComCurrency, { value: props.value })]
            ),
            h('ion-card-subtitle',
              { class: 'mt-2', style: 'font-size: 18px;' },
              props.label
            )
          ])
        ]
      )
  }
})

// Fetch API
async function getData() {
  const response = await app.getApi(
    'epos_restaurant_2023.selling.doctype.customer.customer.get_customer_order_summary',
    {
      customer: app.route.params.name
    }
  )

  if (response?.data) {
    data.value = response.data
  } else {
    console.warn('No data returned:', response)
    data.value = { total_visit: 0, total_annual_order: 0, total_order: 0 }
  }
}

onMounted(() => {
  getData()
})
</script>



<!-- <script setup lang="tsx">
import { ref, onMounted,defineComponent } from 'vue'
import ComCurrency from "@/views/components/public/ComCurrency.vue"
const t = window.t
const data = ref({"total_visit":0,"total_annual_order":0,"total_order":0})

const card = defineComponent({
  props: {
    label: String,
    color: String,
    value:Number
  },
  setup(props) {
    return () => (
      <ion-card button color={props.color} class="ion-no-margin">
      <ion-card-content class="text-center">
        <ion-card-subtitle slot="end" style="font-size: 18px;">
          <ComCurrency value={props.value} />
        </ion-card-subtitle>
        <ion-card-subtitle class="mt-2" style="font-size: 18px;">
          {(props.label)}
        </ion-card-subtitle>
      </ion-card-content>
    </ion-card>
    )
  }
})

async function getData() {
    const response = await app.getApi(
      'epos_restaurant_2023.selling.doctype.customer.customer.get_customer_order_summary',
      {
        customer: app.route.params.name
      }
    )

    if (response?.data) {
      data.value = response.data
    } else {
      console.warn('No data returned:', response)
      data.value = {"total_visit":0,"total_annual_order":0,"total_order":0}
    }
  }  

onMounted(() => {
  getData()
})
</script> -->
