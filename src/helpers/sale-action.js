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