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
 

// Your data and methods
const localData = ref('Initial data')

const loadData = () => {
 
  // Simulate API call or data loading
  localData.value = `Page 2 data loaded at ${new Date().toLocaleTimeString()}`
}

// This method will be called when parent triggers refresh
const refresh = () => {
 
  loadData()
}

// Optional: Add any other methods you need
const customMethod = () => {
 
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