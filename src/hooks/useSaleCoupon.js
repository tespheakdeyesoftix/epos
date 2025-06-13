import { computed, ref } from "vue"
import ComAddCouponCode from "@/modules/ecoupon/sale-coupon/components/ComAddCouponCode.vue"
import dayjs from "dayjs"
import { showLoading } from "@/helpers/utils"

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

function getSaveData(){
const saveData = JSON.parse(JSON.stringify(saleDoc.value));
    saveData.sale_products.forEach(sp => {
            sp.creation = dayjs(sp.creation).format("YYYY-MM-DD HH:mm:ss")
    });
    return saveData;
    
}

async function onSaveAsDraft(){
    
    if (saleDoc.value.sale_products.length==0){
        await   app.showWarning("There is no data to save.")
        return;
    }
    const l = await app.showLoading();
    const saveData = getSaveData();
    saveData.docstatus = 0
    const res = saveSaleDoc(saveData);
    if(res.data){
        await app.showSuccess("Save sale to draft successfully.")
        initSaleDoc();

    }
    await l.dismiss();

} 


async function onQuickPay(payment_type){
    if(saleDoc.value.sale_products.length == 0){
        await app.showWarning("There's no data.")
        return 
    }
    const loading = await showLoading();
    const saveData = getSaveData();
    saveData.docstatus = 1 
    saveData.closed_by = app.currentUser.full_name
    saveData.closed_date = dayjs().format("YYYY-MM-DD HH:mm:ss")
    
    // add payment type
    saveData.payment = [
        {payment_type:payment_type.payment_type,
            input_amount : grandTotal.value * payment_type.exchange_rate,
            amount : grandTotal.value * payment_type.exchange_rate
        }
    ]

    const res = await saveSaleDoc(saveData);

    if(res.data){

        initSaleDoc()
        await app.showSuccess("Quick payment successfully")
        // TODO: Print Bill
        
    }


    await loading.dismiss()

}

async function saveSaleDoc(saveData){
let res = null
    if(saveData.name){
        res = await app.updateDoc("Sale", saveData);
    }else {
        res = await app.createDoc("Sale", saveData);
    }
    return res
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
        initSaleDoc,
        onQuickPay
    }
}