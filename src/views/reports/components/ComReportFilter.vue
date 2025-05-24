<template>

  <div class="overflow-x-auto">
    <div v-if="options" class="flex w-max">
      <template v-for="(d, index) in options" :key="index">
        <ComSelect v-if="d.ft == 'Link'" :docType="(typeof d.options) == 'string' ? d.options : ''"
          :options="(typeof d.options) != 'string' ? d.options : ''" v-model:value="filter[d.f]" :multiple="d.multi == 1"
          @onSelected="onFilterReport" :clear="d.clear == 1" @onClear="onClearSelect(d)"
          :filters="getSelectDefaultFilter(d)" :modalType="d.modalType" :label="d.label" />
        <ComSelectDateFilter v-else-if="d.ft == 'Date'" @onSelect="onSelectDate($event, d)" :defaultTimespan="d.default"
          :clear="d.clear == 1" :showOperator="d.show_op == 1" />
      </template>
    </div>
  </div>


</template>
<script setup>
import { onMounted, ref } from 'vue';
const emit = defineEmits()
const props = defineProps({
  filterOptions: Object
})
const t = window.t;
const filter = ref({})
const date_range = ref()
const options = ref()

function onSelectDate($event, option) {

  if ($event) {
    if (option.f == "date_range") {
      if (option.date_range_field) {
        filter.value[option.date_range_field[0]] = $event.start_date;
        filter.value[option.date_range_field[1]] = $event.end_date;
      } else {
        filter.value.start_date = $event.start_date;
        filter.value.end_date = $event.end_date;
      }

    } else {
      filter.value[option.f] = $event.start_date;
    }

  } else {
    if (option.date_range_field) {
      filter.value[option.date_range_field[0]] = null
      filter.value[option.date_range_field[1]] = null
    }
    filter.value.start_date = null;
    filter.value.end_date = null;
    filter.value[option.f] = null;
  }
  emit("onFilter", filter.value)
}

function onClearSelect(f) {
  // f.f , f is fieldname we use this to make short in browser
  delete filter.value[f.f]
  emit("onFilter", filter.value)
}

function onFilterReport() {
  emit("onFilter", filter.value)
}

function getReportDefaultFilter() {
  const defaultFilter = {}
  options.value.filter(x => x.default).forEach(f => {
    if (f.ft == 'Date') {
      const dateRange = app.getTimespanRange(f.default);

      if (f.f == "date_range") {
        if (f.date_range_field) {
          defaultFilter[f.date_range_field[0]] = dateRange.start_date
          defaultFilter[f.date_range_field[1]] = dateRange.end_date
        } else {
          defaultFilter.start_date = dateRange.start_date
          defaultFilter.end_date = dateRange.end_date
        }
      } else {
        defaultFilter[f.f] = dateRange.start_date
      }
    } else {
      defaultFilter[f.f] = f.default
    }
  });
  filter.value = defaultFilter;
  return defaultFilter;
}


function getSelectDefaultFilter(f) {
  let filter = []
  if (f.filter) {
    filter = f.filter
  }

  if (filter) {
    filter.forEach(x => {
      if (["business_branch", "property"].includes(x[0])) {
        x[2] = app.property_name
      }
    })
  }


  return filter;
}

onMounted(() => {
  if ((typeof props.filterOptions) == "string") {
    options.value = JSON.parse(props.filterOptions)
  } else {
    options.value = props.filterOptions;
  }

  // raise event preview report
  emit("onFilter", getReportDefaultFilter());
})

</script>