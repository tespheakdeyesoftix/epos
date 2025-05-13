<template>
    
     <ion-chip  v-if="status" :class="['small-chip',csClass]"  :color="getSeverity()" size="small">{{ t(status) }}</ion-chip>
     
</template>
<script setup>
const t = window.t
const props = defineProps({
    status:String,
    csClass:String
})
const getSeverity = () => {
    switch (props.status) {
        case 'Paid':
            return 'success';

        case 'Unpaid':
            return 'danger';
        case 'Draft':
            return 'danger';

        case 'Partially Paid':
            return 'warning';

       
            default:
            return "primary";
    }
};
</script>

<style scoped>
.small-chip {
  --padding-start: 4px;
  --padding-end: 4px;
  --padding-top: 2px;
  --padding-bottom: 2px;
  --border-radius: 12px;
  font-size: 12px;
  height: 18px;

}
</style>