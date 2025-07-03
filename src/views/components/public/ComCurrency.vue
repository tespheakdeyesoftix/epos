<template>
    
    <ion-text :color="color">
      
        <template v-if="format" >
        
          {{ formatCurrency() }}
        </template>
        <template v-else>
          
          <template v-if="symbol_on_right==0">{{ curencySymbol }}</template>

{{ formatCurrency() }}
<template v-if="symbol_on_right==1">{{ curencySymbol }}</template>
        </template>
       
      </ion-text>

</template>
<script setup>
 
import {computed} from "vue"
const props = defineProps({
    currency:String,
    value:Number,
    hideAmount:Boolean,
    format:String,
    color:String
})

const setting = app.setting;
const symbol_on_right = computed(()=>{
  if(!props.currency) return setting.symbol_on_right
  if (props.currency == setting.currency) return setting.symbol_on_right
  if(props.currency == setting.second_currency) return setting.second_symbol_on_right

  return 0

})

const curencySymbol = computed(()=>{
  if(!props.currency) return setting.currency_symbol
  if (props.currency == setting.currency) return setting.currency_symbol
  if(props.currency == setting.second_currency) return setting.second_currency_symbol

  return 0

})


function formatCurrency() {
  if(!props.format){
  
    if(!props.currency ) {
          return `${Number(props.value).toLocaleString('en-US', {
          minimumFractionDigits: app.setting.currency_precision,
          maximumFractionDigits: app.setting.currency_precision
      })}`;
    }
    
    if(props.currency == setting.currency ) {
          return `${Number(props.value).toLocaleString('en-US', {
          minimumFractionDigits: app.setting.currency_precision,
          maximumFractionDigits: app.setting.currency_precision
      })}`;
    }
    
    if(props.currency == setting.second_currency ) {
          return `${Number(props.value).toLocaleString('en-US', {
          minimumFractionDigits: app.setting.second_currency_precision,
          maximumFractionDigits: app.setting.second_currency_precision
      })}`;
    }


  }else {
     
    return  app.currencyFormat(props.value, props.format)
  }
  
}
</script>