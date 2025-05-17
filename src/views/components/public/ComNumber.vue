<template>
    
    <span >
      {{ formatNumber() }}
    </span>

</template>
<script setup>
import { useApp } from '@/hooks/useApp';

const props = defineProps({
    value:Number,
})

function formatNumber(){
    
    return app.getNumber(props.value, app.setting.float_precision)
}


</script>