<template>
    <ion-refresher slot="fixed" @ionRefresh="onRefreshData($event)">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <slot name="searchBar">
        <ComSearchBar v-if="showSearchBar" @onSearch="onSearch" />
    </slot>

    <Loading v-if="loading" />
    <template v-else>


        <slot v-if="data && data.length > 0" :item="data">
        
            <DataTable :value="data" 
            tableStyle="min-width: 50rem"
            selectionMode="single" 
            v-model:selection="selectedRow"
            showGridlines stripedRows 
            @sort="onSort"
            :lazy="true"
            @row-dblclick="onRowDblClick"
            :sortField="options.presort"
            :sortOrder="options.sortOrder || 1"
            >
                <Column v-for="col of options.columns" 
                :key="col.fieldname" :field="col.fieldname" :header="t(col.header)"
                :headerClass="col.align || getAligment(col.fieldtype)" 
                :bodyClass="col.align || getAligment(col.fieldtype)" 
                 sortable
                >
                    <template #body="slotProps">
                        <slot :name="col.fieldname" :item="slotProps.data" :index="col.field + '_' + index">
                            <!-- date column -->
                            <template v-if="col.fieldtype == 'Date'">
                                {{ dayjs(slotProps.data[col.fieldname]).format("DD-MM-YYYY") }}
                            
                            </template>
                            <template v-else-if="col.fieldtype == 'Datetime'">
                                <span v-tooltip="`${dayjs(slotProps.data[col.fieldname])}`">
                                    
                                    {{ dayjs(slotProps.data[col.fieldname]).fromNow() }}
                                    
                               
                                </span>
                                
                            </template>
                            <template v-else-if="col.fieldtype == 'Currency'">
                                <ComCurrency :value="slotProps.data[col.fieldname]"/>
                            </template>
                            <template v-else-if="col.url">
                                <router-link :to="`${col.url}/${slotProps.data[col.id_field] || slotProps.data[col.fieldname]}`">
                                    {{ slotProps.data[col.fieldname] }} 
                                </router-link>
                            </template>
                            <template v-else>
                                <span v-if="col.fieldname == 'owner' || col.fieldname == 'modified_by'">
                                    {{ slotProps.data[col.fieldname].split("@")[0] }}
                                
                                </span>
                                <span v-else>
                                    {{ slotProps.data[col.fieldname] }}
                                
                                </span>
                                 <!-- {{ getAligment(col.fieldtype) }} -->
                            </template>

                        </slot>
                    </template>

                </Column>
            </DataTable>



        </slot>
        <div v-else>
            <slot name="empty">
                {{ t("No Data") }}
            </slot>

        </div>
        <div style="padding-bottom: 50px;" v-if="!options.disableLoadMore">
            <ion-infinite-scroll @ionInfinite="onLoadMore" threshold="0">
                <ion-infinite-scroll-content :loading-text="t('Loading more...')"></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </div>
    </template>

</template>
<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';
 
import relativeTime from "dayjs/plugin/relativeTime"; 
import { useAttrs, watch } from "vue"

import { useDocList } from '@/hooks/useDocList';
import ComSearchBar from '../ComSearchBar.vue';
 
const attrs = useAttrs();
const  t = window.t;


const emit = defineEmits()
const props = defineProps({
    docType: String,
    options: {
        type: Object,
        default: {
            showSearchBar: {
                type: Boolean,
                default: true
            },
            fields: {
                type: Object,
                default: ["name"]
            },
        }
    }


})


const { data, onRefresh, onLoadMore, onSearch, loading,getAligment,
    onSort,options
 } = useDocList(props)

 const selectedRow = defineModel("selectedRow")

 watch(() => props.options, async (newVal, oldVal) => {
    options.value = props.options
     await onRefresh()
    
   },{ deep: true })


const onRefreshData = async (event: CustomEvent) => {
    await onRefresh(event)
    if (attrs.onOnRefresh) {
        emit("onRefresh", event)
    } else {
        event.target.complete();
    }



};


function onRowDblClick(event){
    if(event.data){
        emit("onRowDblClick", event.data);
    }

    

  }





</script>

 