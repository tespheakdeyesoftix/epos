<template>
    recent order
  
    <ion-card  v-for="invoice in data.value"  >
      <ion-card-header>
        <ion-card-title>{{ invoice.name }}</ion-card-title>
        <ion-card-subtitle> {{ invoice.tbl_number ?? '—' }} | Status: {{ invoice.status }}
        </ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <p><strong>Total:</strong> ${{ invoice.grand_total.toFixed(2) }}</p>
        <div class="flex" style="float: right;">
<p>{{ invoice.owner }} - {{ invoice.creation }}</p>
        </div>
        
      </ion-card-content>
    </ion-card>  
    {{ data.value[0] }}
</template>
<script setup>
const props = defineProps({
    data:Object
})
</script>