import { CapacitorHttp } from '@capacitor/core';
import ComPrintPreview from "@/views/components/public/ComPrintPreview.vue"
import ComSelectPrinter from '@/views/components/public/ComSelectPrinter.vue';
import html2canvas from 'html2canvas';

 import { TcpSocket,DataEncoding  } from 'capacitor-tcp-socket';

export async function onPrint(options={
  doctype:"",
  docname:"", 
  template:"",
  printer_name:"",
  lang:"en",
  copy:1,
  show_loading:true
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
 
  let l = null
  try{

 
  if(options.show_loading) l = await app.showLoading()
  const res = await app.postApi("epos_restaurant_2023.api.printing.get_print_data",{
    doctype:options.doctype,
    docname:options.docname,
    template:options.template,
    return_type:"base64",
    lang: options.lang || "en"
    
  })

  if(res.data){
    
    for (let i = 1; i <= (options.copy || 1); i++) {

        app.printService.submit({
                    'type':  options.printer_name,
                    'url': 'file.pdf',
                    'file_content': res.data,
                });

        }
  }else {
    app.showWarning("Print report fail. Please try again.")
  }
  }   catch (error) {
    app.showWarning("Print report fail. Please try again.")
  } finally {
    
      if(l)   await l.dismiss()
  }  


  
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
  lang:"en",
  printer_name:""
}){
  
  app.openModal({
    component:ComPrintPreview,
    componentProps:options,
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


export async function onPrintBill(options = {docname:"",  template:"",  copies:1,  is_reprint:0,show_loading:false}) {
 
    let loading = null
    
    if(options.show_loading) loading = await app.showLoading();
    
    const result = await app.postApi("epos_restaurant_2023.api.printing.get_print_bill_pdf", {
        pdf: 0,
        station: app.setting.station_name,
        name: options.docname,
        reprint: options.re_print,
        template:options.template
    })

 

    if (result.data) {
 
      for (let i = 0; i < (options.copies || 1); i++) {
          
            app.printService.submit({
                'type': "Cashier Printer",//printer name
                'url': 'file.pdf',
                'file_content': result.data
            });
        }


    }

    if(loading) await loading.dismiss();

}


export async function getPrintFormat(pos_profile){
  // can improve by cached
  const res=await app.getApi("epos_restaurant_2023.api.setting.get_print_format",{
    pos_profile:pos_profile
  });
  if(res.data){
  return res.data
  }
  return []
}

 export async function printReceipt() {
  try {
    // 1. Fetch base64 image from API
    const response = await app.getApi("epos_restaurant_2023.api.printing.convertimg");
    const base64Image = response.data;

    // 2. Load the image
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = base64Image;
    });

    // 3. Set dimensions for thermal paper
    const targetWidthPx = 550; // Fixed width
    const aspectRatio = img.width / img.height;
    const targetHeightPx = Math.floor(targetWidthPx / aspectRatio);

    // 4. Create canvas and draw image
    const canvas = document.createElement('canvas');
    canvas.width = targetWidthPx;
    canvas.height = targetHeightPx;
    const ctx = canvas.getContext('2d');
    
    // Fill background with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
    
    // Draw image with NO smoothing (sharp 1-bit look)
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);

    // 5. Connect to printer first to minimize delay
    const { client } = await TcpSocket.connect({
      ipAddress: '192.168.10.247',
      port: 9100
    });

    // 6. Initialize printer
    await TcpSocket.send({
      client: client,
      data: '1B40', // ESC @ (Initialize)
      encoding: 'hex'
    });

    // 7. Process image in vertical chunks to avoid memory issues
    const MAX_CHUNK_HEIGHT = 500; // Process 500 lines at a time
    const widthBytes = Math.ceil(targetWidthPx / 8);
    
    for (let yStart = 0; yStart < targetHeightPx; yStart += MAX_CHUNK_HEIGHT) {
      const chunkHeight = Math.min(MAX_CHUNK_HEIGHT, targetHeightPx - yStart);
      
      // Get image data for this chunk only
      const imageData = ctx.getImageData(0, yStart, targetWidthPx, chunkHeight);
      const rasterData = new Uint8Array(widthBytes * chunkHeight);

      // Convert to 1-bit monochrome
      for (let y = 0; y < chunkHeight; y++) {
        for (let xByte = 0; xByte < widthBytes; xByte++) {
          let byte = 0;
          for (let bit = 0; bit < 8; bit++) {
            const x = xByte * 8 + bit;
            if (x < targetWidthPx) {
              const idx = (y * targetWidthPx + x) * 4;
              const r = imageData.data[idx];
              const g = imageData.data[idx + 1];
              const b = imageData.data[idx + 2];
              // Use luminance-based threshold
              if ((r * 0.3 + g * 0.59 + b * 0.11) < 140) {
                byte |= 1 << (7 - bit);
              }
            }
          }
          rasterData[y * widthBytes + xByte] = byte;
        }
      }

      // 8. Send image chunk with proper ESC/POS formatting
      const header = new Uint8Array([
        0x1D, 0x76, 0x30, // GS v 0
        0x00,             // Mode
        widthBytes & 0xFF, (widthBytes >> 8) & 0xFF, // Width
        chunkHeight & 0xFF, (chunkHeight >> 8) & 0xFF // Height
      ]);

      // Combine header + image data
      const fullCommand = new Uint8Array([...header, ...rasterData]);
      
      // Send in smaller chunks if needed
      const CHUNK_SIZE = 2048;
      for (let i = 0; i < fullCommand.length; i += CHUNK_SIZE) {
        const chunk = fullCommand.slice(i, Math.min(i + CHUNK_SIZE, fullCommand.length));
        await TcpSocket.send({
          client: client,
          data: btoa(String.fromCharCode(...chunk)),
          encoding: 'base64'
        });
        await new Promise(r => setTimeout(r, 10)); // Small delay
      }
    }

    // 9. Feed paper fully before cutting
    await TcpSocket.send({
      client: client,
      data: '1B6405', // Feed 5 lines (adjust as needed)
      encoding: 'hex'
    });

    // 10. Cut paper
    await TcpSocket.send({
      client: client,
      data: '1D560100', // Partial cut
      encoding: 'hex'
    });

    await TcpSocket.disconnect({ client });
    console.log('Long receipt printed successfully!');
    
  } catch (error) {
    console.error('Print error:', error);
    try {
      await TcpSocket.disconnect({ client });
    } catch (e) {}
    throw new Error('Print failed: ' + error.message);
  }
}