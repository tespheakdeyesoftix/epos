<template>
     
    <span >
      
        <template v-if="format" >
        
          {{ formatCurrency() }}
        </template>
        <template v-else>
          
          <template v-if="setting.symbol_on_right==0">{{ setting.currency_symbol }}</template>

{{ formatCurrency() }}
<template v-if="setting.symbol_on_right==1">{{ setting.currency_symbol }}</template>
        </template>
       
    </span>

</template>
<script setup>
 
const props = defineProps({
    value:Number,
    hideAmount:Boolean,
    format:String
})

const setting = app.setting;


function formatCurrency() {
  if(!props.format){
   
    return `${Number(props.value).toLocaleString('en-US', {
    minimumFractionDigits: app.setting.currency_precision,
    maximumFractionDigits: app.setting.currency_precision
  })}`;
  }else {
     
    return app.currencyFormat(props.value, props.format)
  }
  
}
</script>