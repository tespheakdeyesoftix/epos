import { ref, onMounted,nextTick } from "vue";
import { getDocList } from "@/services/api-service";
 
import { useApp } from "./useApp";

export function useDocList(props) {
  const { getMeta } = useApp();
  const loading = ref(true);
  let meta = {};
  const canLoadMore = ref(true);
  const pageSize = ref(20);
  const data = ref([]);
  const keyword = ref(''); // no explicit type
  const startIndex = ref(0);
  const loadingMoreData = ref(false);
  const defaultFilters = structuredClone(props.options.filters);
  let options = ref(props.options);
  const totalRecord = ref(0)
  const orderBy = ref({
    field: "modified",
    order: "asc",
  });

  if (options.value.orderBy) {
    orderBy.value = options.value.orderBy;
  }

  function getFields(){
    let f = options.value.fields;
    f=[...f,...(options.value.columns || []).map(x=>x.fieldname)]
    f = [...new Set(f)];
    return f
  }

  async function getData() {
    
    const response = await getDocList(props.docType, {
      fields: getFields(),
      filters: options.value.filters,
      orFilters: options.value?.orFilters || [],
      limit_start: startIndex.value,
      limit: options.value.limit || pageSize.value,
      orderBy: orderBy.value,
    });
    loading.value = false;
    loadingMoreData.value = false;
    getCount();
    if (response.data) {
      return response.data;
    }
    return [];
  }


  async function getCount() {
    const response = await getDocList(props.docType, {
      fields: ["count(name) as total"],
      filters: options.value.filters,
      orFilters: options.value?.orFilters || [],
    });
    if (response.data) {
      if(response.data.length>0){
        totalRecord.value = response.data[0]["total"]
      }
      
    }
    
  }


  const onLoadMore = async (event) => {
    loadingMoreData.value = true;
    if (!canLoadMore.value) return event.target.complete();

    startIndex.value += pageSize.value;
    loadingMoreData.value = true;
    const result = await getData();

    if (result.length < pageSize.value || !result) {
      canLoadMore.value = false;
    }
    data.value.push(...result);

    event.target.complete();
  };

  const onRefresh = async (event) => {
    canLoadMore.value = true;

    startIndex.value = 0;
    const result = await getData();

    data.value = result;
  };

  async function onSearch(str = "") {
    if (meta) {
      loading.value = true;
      canLoadMore.value = true;
      startIndex.value = 0;
      if (str) {
        let filter = [];
        const keywordEncode = encodeURIComponent(str);

        filter.push(["name", "like", `%${keywordEncode}%`]);
        // title field
        if (meta.title_field) {
          filter.push([meta.title_field, "like", `%${keywordEncode}%`]);
        }
        if (meta.search_fields) {
          meta.search_fields
            .split(",")
            .filter((x) => x !== "posting_date")
            .map((item) => item.trim())
            .forEach((f) => {
              filter.push([f, "like", `%${keywordEncode}%`]);
            });
        }

        options.value.orFilters = filter;
      } else {
        options.value.orFilters = [];
      }
      data.value = await getData();
      loading.value = false;
    }
  }

  function getAligment(fieldtype = "") {
    if (["Int", "Float", "Date"].includes(fieldtype)) {
      return "text-center";
    }

    if (["Currency"].includes(fieldtype)) {
      return "text-right";
    }

    return "text-left";
  }

  function onSort(event) {
    orderBy.value.field = event.sortField;
    orderBy.value.order = event.sortOrder == 1 ? "asc" : "desc";
    onRefresh();
  }

  async function onFilter(f) {

    canLoadMore.value = true;
    startIndex.value = 0;
    options.value.filters = structuredClone(defaultFilters) || [];
    if (f) {
      Object.keys(f).forEach((key) => {
        const fieldType = options.value.filterOptions.find(x=>x.fieldname == key).fieldtype;
        if(fieldType == "Date"){
           

          if(f[key].operator == "between"){
         
            options.value.filters.push([key, "between", [f[key].start_date,f[key].end_date]]);
          }else {
            options.value.filters.push([key, f[key].operator, f[key].start_date]);
          }
          
        }else {
          options.value.filters.push([key, "=", f[key]]);
        }
        
      });
    }

    const _loading = await app.showLoading();
    const result = await getData();
    data.value = result;
    await _loading.dismiss();
  }

  const checkScrollFillsScreen = async () => {
  await nextTick(); // wait for DOM update
  const content = props.contentRef.$el;
  if (content.scrollHeight <= content.clientHeight && canLoadMore.value) {
    
    await  onLoadMore({ target: { complete: () => {} } });
   
  }
};

  onMounted(async () => {
    loading.value = true;
    const result = await getData();
    data.value = result;
    
    meta = await getMeta(props.docType);
     if(props.contentRef){
      await checkScrollFillsScreen();
     }

  });

  return {
    loading,
    loadingMoreData,
    data,
    meta,
    orderBy,
    options,
    totalRecord,
    onSearch,
    getData,
    onLoadMore,
    onRefresh,
    getAligment,
    onSort,
    onFilter,
  };
}
