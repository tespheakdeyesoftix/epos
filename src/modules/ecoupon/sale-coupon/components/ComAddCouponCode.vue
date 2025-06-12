<template>
<BaseModal :title="title" :hideFooter="false" @onConfirm="onConfirm">
<com-input v-model="coupon"  @change="onScanBarCode" :label="t('Coupon Code')" :placeholder="t('Please scan coupon code')" label-placement="stacked" fill="outline" ></com-input>
<ion-list>
<ion-item button v-for="(c,index) in coupounList" :key="index">
    <ion-label>{{ c }}</ion-label>
    <ion-button @click="onDelete(index)" slot="end"  size="large" fill="clear" shape="round" color="danger">
        <ion-icon :icon="closeOutline"></ion-icon>
    </ion-button>
</ion-item>

</ion-list>
{{ data }}
<template #footer>
    <ion-button>hello</ion-button>
    
</template>
</BaseModal>

</template>
<script setup>
import { closeOutline } from 'ionicons/icons';
import { ref } from 'vue';


    const props = defineProps({
        data:Object,
        title:String
    })
    const t = window.t;
    const coupon = ref("")
const coupounList =ref([])
function onScanBarCode(){
   coupounList.value.push(coupon.value)
   coupon.value = ""
    
}

function onDelete(index){
    coupounList.value.splice(index,1)
}

function onConfirm(){
    alert("cl;ose model")
}
</script>