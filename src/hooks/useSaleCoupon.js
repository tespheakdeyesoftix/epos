import { computed, ref } from "vue"
import ComAddCouponCode from "@/modules/ecoupon/sale-coupon/components/ComAddCouponCode.vue"
import ComPayment from "@/modules/ecoupon/sale-coupon/components/ComPayment.vue"
import ComDiscountPercent from "@/modules/ecoupon/sale-coupon/components/ComDiscountPercent.vue"
import ComDiscountAmount from "../modules/ecoupon/sale-coupon/components/ComDiscountAmount.vue"
import dayjs from "dayjs"
import { modalController } from "@ionic/vue"
const saleDoc = ref({
    sale_products: [],
    payment: []
})
const customer = ref(null)
const paymentInputAmount = ref("")
const selectedPrintFormat = ref()
const totalPendingOrder = ref(5)
const couponCode = ref("")
const topUpCouponInfo = ref()
const topUpSaleProduct = ref({product_code:""})
const saleType = ref("Sale Coupon")
const pageRoute = ref("/sale-coupon")
const inputScanQRCode = ref(null)

 
initSaleDoc();

const subTotal = computed(() => {
    return saleDoc.value.sale_products.reduce((sum, item) => sum + (item?.sub_total ||0), 0);
})

const saleDiscoutableAmount = computed(() => {

    return saleDoc.value.sale_products.
        filter(x => x.allow_discount == 1 && (x.discount_amount || 0) == 0).
        reduce((sum, item) => sum + (item.sub_total ||0), 0) ?? 0;
})

const totalSaleDiscountAmount = computed(() => {
    if (saleDoc.value.discount_type == "Percent") {
        return saleDiscoutableAmount.value * ((saleDoc.value.discount ?? 0) / 100)

    } else {
        return saleDoc.value.sale_discount ?? 0
    }

})


const totalSaleProductDiscount = computed(() => {
    return saleDoc.value.sale_products.reduce((sum, item) => sum + (item?.discount_amount || 0), 0);
})

const grandTotal = computed(() => {
    const total =  (subTotal.value ?? 0) - (totalSaleProductDiscount.value ?? 0) - (totalSaleDiscountAmount.value ?? 0)
    return total || 0
})

const totalQuantity = computed(() => {
    const total =  saleDoc.value.sale_products.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return total || 0
})

const totalPaymentAmount = computed(() => {
    return saleDoc.value.payment.reduce((sum, item) => sum + (item.amount || 0), 0);
})
const paymentBalance = computed(() => {
    let balance =(grandTotal.value - totalPaymentAmount.value) || 0
    if (balance < 0) {
        balance = 0
    }
    return balance
})


const grandTotalSecondCurrency = computed(() => {
    const total =  grandTotal.value * (app.setting.exchange_rate || 1); 
    return total || 0
})

const changeAmount = computed(() => {
    return totalPaymentAmount.value - grandTotal.value
})


function initSaleDoc() {

    saleDoc.value = {
        posting_date:app.setting.working_day?.posting_date,
        business_branch: app.setting.property?.property_name,
        customer: app.setting.pos_profile?.default_customer,
        stock_location: app.setting.pos_profile?.stock_location,
        outlet: app.setting.pos_profile?.outlet,
        pos_profile: app.setting.pos_profile?.name,
        pos_station_name: app.setting.station_name,
        working_day: app.setting.working_day?.name,
        cashier_shift: app.setting.cashier_shift?.name,
        sale_status:"New",
        sale_products: [],
        payment: []
    }

   getTotalPendingOrder()
}

async function getSaleDoc() {
    const loading = await app.showLoading();
    const result = await app.getDoc("Sale", app.route.params.name);
    
    if (result.data) {

        result.data.sale_products.forEach(x => {
            x.coupons =  JSON.parse(x.coupons ?? "[]")
        })
        saleDoc.value = result.data;

        getCustomerData(saleDoc.value.customer);
    }

    await loading.dismiss();
}

