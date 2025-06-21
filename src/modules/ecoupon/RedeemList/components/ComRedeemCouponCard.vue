<template>
   <ion-card class="ion-no-margin mb-2 mt-2">
        <ion-card-content> 
 <stack row>
           
                 <ion-avatar>
                                <Img v-if="data?.product_photo" :src="data?.product_photo" />
                                <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.product_name) }}
                                </div>
                            </ion-avatar>
            
            <div>
   <ion-text>{{data?.product_code}} - 
           {{data?.product_name}}</ion-text>
           <br/>
          
            
            </div>
            </stack>
</ion-card-content>   
</ion-card>
   
</template>
<script setup>
import { getAvatarLetter } from "@/helpers/utils"
const props = defineProps({
    data:Object
})
const t = window.t;
</script>