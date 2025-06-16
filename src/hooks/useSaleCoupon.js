import { computed, ref } from "vue"
import ComAddCouponCode from "@/modules/ecoupon/sale-coupon/components/ComAddCouponCode.vue"
import ComPayment from "@/modules/ecoupon/sale-coupon/components/ComPayment.vue"
import dayjs from "dayjs"
import { showLoading } from "@/helpers/utils"
import { modalController } from "@ionic/vue"
const saleDoc = ref({
    sale_products:[],
    payment:[]
})
const customer = ref(null)
const paymentInputAmount = ref("")
const selectedPrintFormat = ref()
 

const grandTotal = computed(()=>{
    return saleDoc.value.sale_products.reduce((sum, item) => sum + item.total_amount, 0);
})

const totalQuantity = computed(()=>{
    return saleDoc.value.sale_products.reduce((sum, item) => sum + item.quantity, 0);
})

const totalPaymentAmount = computed(()=>{
    return saleDoc.value.payment.reduce((sum, item) => sum + item.amount, 0);
})
const paymentBalance = computed(()=>{
    let balance =  grandTotal.value - totalPaymentAmount.value
    if(balance<0){
        balance = 0
    }
    return balance
})


const grandTotalSecondCurrency = computed(()=>{
    return grandTotal.value * app.setting.exchange_rate;
})

const changeAmount = computed(()=>{
    return totalPaymentAmount.value  - grandTotal.value
})





function initSaleDoc() {
 
    saleDoc.value = {
        business_branch: app.setting.property?.property_name,
        customer: app.setting.pos_profile?.default_customer,
        stock_location: app.setting.pos_profile?.stock_location,
        outlet: app.setting.pos_profile?.outlet,
        pos_profile: app.setting.pos_profile?.name,
        pos_station_name:app.setting.station_name,
        working_day:app.setting.working_day?.name,
        cashier_shift:app.setting.cashier_shift?.name,
        
        sale_products: [],
        payment:[]
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
        cssClass:"scan-coupon-code-modal"

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
            if(sp.coupons){
sp.coupons = JSON.stringify(sp.coupons)
            }
            
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
    const res = await saveSaleDoc(saveData);
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
        // print bill
        selectedPrintFormat.value = app.setting.print_formats.find(x=>x.name ==app.setting.pos_profile.default_pos_receipt)
        printBill(res.data.name)
    }


    await loading.dismiss()

}

async function onCloseSale(isPrint=true){
    if(grandTotal.value>0 && saleDoc.value.payment.length == 0){
        await app.showWarning("Please enter all payment amount")
        return 
    }

    const confirm = await app.onConfirm("Payment","Are you sure to process payment and close order?")
    if(!confirm) return;
    const loading = await showLoading();
    const saveData = getSaveData();
    saveData.docstatus = 1 
    saveData.closed_by = app.currentUser.full_name
    saveData.closed_date = dayjs().format("YYYY-MM-DD HH:mm:ss")

    const res = await saveSaleDoc(saveData);

    if(res.data){

        initSaleDoc()
        if(isPrint){
            printBill(res.data.name)
        }
        await app.showSuccess("Payment successfully")
        
        
    }

    modalController.dismiss("", 'confirm')
    await loading.dismiss()

}

async function printBill(doc_name){
     
   
   const result = await app.postApi("epos_restaurant_2023.api.printing.get_print_bill_pdf", {
      pdf: 0,
      station:app.setting.station_name,
      name: doc_name,
      reprint:0,
     template:selectedPrintFormat.value.pos_receipt_template
   })

   if (result.data) {
       for (let i = 0; i < selectedPrintFormat.value.print_receipt_copies; i++) {
         app.printService.submit({
            'type': "Cashier Printer",//printer name
            'url': 'file.pdf',
            'file_content': result.data
         });
        }


   }

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
        cssClass:"scan-coupon-code-modal"

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

async function onAddPayment(payment_type){
     let paymentAmount = Number(paymentInputAmount.value) 
     if(!paymentInputAmount.value){
        paymentAmount = paymentBalance.value;
     }
    if(paymentAmount==0){
        await app.showWarning("Please enter payment amount")
        return
    }
    
    saleDoc.value.payment.push(
        {
            payment_type: payment_type.payment_type,
            input_amount: paymentAmount,
            amount: paymentAmount / payment_type.exchange_rate,
            currency:payment_type.currency,
            exchange_rate:payment_type.exchange_rate
        }
    )
    paymentInputAmount.value = "";

}







export function useSaleCoupon() {



    return {
        saleDoc,
        
        grandTotal,
        grandTotalSecondCurrency,
        customer,
        totalQuantity,
        paymentInputAmount,
        paymentBalance,
        totalPaymentAmount,
        changeAmount,
        selectedPrintFormat,
        onPayment,
        onSelectProduct,
        onSaveAsDraft,
        initSaleDoc,
        onQuickPay,
        getSaleDoc,
        onEditSaleProductCoupon,
        onDeleteSaleProduct,
        onAddPayment,
        onCloseSale
    }
}