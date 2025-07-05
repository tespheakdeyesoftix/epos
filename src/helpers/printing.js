import ComPrintPreview from "@/views/components/public/ComPrintPreview.vue"
export async function onPrint(return_type="base64"){
  alert(selected.value.print_template)
  
  const res = await app.postApi("epos_restaurant_2023.api.printing.get_print_data",{
    doctype:"Cashier Shift",
    docname:name.value,
    template:selected.value.print_template,
    return_type:return_type
  })

  if(res.data){
    console.log(res.data);
    //send printer 
    alert("print")
  }
}

export async function downloadPdf(doctype,docname,template){
  
  const url = `${app.setting.property.api_url}/api/method/epos_restaurant_2023.api.printing.get_print_data?doctype=${doctype}&docname=${docname}&template=${template}&return_type=pdf`;
  window.open(url, '_blank');
 

}
export async function printPreview(doctype,docname,template){
  app.openModal({
    component:ComPrintPreview,
    componentProps:{
      doctype:doctype,
      docname:docname,
      template:template
    },
    cssClass : "print-preview-modal"
  })

}