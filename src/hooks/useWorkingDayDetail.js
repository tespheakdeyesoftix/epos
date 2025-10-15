import {ref} from 'vue'
import ComWorkingDaySummary from "@/views/working-day/components/ComWorkingDaySummary.vue"
import ComReceiptList from "@/views/shift/components/ComReceiptList.vue"
import ComServerContent from "@/views/components/public/ComServerContent.vue"


export function useWorkingDayDetail() {
const name = ref(app.route.params.name)
const tabs = ref([
    { label: "Working Informations", is_loaded: true, component: ComServerContent,print_template:"Coupon Working Day Summary",
         props:{
      doctype:"Working Day",
      docname: name.value,
      template: "Working Day Summary-UI",
    }
     },

    { label: "Working Information", is_loaded: true, component: ComWorkingDaySummary,print_template:"Coupon Working Day Summary" },
    { label: "Receipt List", is_loaded: false, component:ComReceiptList , print_template:"Coupon Working Day Receipt List"},
    { label: "Sale Product Detail", is_loaded: false, component:ComServerContent, print_template:"Working Day Sale Product Summary - Print", props:{
      doctype:"Working Day",
      docname: name.value,
      template: "Working Day Sale Product Summary - UI",
     
    } },
 
])
    function onRefresh(){
    }
    return {
        tabs,     
    }

}