async function getCustomerData(name){
    const res = await app.getDoc("Customer",name)
    if(res.data){
        customer.value = res.data
    }
}



async function onSelectProduct(p) {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    // open modal
    const result = await app.openModal({

        component: ComAddCouponCode,
        componentProps: {
            data: p,
        },
        cssClass: "scan-coupon-code-modal"

    })

    if (result) {
        //check if exist with product code and price
        const exists = saleDoc.value.sale_products.find(x => x.product_code == result.product_code && x.price == result.price && x.append_quantity == 1);
        if (exists) {

            exists.coupons = [...exists.coupons, ...result.coupons];
            exists.quantity = exists.coupons.length;
            updateSaleProduct(exists)

        } else {
            saleDoc.value.sale_products.push(result)
            updateSaleProduct(result)
        }


    }
    // wait user confirm then add producty to sale product 

}

async function onPayment() {
    if (saleDoc.value.sale_products.length == 0) {
        await app.showWarning("Please add product to your order")
        return;
    }
    const result = await app.openModal({
        component: ComPayment,
        cssClass: "payment-modal"
    })
  
}

function getSaveData() {
    const saveData = JSON.parse(JSON.stringify(saleDoc.value));
    saveData.pos_station_name = app.setting.station_name;
    if(!saveData.sale_type) saveData.sale_type = saleType.value;
        saveData.sale_products.forEach(sp => {
        delete sp.selling_price;
        sp.quantity = sp.quantity * (saleType.value=="Redeem"?-1:1)
        sp.coupon_value = sp.coupon_value * (saleType.value=="Redeem"?-1:1)
        sp.redeem_coupon_inform
        sp.creation = dayjs(sp.creation).format("YYYY-MM-DD HH:mm:ss")
        if (sp.coupons) {
            sp.coupons = JSON.stringify(sp.coupons)
        }

    });
    
    if(saleType.value == "Redeem"){
saveData.payment.forEach(p=>{
        
        p.input_amount = p.input_amount  * -1
    })
    }
    

    
    return saveData;

}

async function onSaveAsDraft() {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }

    if (saleDoc.value.sale_products.length == 0) {
        await app.showWarning("There is no data to save.")
        return;
    }
    const l = await app.showLoading();
    const saveData = getSaveData();
    saveData.docstatus = 0
    saveData.sale_status = "Hold Order"
    const res = await saveSaleDoc(saveData);
    if (res.data) {
        await app.showSuccess("Save sale to draft successfully.")
        onClearData()
        if(app.route.params.name){
            app.ionRouter.navigate(pageRoute.value,"forward","replace")
        }
    }
    await l.dismiss();

}

async function onQuickPay(payment_type) {
    if (saleDoc.value.sale_products.length == 0) {
        await app.showWarning("There's no data.")
        return
    }
    // if top up validate user select topup
    if(saleDoc.value.sale_type =="Top Up"){
        if(saleDoc.value.sale_products[0].product_code == ""){
            await app.showWarning("Please select top up amount")
            return
        }
    }
    const loading = await showLoading();
    // add payment type
    saleDoc.value.payment = [
        {
            payment_type: payment_type.payment_type,
            input_amount: grandTotal.value * payment_type.exchange_rate,
            amount: grandTotal.value * payment_type.exchange_rate
        }
    ]

    const saveData = getSaveData();
    saveData.docstatus = 1
    saveData.closed_by = app.currentUser.full_name
    saveData.closed_date = dayjs().format("YYYY-MM-DD HH:mm:ss")
    saveData.sale_status = "Closed";
     
    const res = await saveSaleDoc(saveData);

    if (res.data) {

        onClearData();
        await app.showSuccess("Quick payment successfully")
        // print bill
        selectedPrintFormat.value = app.setting.print_formats.find(x => x.name == app.setting.pos_profile.default_pos_receipt)
        printBill(res.data.name)
        app.ionRouter.navigate(pageRoute.value,"forward","replace")
    }


    await loading.dismiss()

}

