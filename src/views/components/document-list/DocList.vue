<template>
    <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <slot name="searchBar">
        <ComSearchBar v-if="options.showSearchBar" @onSearch="onSearch"
            :showBarcodeScanner="options.showBarcodeScanner"  ref="txtSearchRef"/>
    </slot>

    <Loading v-if="loading" />
    <template v-else>
        
        <slot name="filter">
            <ion-grid class="filter-grid" >
                <ion-row>
                    <ion-col :size="12" :size-md="10" >
                        <ComFilter  :filterOptions="options.filterOptions" @onFilter="onFilter"/>
                    </ion-col>
                    <ion-col :size="2" v-if="data.length>0" class="ion-hide-sm-down">
                        <div style="display: flex; justify-content: right;">
                            <ion-chip  v-if="hideTopShowingRecord">
                               {{ t("Showing Record") }} {{ data.length  }} {{ t("of") }} {{ totalRecord }}
                            </ion-chip>
                            <ion-button @click="onReloadData" fill="clear" shape="round"  v-tooltip.left="`${t('Refresh Data')}`">
                                <ion-icon :icon="refreshOutline" slot="icon-only"/>
                            </ion-button>
                            
                        </div>
                    </ion-col>
                    
                </ion-row>
            </ion-grid>
            
        </slot>

        <slot v-if="data && data.length > 0" :item="data">
            <template  v-if="plateform=='desktop'">
            <DataTable :value="data" 
                class="ion-padding-start ion-padding-end"
                tableStyle="min-width: 50rem" selectionMode="single"
                v-model:selection="selectedRow" 
                showGridlines 
                stripedRows 
                @sort="onSort" 
                :lazy="true"
                @row-dblclick="onRowDblClick" 
                :sortField="options.presort" 
                :sortOrder="options.sortOrder || 1"
            >
                 <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column v-for="col of options.columns" :key="col.fieldname" :field="col.fieldname"
                    :header="t(col.header)" :headerClass="col.align || getAligment(col.fieldtype)"
                    :bodyClass="col.align || getAligment(col.fieldtype)" sortable>
                    
                    <template #body="slotProps">
                        <slot :name="col.fieldname" :item="slotProps.data" :index="col.fieldname + '_' + index">
                            <!-- date column -->
                            <template v-if="col.fieldtype == 'Date'">
                                <template v-if="slotProps.data[col.fieldname]">
                                         {{ dayjs(slotProps.data[col.fieldname]).format("DD-MM-YYYY") }}
                                </template>
                                
                            </template>
                            <template v-else-if="col.fieldtype == 'Datetime'">
                                <span v-tooltip="`${dayjs(slotProps.data[col.fieldname])}`">
                                    {{ dayjs(slotProps.data[col.fieldname]).fromNow() }}
                                </span>
                            </template>
                            <template v-else-if="col.fieldtype == 'Currency'">
                                <ComCurrency :value="slotProps.data[col.fieldname]" />
                            </template>
                            <template v-else-if="col.url ">
                                
                                <router-link 
                                    v-if="slotProps.data[col.fieldname]"
                                    :to="`${col.url}/${slotProps.data[col.id_field] || slotProps.data[col.fieldname]}`">
                                    {{ slotProps.data[col.fieldname] }}
                                </router-link>
                                <ion-label v-else>{{ slotProps.data[col.fieldname] }}</ion-label>
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
       </template>
       <ComDocCard v-else :data="d" v-for="(d,index ) in data" :key="index" :fields="options.columns" 
       :titleFields="options.title_fields ||  meta.title_field" :subTitleFields="options.subTitleFields || meta.search_fields"/>

        </slot>
        <div v-else>
            <slot name="empty">
                
                 <ComNoRecord :title="t('No Record Found')" :message="emptyRecordMessage" :actions="options.noRecordActions"/>
            </slot>
        </div>
        <div style="padding-bottom: 50px;" v-if="!options.disableLoadMore">
            <ion-infinite-scroll @ionInfinite="onLoadMore" threshold="0">
                <ion-infinite-scroll-content :loading-text="t('Loading more...')"></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </div>
    </template>
<ion-chip v-if="data.length>0"  style="position: fixed; background: #e4eaf5; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 1000;">
  {{ t("Showing Record") }} {{ data.length }} {{ t("of") }} {{ totalRecord }}
</ion-chip>
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';

import {  useAttrs, watch  } from "vue"

import { useDocList } from '@/hooks/useDocList';
import ComSearchBar from '../ComSearchBar.vue';
import ComDocCard from '@/views/components/document-list/ComDocCard.vue';
import ComFilter from '@/views/components/document-list/ComFilter.vue';
import ComNoRecord from '@/views/components/document-list/ComNoRecord.vue';
import { refreshOutline } from 'ionicons/icons';
const plateform= app.utils.getPlateform();
 
const attrs = useAttrs();
const t = window.t;

const emit = defineEmits()
const props = defineProps({
    docType: String,
    options: {
        type: Object,
        default: {
            showSearchBar: true,
            showBarcodeScanner: false,
            fields: ["name"]
        },
        noRecordActions:[],
        hideTopShowingRecord:{
            type:Boolean,
            default:false
        }
    },
    contentRef:Object


})

 
const emptyRecordMessage = t("empty_record_message", {doctype: props.docType})

const { data, onRefresh, onLoadMore, onSearch, loading, getAligment,
    onSort, options,onFilter,totalRecord,meta,txtSearchRef
} = useDocList(props)

const selectedRow = defineModel("selectedRow")

watch(() => props.options, async (newVal, oldVal) => {
    options.value = props.options
    await onRefresh()

}, { deep: true })


const onRefreshData = async (event) => {
  await onRefresh(event);
  if (attrs.onOnRefresh) {
    emit("onRefresh", event);
  } else {
    event.target.complete();
  }
};

const onReloadData = async () => {
    const l = await app.showLoading();
    await onRefresh();
    await l.dismiss();

};



function onRowDblClick(event) {
    if (event.data) {
        emit("onRowDblClick", event.data);
    }
 
}


 

defineExpose({
   onRefresh,
   onReloadData
})

 

</script>
 