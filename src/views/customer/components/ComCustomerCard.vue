<template>
<!-- {{ data }} -->
    <ion-card class="ion-padding cursor-pointer">  
 <stack v-if="data?.name" row>
  <ion-avatar>
  <Img v-if="data?.photo" :src="data?.photo"/>
  <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.customer_name_en) }}</div>
</ion-avatar> 
<div>
  {{ data?.name}} {{ data?.customer_name_en }}
  <div>
  {{ data?.phone_number }}
</div>
<div>
     {{   data?.customer_group   }}
</div>
</div>
</stack>
    </ion-card>
</template>
<script setup >
import { imageUrl, getAvatarLetter } from "@/helpers/utils"
const t =window.t;
const props = defineProps({
    data:Object
})
</script>