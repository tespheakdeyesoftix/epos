export async function checkSaleDoc(name){
   
   const res = await app.getDocList("Sale",{fields:["docstatus"],filters:[["name","=",name]]})
   if(res.data == 0){
    return 1;//sale not found
   }
   
   if(res.data[0].docstatus ==1){
    return 2//coupon orde close
   }
   return 0
}