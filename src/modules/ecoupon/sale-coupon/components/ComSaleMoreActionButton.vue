<template>
    <ion-button shape="round" expand="full" id="more-action">{{ t("Mores") }}</ion-button>
    
 <ion-popover 
    trigger="more-action" 
    :is-open="false"   
    :dismiss-on-select="true" 
    trigger-action="click" 
    style="--width:500px"
    >
    <ion-content>
        <ion-grid>
            <ion-row>
                <ion-col>
                    <ion-list>
                        <ion-item button lines="full" @click="onChangeReferenceNumber">
                            <ion-label>{{ t("Set Reference Number") }}</ion-label>
                        </ion-item>
                        
                      <ion-item button lines="full" @click="onChangeNote">
                            <ion-label>{{ t("Note") }}</ion-label>
                        </ion-item>
                        
                        <ion-item>
                            <ion-label>option 1</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>option 1</ion-label>
                        </ion-item>

                    </ion-list>
                </ion-col>
                <ion-col>
                    <ion-list>
                        <ion-item>
                            <ion-label>option 1</ion-label>
                        </ion-item>
                        
                        <ion-item>
                            <ion-label>option 1</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>option 1</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>option 1</ion-label>
                        </ion-item>

                    </ion-list>

                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
  </ion-popover>

</template>
<script setup >
import { useSaleCoupon } from '@/hooks/useSaleCoupon';
const {saleDoc} = useSaleCoupon();
const t = window.t;

async function onChangeReferenceNumber(){
    const result = await app.utils.onOpenKeyboard({
        title:t("Reference Number")
    })
    if(result){
saleDoc.value.reference_number = result;
    }
    
}

async function onChangeNote(){
    const result = await app.utils.onOpenKeyboard({
        title:t("Note"),
          defaultValue:saleDoc.value.note || "",
        storageKey:"sale_note"
    })
    
    if( (typeof result) == "string"){
saleDoc.value.note = result;
    }
    
}
</script>