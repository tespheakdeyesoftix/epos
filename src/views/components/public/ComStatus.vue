<template>
   
     <ion-chip  v-if="status" :class="['small-chip','ion-no-margin' ,csClass]"  :color="getSeverity()" size="small">{{ t(status) }}</ion-chip>
     
</template>
<script setup>
const t = window.t
const props = defineProps({
    status:String,
    csClass:String,
    color:String
})
const getSeverity = () => {
    if(props.color){
        return props.color
    }
    switch (props.status) {
        case 'Paid':
            return 'success';
        case 'Closed':
            return 'success';    
        case 'Used':
            return 'success';
        case 'Submitted':
            return 'success';

        case 'Unpaid':
            return 'danger';
        case 'Draft':
            return 'warning';

        case 'Partially Paid':
            return 'warning';
        case 'Sale Coupon':
            return 'success';    
        case 'Top Up':
            return 'warning';    
        case 'Redeem':
            return 'danger';
        case 'Redeemed':
            return 'danger';
        case 'Deleted':
            return 'danger';
        case 'Deleting...':
            return 'danger';
        case 'Delete fail':
            return 'danger';
            
        case 'Expired':
            return 'danger';
        case 'Fail':
            return 'danger';
            // store shift check 
        case 'Opened':
            return 'primary';
        case 'Not Opened':
            return 'danger';



       
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