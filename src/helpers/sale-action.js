
export async function checkSaleDoc(name){
   const loading = await app.showLoading()

   const res = await app.getDocList("Sale",{fields:["docstatus"],filters:[["name","=",name]]})
   if(res.data == 0){
    await loading.dismiss()
    return 1;//sale not found
   }
   
   if(res.data[0].docstatus ==1){
    await loading.dismiss()
    return 2//coupon orde close
   }
   await loading.dismiss()
   return 0
}

export async function onPrintBill(name,format=null) {
 
    const result = await app.postApi("epos_restaurant_2023.api.printing.get_print_bill_pdf", {
        pdf: 0,
        station: app.setting.station_name,
        name: name,
        reprint: 0,
        template: format.pos_receipt_template
    })

    if (result.data) {
        for (let i = 0; i < format.print_receipt_copies; i++) {
            app.printService.submit({
                'type': "Cashier Printer",//printer name
                'url': 'file.pdf',
                'file_content': result.data
            });
        }


    }

}


export async function onEditBill(data) {
    const auth = await app.utils.hasPermission("edit_closed_receipt","edit_closed_receipt_required_password")
        if(!auth)  return;

    // check if require note
    const note = await app.utils.getOperationNote("Edit Sale", "edit_closed_receipt_required_note");
    
    if(!note && (typeof note) == "boolean") return

    auth.note = note;
    const loading = await app.showLoading()
    const res = await app.postApi("epos_restaurant_2023.api.api.edit_sale_coupon",{
        name:data.docname,
        auth:JSON.stringify(auth)

    })

    if(res.data){
        if(data.sale_type == "Sale Coupon")
        app.ionRouter.navigate("/sale-coupon/" + data.docname,"forward","replace")
    }
    
    await loading.dismiss()
}