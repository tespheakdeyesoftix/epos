<template>
  <DocList
    docType="Sale"
    :options="options"
    v-model:selectedRow="selectedRow"
 
  >
    <template #name="{ item }">
      {{ item.name }}
    </template>
  </DocList>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  customer: String
})

const selectedRow = ref()

const options = {
  columns: [
    { fieldname: "name", header: "Sale #" },
    { fieldname: "customer_name", header: "Customer" },
    { fieldname: "total_quantity", header: "Quantity", fieldtype: "Float" },
    { fieldname: "grand_total", header: "Total Amount", fieldtype: "Currency" },
    { fieldname: "modified_by", header: "User" },
    { fieldname: "modified", header: "Modified Date", fieldtype: "Datetime" }
  ],
  fields: [
    "name", "posting_date", "total_quantity", "grand_total",
    "customer", "customer_name", "tbl_number", "modified", "modified_by"
  ],
  filters: [["customer", "=", props.customer]],
  orderBy: {
    field: "modified",
    order: "desc"
  }
}

 
</script>
