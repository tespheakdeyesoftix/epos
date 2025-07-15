<template>
    <ComPopOver>
                    <ion-button shape="round">
                    <ion-icon slot="icon-only" :icon="ellipsisVertical"/>
                    </ion-button>
                    <template #content>
                        <ion-list>
                        <ion-item @click="emit('onEdit')" lines="full" button>
                            <ion-icon :icon="pencilOutline" slot="start"/>
                            <ion-label >{{ t("Edit") }}</ion-label>
                        </ion-item>
                        <ion-item  v-for="f in printFormat" @click="emit('onPrint',f)" lines="full" button>
                            <ion-icon :icon="printOutline" slot="start"/>
                            <ion-label >{{ t(f.name) }}</ion-label>
                        </ion-item>
                          <ion-item @click="emit('onDelete')" lines="full" button >
                            <ion-icon :icon="trash" slot="start" color="danger"/>
                            <ion-label color="danger">{{ t("Delete") }}</ion-label>
                        </ion-item>
                        </ion-list>
                    </template>
                    </ComPopOver>
</template>
<script setup>
import {   ellipsisVertical, pencilOutline, printOutline, trash, trashBinOutline} from 'ionicons/icons';
import { IonListHeader } from '@ionic/vue';
import { onMounted, ref } from 'vue';
 
const emit = defineEmits()
const t = window.t;
const props = defineProps({
    pos_profile:String
})
const printFormat  =ref( []);

onMounted(async ()=>{
    if(props.pos_profile){
        const formats = await app.printing.getPrintFormat(props.pos_profile)
        if(formats){
            printFormat.value = formats.filter(x=>x.show_in_pos==1 && x.doc_type==="Sale");
        }
    }
    
})
 
</script>