async function onCloseSale(isPrint = true) {
    if (grandTotal.value > 0 && saleDoc.value.payment.length == 0) {
        await app.showWarning("Please enter all payment amount")
        return
    }

    const confirm = await app.onConfirm("Payment", "Are you sure to process payment and close order?")
    if (!confirm) return;
    const loading = await showLoading();
    const saveData = getSaveData();
    saveData.docstatus = 1
    saveData.closed_by = app.currentUser.full_name
    saveData.closed_date = dayjs().format("YYYY-MM-DD HH:mm:ss")
    saveData.sale_status = "Closed"

    const res = await saveSaleDoc(saveData);

    if (res.data) {

        onClearData()

        if (isPrint) {
            printBill(res.data.name)
        }
        await app.showSuccess("Payment successfully")
        
        app.ionRouter.navigate(pageRoute.value,"forward","replace")


    }

    modalController.dismiss("", 'confirm')
    await loading.dismiss()

}

async function printBill(doc_name) {


    const result = await app.postApi("epos_restaurant_2023.api.printing.get_print_bill_pdf", {
        pdf: 0,
        station: app.setting.station_name,
        name: doc_name,
        reprint: 0,
        template: selectedPrintFormat.value.pos_receipt_template
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

async function saveSaleDoc(saveData) {
    let res = null
    if (saveData.name) {
        res = await app.updateDoc("Sale",saveData.name, saveData);
    } else {
        res = await app.createDoc("Sale", saveData);
    }
    return res
}

async function onEditSaleProductCoupon(data) {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    const sp = JSON.parse(JSON.stringify(data))
    const result = await app.openModal({
        component: ComAddCouponCode,
        componentProps: {
            data: { ...sp, name: sp.product_code, product_name_en: sp.product_name },

        },
        cssClass: "scan-coupon-code-modal"

    })

    if (result) {
        data.coupons = result.coupons;
        data.quantity = result.coupons.length;
        updateSaleProduct(data)
    }

}

function updateSaleProduct(sp) {
    sp.sub_total = sp.quantity * sp.price;
    if (sp.discount_type == "Percent") {
        sp.discount_amount = sp.sub_total * (sp.discount || 0) / 100
    }
    sp.total_amount = sp.sub_total - (sp.discount_amount ?? 0)
    // more with discount and tax later

}


async function onDeleteSaleProduct(index) {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    const confirm = await app.onConfirm("Delete Sale Product", "Are you sure you want to delete this record");
    if (confirm) {
        saleDoc.value.sale_products.splice(index, 1);
    }

}

async function onAddPayment(payment_type) {
    let paymentAmount = Number(paymentInputAmount.value)
    if (!paymentInputAmount.value) {
        paymentAmount = paymentBalance.value;
    }
    if (paymentAmount == 0) {
        await app.showWarning("Please enter payment amount")
        return
    }

    saleDoc.value.payment.push(
        {
            payment_type: payment_type.payment_type,
            input_amount: paymentAmount,
            amount: paymentAmount / payment_type.exchange_rate,
            currency: payment_type.currency,
            exchange_rate: payment_type.exchange_rate
        }
    )
    paymentInputAmount.value = "";

}



async function onSaleDiscountPercent() {

    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }

    if (app.currentUser.pos_permission.discount_sale == 0) {
        await app.showWarning("You don't have permission to perform this action.")
        return;
    }

    const result = await app.openModal({
        component: ComDiscountPercent,
        componentProps: {
            checkRequireNoteKey: "discount_sale_required_note"
        },
        cssClass: "discount-modal"
    })

    if (result) {
        saleDoc.value.discount_type = "Percent";
        saleDoc.value.discount = result.discount * 100;
        saleDoc.value.discount_note = result.note
        app.showSuccess("Add discount successfully")
    }

}


async function onSaleDiscountAmount() {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }

    if (saleDiscoutableAmount.value == 0) {
        app.showWarning("There's no amount to discount. Please add product to your order first");
        return;
    }
    if (app.currentUser.pos_permission.discount_sale == 0) {
        await app.showWarning("You don't have permission to perform this action.")
        return;
    }

    const result = await app.openModal({
        component: ComDiscountAmount,
        componentProps: {
            checkRequireNoteKey: "discount_sale_required_note"
        },
        cssClass: "discount-amount-modal"
    })

    if (result) {
        saleDoc.value.discount_type = "Amount";
        saleDoc.value.discount = 0;
        saleDoc.value.sale_discount = result.discount,
            saleDoc.value.discount_note = result.note
        app.showSuccess("Add discount successfully")

    }
}


async function onProductDiscountPercent(sp) {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    // check user permission 
    if (!sp.allow_discount == 1) {
        app.showWarning("This product is not allow to discount")
        return
    }
    if (app.currentUser.pos_permission.discount_item == 0) {
        await app.showWarning("You don't have permission to perform this action.")
        return;
    }

    const result = await app.openModal({
        component: ComDiscountPercent,
        componentProps: {
            checkRequireNoteKey: "discount_item_required_note"
        },
        cssClass: "discount-modal"
    })

    if (result) {
        sp.discount_type = "Percent";
        sp.discount = result.discount * 100;
        sp.discount_note = result.note
        app.showSuccess("Add discount successfully")
        updateSaleProduct(sp);
    }

}


async function onProductDiscountAmount(sp) {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    if (!sp.allow_discount == 1) {
        app.showWarning("This product is not allow to discount")
        return
    }
    if (app.currentUser.pos_permission.discount_item == 0) {
        await app.showWarning("You don't have permission to perform this action.")
        return;
    }

    const result = await app.openModal({
        component: ComDiscountAmount,
        componentProps: {
            checkRequireNoteKey: "discount_item_required_note"
        },
        cssClass: "discount-amount-modal"
    })

    if (result) {
        sp.discount_type = "Amount";
        sp.discount = 0;
        sp.discount_amount = result.discount,
            sp.discount_note = result.note
        app.showSuccess("Add discount successfully")
        updateSaleProduct(sp);
    }
}


async function onRemoveProductDiscount(sp) {
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }

    const hasPermission = await app.utils.hasPermission("cancel_discount_item")
    if (!hasPermission) return;

    let note = false
    if (app.setting.pos_config.cancel_discount_item_required_note == 1) {
        note = await app.utils.onOpenKeyboard({
            title: t("Cancel Discount Note"),
            storageKey: "cancel_discount_item_required_note"
        });
    }

    if (note) {
        sp.discount_type = "Percent";
        sp.discount = 0;
        sp.discount_amount = 0,

            updateSaleProduct(sp);
    }
    app.showSuccess("Remove discount successfully")
}

