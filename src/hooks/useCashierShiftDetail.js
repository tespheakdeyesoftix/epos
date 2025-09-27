import { ref } from "vue"


import ComCashierShiftSummary from "@/views/shift/components/ComCashierShiftSummary.vue"
import ComReceiptList from "@/views/shift/components/ComReceiptList.vue"
import ComServerContent from "@/views/components/public/ComServerContent.vue"

export function useCashierShiftDetail() {
    
const tabs = ref([
    { label: "Shift Information", is_loaded: true, component: ComServerContent,print_template:"Coupon Shift Summary",
        props:{
      doctype:"Cashier Shift",
      docname: app.route.params.name,
      template: "Cashier Shift Summary - UI",
     
    }
     },
    { label: "Shift Informationxx", is_loaded: true, component: ComCashierShiftSummary,print_template:"Coupon Shift Summary",
       
     },

    { label: "Receipt List", is_loaded: false, component:ComReceiptList , print_template:"Coupon Shift Receipt List"},
    { label: "Sale Product Detail", is_loaded: false, component:ComServerContent, print_template:"Cashier Shift Sale Product Summary - Print", 
    props:{
      doctype:"Cashier Shift",
      docname: app.route.params.name,
      template: "Cashier Shift Sale Product Summary - UI",
     
    } },
 
])
 

    function onRefresh(){

    }
    return {
        tabs,
        
    }
}