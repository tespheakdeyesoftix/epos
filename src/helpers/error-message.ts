
import {  toastController } from '@ionic/vue';
import {stripHtmlTags} from "@/helpers/utils"
export async function handleErrorMessage(error_data:any){
   const result = []
    
    const dictionary = [
        {exception: 'frappe.exceptions.MandatoryError', text: 'Invalid input'},
        {exception: 'frappe.exceptions.TimestampMismatchError', text: 'Please refresh to get the latest document.'},
        {exception: 'frappe.exceptions.LinkExistsError', text: 'Cannot delete because it has relative data.'}
    ]
    const message = JSON.parse(JSON.stringify(error_data))
    if(message._error_message){
        
        showWarningMessage(message._error_message)
        result.push(message._error_message)
    }

    if(message._server_messages){
 
        const _server_messages = JSON.parse(message._server_messages)
 
		 
			_server_messages.forEach((r:any) => {
                if(JSON.parse(r).message){
                    showWarningMessage(JSON.parse(r).message.replace("Error: ",""))
                     result.push(JSON.parse(r).message.replace("Error: ",""))
                }
			});
        }
			
        else  if(message.httpStatus == 417){
        let arrException: string[] = []
        if(message.exception){
            if(Array.isArray(message.exception)){
                arrException = message.exception
            }
            else if(message.exception){
                arrException = message.exception.split(':')
              
            }
            if(arrException[0]){
                if(arrException[0] == 'frappe.exceptions.ValidationError')
                {
                showWarningMessage(arrException[1])
                result.push(arrException[1])
                }
                else{
                    const msg = dictionary.find((r)=>r.exception == arrException[0])
                    if(msg?.text){
                         showWarningMessage(msg.text)
                      result.push(msg.text)
                    }     
                }
            }
        } 
    }else{ 
        showWarningMessage(message.httpStatusText)
        result.push(message.httpStatusText)
    }
    return result
}


export async  function showWarningMessage(message:string){
    if ((message ||"") =="") return;
    const toast = await toastController.create({
        message:stripHtmlTags(message)? window.t(stripHtmlTags(message)): stripHtmlTags(message),
        duration: 5000,
        position: "top",
        swipeGesture:"vertical",
        color: "warning"
    });
    toast.present();
}