async function onPrintRequestBill(format) {

    // validate
    if (saleDoc.value.sale_products.length == 0) {
        app.showWarning("Please add product to your order first");
        return;
    }
    // save sale order 
    const l = await app.showLoading();
    const saveData = getSaveData();
    saveData.docstatus = 0
    saveData.sale_status = "Bill Requested";
    const res = await saveSaleDoc(saveData);
    if (res.data) {
        await app.showSuccess("Save sale successfully.")
        selectedPrintFormat.value = format;
        printBill(res.data.name)
        if(app.route.params.name){
            res.data.sale_products.forEach((x)=>{
                x.coupons = JSON.parse(x.coupons)
            })
            saleDoc.value = res.data;
        }else {
            initSaleDoc();
        app.ionRouter.navigate(`${pageRoute.value}/${res.data.name}`, "push", "replace")
    
        }
        
    }
    await l.dismiss();
}

async function getTotalPendingOrder(){
    const res = await  app.getCount("Sale",{
        docstatus:0
    })
    if(res.data){
        totalPendingOrder.value = res.data
    }else {
totalPendingOrder.value = 0
    }
    
}

async function onChangeSaleProductPrice(sp){
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    if(sp.allow_change_price==0){
        app.showWarning("This product is not allow to change price")
        return
    }
    const hasPermission =await app.utils.hasPermission("change_item_price");
    if(!hasPermission) return false;


    const result = await app.utils.onInputNumber({
        checkRequireNoteKey:"change_item_price_required_note",
        storageKey:"change_item_price_note",
        label:app.t("Price"),
        title:app.t("Change Price")
    })


    if(result){
        sp.price = result.inputNumber
        sp.change_price_note = result.note
        updateSaleProduct(sp)
    }
}
async function onChangeSaleProductQuantity(sp){
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    const result = await app.utils.onOpenKeypad("Change Quantity")
    if(result && result> 0){
        sp.quantity = result;
        updateSaleProduct(sp)
    }   
}

