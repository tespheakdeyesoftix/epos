<template>
  <ion-segment>
    <ion-segment-button value="About" content-id="About">
      <ion-label>{{ t("About") }}</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Recent Order" content-id="Recent Order">
      <ion-label>{{ t("Recent Order") }}</ion-label>
    </ion-segment-button>
  </ion-segment>
 
  <ion-segment-view class="segment-view">
    <ion-segment-content id="About">
      <div class="flex-grid">
        <div
          class="flex-item"
          v-for="(col, index) in options.columns"
          :key="index"
        >
          <div class="field-value">
  {{
    col.fieldtype === 'Datetime'
      ? dayjs(data?.[col.fieldname]).format('DD-MM-YYYY')
      : (data?.[col.fieldname] || 'null')
  }}
</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t(col.header) }}</ion-text>
          </div>
        </div>
      </div>
    </ion-segment-content>
{{ col }}
    <ion-segment-content id="Recent Order">
      <ion-text color="medium">{{ t("Recent Order") }}</ion-text>
    </ion-segment-content>
  </ion-segment-view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
const data = ref();
const t = window.t;

// Load customer data
async function loadData() {
  const l = await app.showLoading();
  const res = await app.getDoc("Customer", app.route.params.name);
  if (res.data) {
    data.value = res.data;
  }
  await l.dismiss();
}

onMounted(async () => {
  await loadData();
});

// Helper to format date fields 

const options = {
  columns: [
    { fieldname: "name", header: "Customer" },
    { fieldname: "customer_name_kh", header: "Name Kh" },
    { fieldname: "gender", header: "Gender" },
    { fieldname: "customer_group", header: "Group" },
    { fieldname: "date_of_birth", header: "Date of Birth" },
    { fieldname: "phone_number", header: "Phone Number" },
    { fieldname: "company_name", header: "Company Name" },
    { fieldname: "address", header: "Location" },
    { fieldname: "modified", header: "Last Modified", fieldtype: "Datetime" }
  ],
  showSearchBar: true,
  showBarcodeScanner: false,
  fields: [
    "name", "customer_name_en", "customer_name_kh", "gender",
    "company_name", "address", "customer_group",
    "date_of_birth", "phone_number", "modified"
  ]
};
</script>

<style scoped>
.segment-view {
  overflow-y: auto;
}

.mt-1 {
  margin-top: 4px;
}

.flex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px;
}

.flex-item {
  flex: 1 1 45%;
  min-width: 140px;
  max-width: 48%;
  padding: 10px;
}

.field-value {
  font-weight: 500;
  font-size: 16px;
}
</style>
