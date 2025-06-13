import { computed, ref } from "vue"
import ComAddCouponCode from "@/modules/ecoupon/sale-coupon/components/ComAddCouponCode.vue"
import dayjs from "dayjs"

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
        customer: app.setting.pos_profile.phone_number,
        stock_location: app.setting.pos_profile.stock_location,
        outlet: app.setting.pos_profile.outlet,
        pos_profile: app.setting.pos_profile.name,
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
async function onSaveAsDraft(){
    
    if (saleDoc.value.sale_products.length==0){
        await   app.showWarning("There is no data to save.")
        return;
    }
    const l = await app.showLoading();
    const saveData = JSON.parse(JSON.stringify(saleDoc.value));
    saveData.sale_products.forEach(sp => {
            sp.creation = dayjs(sp.creation).format("YYYY-MM-DD HH:mm:ss")
    });
    saveData.docstatus = 0

    let res = null
    if(saveData.name){
        res = await app.updateDoc("Sale", saveData);
    }else {
        res = await app.createDoc("Sale", saveData);
    }
    if(res.data){
        await app.showSuccess("Save sale to draft successfully.")
        initSaleDoc();

    }
    await l.dismiss();

} 

export function useSaleCoupon() {



    return {
        saleDoc,
        groupSaleProducts,
        grandTotal,
        grandTotalSecondCurrency,
        onPayment,
        onSelectProduct,
        onSaveAsDraft,
        initSaleDoc
    }
}