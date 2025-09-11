<template>
  <div class="ion-padding" v-if="plateform == 'mobile'">
  <stack row equal  itemClass="col-6 sm:col-6 lg:col-4 ">
    <card color="primary" :value="data?.total_visit ?? 0" label="Total Visit" :isCurrency="false" />
    <card color="success" :value="data?.total_order ?? 0" label="Total Order" />
    <card color="warning" :value="data?.total_annual_order ?? 0" label="Total Annual Order" />
    
  </stack>
  </div>
  <!-- other plateform -->
  <div class="ion-padding" v-else>
  <stack row equal itemClass="col-6 sm:col-6 lg:col-4 " gap="0px">
    <card color="primary" :value="data?.total_visit ?? 0" label="Total Visit" :isCurrency="false" />
    <card color="warning" :value="data?.total_annual_order ?? 0" label="Total Annual Order" />
    <card color="success" :value="data?.total_order ?? 0" label="Total Order" />
  </stack>
  </div>
</template>

 

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
import ComCurrency from "@/views/components/public/ComCurrency.vue"

const plateform = ref(app.utils.getPlateform())

const t = window.t
const data = ref({ total_visit: 0, total_annual_order: 0, total_order: 0 })

// Define child component "card"
const card = defineComponent({
  props: {
    label: String,
    color: String,
    value: Number,
    isCurrency: { type: Boolean, default: true }
  },
    setup(props) {
    return () =>
      h('ion-card',
        { button: true, color: props.color, class: 'ion-no-margin' },
        [
          h('ion-card-content', { class: 'text-center' }, [
            h('ion-card-subtitle',
              { slot: 'end', style: 'font-size: 18px;' },
              props.isCurrency
                ? [h(ComCurrency, { value: props.value })]
                : props.value?.toString()  
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