async function onFreeProduct(sp){
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }

    const hasPermission = await app.utils.hasPermission("free_item");
    if (!hasPermission) return;

    let freeQuantity = sp.quantity;
    let freeNote = ""
    if(freeQuantity==1 || sp.coupons.length>0){
        if(app.setting.pos_config.free_item_required_note==1){
            const noteResult = await app.utils.onOpenKeyboard({
                title:app.t("Free Note"),
                storageKey:"free_note"
            })
            if((typeof noteResult) =="string"){
                freeNote = noteResult;
            }
        }
    }else {
        // free quantity
    }

   
        sp.is_free = 1
        sp.price = 0;
        sp.free_note = freeNote
        updateSaleProduct(sp)
   

}
async function onRemoveFreeProduct(sp){
    if(saleDoc.value.sale_status =="Bill Requested"){
        app.showWarning("This sale order is already print bill. Please cancel print bill first.")
        return
    }
    if(sp.coupons.length>0){
        sp.is_free = 0
        sp.price = sp.regular_price;
        updateSaleProduct(sp)
    }
    
}

export function onClearData(){
    setTimeout(() => {
    if(inputScanQRCode.value){
        inputScanQRCode.value.focus()
    }    
    }, 500);
    
    initSaleDoc()
    topUpCouponInfo.value = null
    
    if(saleType.value =="Top Up"){
       
        topUpSaleProduct.value = {"product_code":"",quantity:1,price:0}
        saleDoc.value.sale_products=[topUpSaleProduct.value]
    }
    
}
 



export function useSaleCoupon() {
 
  
    return {
        saleDoc,
        inputScanQRCode,
        grandTotal,
        grandTotalSecondCurrency,
        customer,
        totalQuantity,
        paymentInputAmount,
        paymentBalance,
        totalPaymentAmount,
        changeAmount,
        selectedPrintFormat,
        subTotal,
        totalSaleProductDiscount,
        saleDiscoutableAmount,
        totalSaleDiscountAmount,
        totalPendingOrder,
        couponCode,
        topUpCouponInfo,
        saleType,
        topUpSaleProduct,
        pageRoute,
        onPayment,
        onSelectProduct,
        onSaveAsDraft,
        initSaleDoc,
        onQuickPay,
        getSaleDoc,
        onEditSaleProductCoupon,
        onDeleteSaleProduct,
        onAddPayment,
        onCloseSale,
        onProductDiscountPercent,
        onProductDiscountAmount,
        onSaleDiscountPercent,
        onSaleDiscountAmount,
        onRemoveProductDiscount,
        onPrintRequestBill,
        getTotalPendingOrder,
        onChangeSaleProductPrice,
        onChangeSaleProductQuantity,
        onFreeProduct,
        onRemoveFreeProduct,
        onClearData
    }
}