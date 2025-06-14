import { computed, ref } from "vue"
import ComAddCouponCode from "@/modules/ecoupon/sale-coupon/components/ComAddCouponCode.vue"
import ComPayment from "@/modules/ecoupon/sale-coupon/components/ComPayment.vue"
import dayjs from "dayjs"
import { showLoading } from "@/helpers/utils"

const saleDoc = ref({
    sale_products:[]
})
const customer = ref(null)

 
const groupSaleProducts = computed(()=>{
    return  Object.groupBy(saleDoc.value.sale_products, ({ product_code }) => product_code);
})

const grandTotal = computed(()=>{
    return saleDoc.value.sale_products.reduce((sum, item) => sum + item.total_amount, 0);
})
const totalQuantity = computed(()=>{
    return saleDoc.value.sale_products.reduce((sum, item) => sum + item.quantity, 0);
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

async function getSaleDoc(){
    const result = await app.getDoc("Sale",app.route.params.name);
    if(result.data){
        saleDoc.value = result.data;
    }else {
        //if not found 
        alert("go to new route")
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
        //check if exist with product code and price
        const exists = saleDoc.value.sale_products.find(x=>x.product_code == result.product_code && x.price == result.price);
        if(exists){
            
            exists.coupons = [...exists.coupons,...result.coupons];
            exists.quantity = exists.coupons.length;
           
            updateSaleProduct(exists)

        }else {
            saleDoc.value.sale_products.push(result)
            updateSaleProduct(result)
        }
        
        
    }
    // wait user confirm then add producty to sale product 

}

async function onPayment(){
    if (saleDoc.value.sale_products.length==0){
        await app.showWarning("Please add product to your order")
        return;
    }
    const result = await app.openModal({
        component:ComPayment,
        cssClass:"payment-modal"   
    })
    if(result){
        // process payment
    }
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

async function onEditSaleProductCoupon(data){
    const sp = JSON.parse(JSON.stringify(data))
   const result = await app.openModal({
        component: ComAddCouponCode,
        componentProps: {
            data: {...sp,name:sp.product_code,product_name_en:sp.product_name},

        },

    })

    if(result){
        data.coupons = result.coupons;
        data.quantity = result.coupons.length;
        updateSaleProduct(data)
    }

}

function updateSaleProduct(sp){
    sp.sub_total = sp.quantity * sp.price;
    sp.total_amount = sp.quantity * sp.price;
    // more with discount and tax later
}


async function onDeleteSaleProduct(index){
    const confirm = await app.onConfirm("Delete Sale Product", "Are you sure you want to delete this record");
    if(confirm){
        saleDoc.value.sale_products.splice(index,1);
    }

}


export function useSaleCoupon() {



    return {
        saleDoc,
        groupSaleProducts,
        grandTotal,
        grandTotalSecondCurrency,
        customer,
        totalQuantity,
        onPayment,
        onSelectProduct,
        onSaveAsDraft,
        initSaleDoc,
        onQuickPay,
        getSaleDoc,
        onEditSaleProductCoupon,
        onDeleteSaleProduct
    }
}