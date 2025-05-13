<template>
    
    <span >
       $ {{  value.toLocaleString('en-US') }}
    </span>

</template>
<script setup>
import { useApp } from '@/hooks/useApp';

const props = defineProps({
    value:Number,
    hideAmount:Boolean
})

</script>