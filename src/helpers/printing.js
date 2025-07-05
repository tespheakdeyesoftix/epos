import { CapacitorHttp } from '@capacitor/core';
import ComPrintPreview from "@/views/components/public/ComPrintPreview.vue"
import ComSelectPrinter from '@/views/components/public/ComSelectPrinter.vue';
export async function onPrint(doctype,docname, template,printer_name=""){
  if(!printer_name){

    const printer = await app.openModal({
      component:ComSelectPrinter
    })

    if(printer){
      printer_name = printer
    }else {
      return;
    }

  }


  if(!printer_name){
    await app.showWarning("There no printer setup. Please contact your system administrator to setup printer.")
    return
  }
 
  const l = await app.showLoading()
  const res = await app.postApi("epos_restaurant_2023.api.printing.get_print_data",{
    doctype:doctype,
    docname:docname,
    template:template,
    return_type:"base64"
  })

  if(res.data){
    app.printService.submit({
                'type':  printer_name,
                'url': 'file.pdf',
                'file_content': res.data
            });
  }else {
    app.showWarning("Print report fail. Please try again.")
  }

  await l.dismiss()
  
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
    cssClass :  "print-preview-modal"
  })

}


export async function getPrinterNames(){
  
 
  let url = app.setting.pos_config.print_service_url.replace("wss","https")
  url =url.replace("ws","http")
  url =url.replace("printer","config.json")

 
   try {
      const options = {
        url: url,
      };
      const response = await CapacitorHttp.get(options);
      if (response.status === 200) {
         
        return response.data.printer.mappings
      } else {
        handleErrorMessage(response.data);
        throw new Error(response.data);
      }
    } catch (error) {
      app.showWarning("Cannot get printer list")
    }
}