<template>
     <div class="ion-padding">
  <div>Start Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>Page 2</div>
  <div>End of page 2</div>
  {{ data }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  data: String
})

console.log("page 2 loaded")

// Your data and methods
const localData = ref('Initial data')

const loadData = () => {
  console.log('Loading data for Page2...')
  // Simulate API call or data loading
  localData.value = `Page 2 data loaded at ${new Date().toLocaleTimeString()}`
}

// This method will be called when parent triggers refresh
const refresh = () => {
  console.log('Refresh method called in Page2')
  loadData()
}

// Optional: Add any other methods you need
const customMethod = () => {
  console.log('Custom method in Page2')
}

onMounted(() => {
  loadData()
   
})

// Expose the refresh method to parent
defineExpose({
  refresh,
  loadData,
  customMethod
})
</script>