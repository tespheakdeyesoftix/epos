import { CapacitorHttp } from '@capacitor/core';
import ComPrintPreview from "@/views/components/public/ComPrintPreview.vue"
import ComSelectPrinter from '@/views/components/public/ComSelectPrinter.vue';
export async function onPrint(options={
  doctype:"",
  docname:"", 
  template:"",
  printer_name:"",
  lang:"en"
}){
  
  if(!options.printer_name){

    const printer = await app.openModal({
      component:ComSelectPrinter
    })

    if(printer){
      options.printer_name = printer
    }else {
      return;
    }

  }


  if(!options.printer_name){
    await app.showWarning("There no printer setup. Please contact your system administrator to setup printer.")
    return
  }
 
  const l = await app.showLoading()
  const res = await app.postApi("epos_restaurant_2023.api.printing.get_print_data",{
    doctype:options.doctype,
    docname:options.docname,
    template:options.template,
    return_type:"base64",
    lang: options.lang || "en"
  })

  if(res.data){
    app.printService.submit({
                'type':  options.printer_name,
                'url': 'file.pdf',
                'file_content': res.data
            });
  }else {
    app.showWarning("Print report fail. Please try again.")
  }

  await l.dismiss()
  
}

export async function downloadPdf(options={
  doctype:"",
  docname:"", 
  template:"",
  lang:"en"
}){
  
  const url = `${app.setting.property.api_url}/api/method/epos_restaurant_2023.api.printing.get_print_data?doctype=${options.doctype}&docname=${options.docname}&template=${options.template}&return_type=pdf&lang=${options.lang || 'en'}`;
  window.open(url, '_blank');
 

}
export async function printPreview(options={
  doctype:"",
  docname:"", 
  template:"",
  lang:"en"
}){
  
  app.openModal({
    component:ComPrintPreview,
    componentProps:{
      doctype:options.doctype,
      docname:options.docname,
      template:options.template,
      lang:options.lang
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