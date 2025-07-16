<template>
    <ion-page>
        <ToolBar>{{ t("Store Detail") }} - {{ data?.name || 0}}</ToolBar>
        <ion-content>
            stordetail
            {{ data }}
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const t = window.t

const data = ref(null)
async function loadData() {
  const l = await app.showLoading()

  const res = await app.getDoc("Vendor", app.route.params.name)
  if (res.data) data.value = res.data

  await l.dismiss()
}

onMounted(async () => {
  await loadData()
})
</script>