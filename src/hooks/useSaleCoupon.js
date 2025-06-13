import { computed, ref } from "vue"
import ComAddCouponCode from "@/modules/ecoupon/sale-coupon/components/ComAddCouponCode.vue"

const saleDoc = ref()

initSaleDoc()

const groupSaleProducts = computed(()=>{
    return  Object.groupBy(saleDoc.value.sale_products, ({ product_code }) => product_code);
})

const grandTotal = computed(()=>{
    return saleDoc.value.sale_products.reduce((sum, item) => sum + item.total_amount, 0);
})

const grandTotalSecondCurrency = computed(()=>{
    return grandTotal.value * 4000;
})



function initSaleDoc() {
 
    saleDoc.value = {
        business_branch: app.setting.property.property_name,
        customer: app.setting.pos_profile.default_customer,
        stock_location: app.setting.pos_profile.stock_location,
        outlet: app.setting.pos_profile.outlet,
        
        sale_products: [

        ]
    }
}



async function onSelectProduct(p) {
    // open modal
    const result = await app.openModal({

        component: ComAddCouponCode,
        componentProps: {
            data: p,


        },

    })

    if (result) {
        saleDoc.value.sale_products = [...saleDoc.value.sale_products, ...result]
    }
    // wait user confirm then add producty to sale product 

}

function onPayment(){
    alert("payment")
} 

export function useSaleCoupon() {



    return {
        saleDoc,
        groupSaleProducts,
        grandTotal,
        grandTotalSecondCurrency,
        onPayment,
        onSelectProduct
    }
}