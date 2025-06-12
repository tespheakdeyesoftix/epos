import {ref} from "vue"
import ComAddCouponCode from "@/modules/ecoupon/sale-coupon/components/ComAddCouponCode.vue"
const saleDoc = ref()
export function useSaleCoupon(){
    function initSaleDoc(){
        saleDoc.value = {
            business_branch:"ESTC HOTEL",
            customer:"C2023-0001",
            stock_location:"Main Warehouse",
            outlet:"Main Outlet",
            sale_products:[

            ]
        }
    }

    async function onSelectProduct(p){
        // open modal
        const result = await app.openModal({
           
            component:ComAddCouponCode,
            componentProps:{
                data:p,
                

            },
            
        })

       if(result){
           saleDoc.value.sale_products = [...saleDoc.value.sale_products , ...result]
       }
        // wait user confirm then add producty to sale product 

    }

    initSaleDoc()
    
    return {
        saleDoc,
        onSelectProduct
    }
}