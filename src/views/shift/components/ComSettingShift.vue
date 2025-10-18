<template>
<ComPopOver>
          <ion-button shape="round">
          <ion-icon slot="icon-only" :icon="ellipsisVertical"/>
        </ion-button>
        <template #content>
            <ion-list>
              <!-- Print Preview -->
              <ion-item button>
               <ComPopOver ref="previewPopover" :is-open="isOpen" @didDismiss="isOpen = false">
                    <div style="display: flex;">
                        <ion-icon :icon="eyeOutline" style="font-size: 20px;" slot="start"></ion-icon>
                        <ion-text class="ml-2">{{ t("Print Preview") }}</ion-text>
                    </div>
                  <template #content>
                    <ion-list>
                      <ion-item
                        v-for="l in languages"
                        :key="l.server_lang"
                        lines="full"
                        @click.stop="handlePreviewClick(l.server_lang)"
                        button
                      >
                        <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
                        <ion-label>{{ l.label }}</ion-label>  
                      </ion-item>
                    </ion-list>
                  </template>
                </ComPopOver>
              </ion-item>
              <!-- Print -->
              <ion-item button>
                 <ComPopOver>
                  <div style="display: flex;">
                    <ion-icon :icon="printOutline" style="font-size: 20px;" slot="start"></ion-icon>
                    <ion-text class="ml-2">{{ t("Print") }}</ion-text>
                  </div>

          <template #content="{ close }">
            <ion-list>
              <ion-item
              button
                v-for="l in languages"
                :key="l.server_lang"
                lines="full"
                @click.stop="() => { onPrint('base64', l.server_lang); close(); }"
              >
                <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
                <ion-label>{{ l.label }}</ion-label>
              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
              </ion-item>
              <!-- Download PDF -->
              <ion-item button>
                 <ComPopOver>
                  <div style="display: flex;">
                    <ion-icon :icon="cloudDownloadOutline" style="font-size: 20px;" slot="start"></ion-icon>
                    <ion-text class="ml-2">{{ t("Download PDF") }}</ion-text>
                  </div>
          <template #content="{ close }">
            <ion-list>
              <ion-item button
                v-for="l in languages"
                :key="l.server_lang"
                lines="full"
                @click.stop="() => { onPrint('pdf', l.server_lang); close(); }"
              >
                <ion-icon style="height: 32px;" :icon="l.icon" slot="start"></ion-icon>
                <ion-label>{{ l.label }}</ion-label>
              </ion-item>
            </ion-list>
          </template>
        </ComPopOver>
              </ion-item>
            </ion-list>
        </template>
        </ComPopOver>
</template>

<script setup>
import { refreshOutline,ellipsisVertical,cloudDownloadOutline, eyeOutline, printOutline } from 'ionicons/icons';
import { ref } from 'vue'
import { useApp } from '@/hooks/useApp';
const t= window.t;
const default_printer = ref()

const name = ref(app.route.params.name)
 const {languages} = useApp()
const previewPopover = ref(null)

const model = defineModel()



 async function onPrint(return_type="base64",lang="en"){
 
  if(return_type=="pdf"){
    app.printing.downloadPdf( {doctype:model.value.props.options.doctype,docname:name.value, template:model.value.props.options.print_template, lang:lang})
  }else if(return_type=="html"){
      
    app.printing.printPreview( {doctype:model.value.props.options.doctype,docname:name.value, template:model.value.props.options.print_template, lang:lang,show_loading:true})
  }else {
     app.printing.onPrint( {doctype:model.value.props.options.doctype,docname:name.value, template:model.value.props.options.print_template,printer_name:default_printer.value, lang:lang,show_loading:true,copy:model.value.props.options.copies})
  }
}

function handlePreviewClick(lang) {
  onPrint('html', lang)
  previewPopover.value?.close() // if your ComPopOver exposes a close() method
}
</script>