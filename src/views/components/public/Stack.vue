<script setup>
import { computed } from 'vue'
import { defineProps, useSlots } from 'vue'

const props = defineProps({
  row: Boolean,
  column: Boolean,
  gap: {
    type: String,
    default: '0px'
  },
  equal: Boolean,
  inline: Boolean
})

const layoutDirection = computed(() => {
  if (props.row) return 'row'
  if (props.column) return 'column'
  return 'column' // default
})

const slots = useSlots()
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: layoutDirection,
      gap: props.gap,
      width: '100%',
      flexWrap: props.inline ? 'wrap' : 'nowrap'
    }"
  >
    <template v-for="(child, index) in slots.default?.() || []" :key="index">
      <div :style="equal ? { flex: 1 } : {}">
        <component :is="child" />
      </div>
    </template>
  </div>
</template>
