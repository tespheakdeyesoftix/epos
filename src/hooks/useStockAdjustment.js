

import {  ref } from "vue";


export function useStockAdjustment(props = null) {
  const doc = ref({
    new_cost:0,
    current_cost:0,
    current_quantity:0,
    new_quantity:0.00,
    unit:"Unit"
  }
  )
  
  const productDoc = ref()
 
  async function  loadData(){
 
    const loading = await app.showLoading();
    const productRes = await app.getDoc("Product",doc.value.product_code)
    if(productRes){
      productDoc.value = productRes.data
    }
    getStockLocation()
    if(doc.value.stock_location){
    await getStockLocationProduct();
    }

    await loading.dismiss();
  }

    async function getStockLocation(){
      const location = await app.getDocList("Stock Location", {
        filters:[
          ["disabled","=",0]
        ],
        fields:["name"]
      })
      if (location.data){
        if(location.data.length > 0){
          doc.value.stock_location = location.data[0].name
        } 
      }
  }

  async function getStockLocationProduct(){
      const stockProductRes = await app.getDocList("Stock Location Product", {
        filters:[
          ["product_code","=",doc.value.product_code],
          ["stock_location","=",doc.value.stock_location]
        ],
        fields:["quantity","cost"]
      })
      if (stockProductRes.data){
        if(stockProductRes.data.length>0){
          doc.value.current_quantity = stockProductRes.data[0].quantity
          doc.value.new_quantity = stockProductRes.data[0].quantity
          doc.value.current_cost = stockProductRes.data[0].cost
          doc.value.new_cost= stockProductRes.data[0].cost

        } else {
          doc.value.current_quantity = 0
          doc.value.current_cost = 0
          doc.value.new_cost= 0
          doc.value.new_quantity = 0
          doc.value.new_cost= 0
        }
      }
  }

  async function onSave(){
    const loading = await app.showLoading("Saving Data...")
    const res = await app.createDoc("Single Product Adjustment",doc.value)

    if (res.data){
      await app.submitDoc(res.data);
      onCancel();
      doc.value.stock_location = res.data.stock_location;
      app.showSuccess(window.t("Update successfully"))
    }
    app.router.replace("/stock-adjustment")
    await loading.dismiss();
  }

  function onCancel(){
    doc.value = {
      new_cost:0,
      current_cost:0,
      current_quantity:0,
      new_quantity:0
    }
 productDoc.value = null
  }

  return {
   doc,
   productDoc,
   loadData,
   getStockLocationProduct,
   onCancel,
   onSave
  }

}