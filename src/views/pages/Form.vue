<template>
    <ion-page>
        <AppBar>Pate Title</AppBar>
        <ion-content>
            <template v-if="form">
                <ion-segment>
                    <ion-segment-button v-for="(tab,index) in form" :key="index" :value="tab.tab" :content-id="'tab_' + index">
                        <ion-label>{{ tab.tab }}</ion-label>
                    </ion-segment-button>

                </ion-segment>
                <ion-segment-view>
                    <ion-segment-content v-for="(tab, tab_index) in form" :key="tab_index" :id="'tab_'+ tab_index">
                            <ion-card v-for="(section, s_index) in tab.children" :key="'section_' + s_index">
                                <ion-card-title v-if="section.section">{{ section.section }}</ion-card-title>
                                    
                                <ion-card-content>
                                    <ion-grid>
    <ion-row>
      <ion-col v-for="(col, col_index) in section.children" :key="'col_' + s_index + '_' + col_index">
        <div v-for="(f,f_index) in col.children" :key="f_index">
            {{ f.label }} {{  f.fieldtype }}
        </div>
      </ion-col>
      
    </ion-row>
  </ion-grid>

                                     
                                </ion-card-content>
                            </ion-card>
                    </ion-segment-content>
                </ion-segment-view>

            </template>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { useDoc } from "@/hooks/useDoc.js"
const { form, meta } = useDoc()

</script>