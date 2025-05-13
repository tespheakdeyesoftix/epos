import { handleErrorMessage } from '@/helpers/error-message';
import { FrappeApp } from 'frappe-js-sdk';

let frappe: FrappeApp | null = null;

export function setFrappeAppUrl(url:string){
    
    frappe = new FrappeApp(url,{
        useToken: true,
        token: getToken,
        type: "token"
    });
 
}

function getToken(){
    const strCurrentUser = window.storageService.getItem("current_user");
    if(strCurrentUser){
        const userObject = JSON.parse(strCurrentUser);
        const token = JSON.stringify(atob(userObject.token))
       
        return token.replaceAll('"',"") 

        
    }
    return "" ;
   
}
export function logoutApi() {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const auth = frappe.auth()
    return auth
  .logout()
  .then(() => (true))
  .catch(() => (false));
}

export function getDocList(DocType: string, param: any = null) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db();
    return db.getDocList(DocType, param)
        .then((r: any) => ({ data: r, error: null }))
        .catch((error) => {
            handleErrorMessage(error);
            return { data: null, error }
        });
}




export function getApi(api_url: string, param: any = null) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const call = frappe.call();
      return call.get(api_url,param)
      .then((r: any) => {
        if(r.message){
            return { data: r.message, error: null }
        }else {
            return { data: r, error: null }
        }
      })
      .catch((error) => {
        handleErrorMessage(error);
        return { data: null, error }
    });
}

export function postApi(api_url: string, param: any = null) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const call = frappe.call();
      return call.post(api_url,param)
      .then((r: any) => ({ data: r.message, error: null }))
      .catch((error) => {
        handleErrorMessage(error);
        return { data: null, error }
    });
}

export function getDoc(DocType: string,DocName:string) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.getDoc(DocType, DocName)
  .then((doc) =>({ data: doc, error: null }))
  .catch((error) => {
    handleErrorMessage(error);
    return { data: null, error }
  });
}


export function createDoc(DocType: string,params:any) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.createDoc(DocType, params)
  .then((doc) =>({ data: doc, error: null }))
  .catch((error) => {
    handleErrorMessage(error);
    return { data: null, error }
  });
}

export function updateDoc(DocType: string,name:string,params:any) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.updateDoc(DocType,name, params)
  .then((doc) =>({ data: doc, error: null }))
  .catch((error) => {
    handleErrorMessage(error);
    return { data: null, error }
  });
}



export async function uploadFile(
docType: string, docname: string, fieldname: string, fileData: any, otherOption: any, p0: (completedBytes: any, totalBytes: any) => void) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }

    const file = frappe.file();

  

        const fileArgs = {
            "isPrivate": false,
            "folder":"home",
            /** File URL (optional) */
            "file_url": otherOption.file_url??"",
            "doctype": docType,
            "docname": docname,
            /** Field in the document **/
            "fieldname": fieldname
          }
        
        return file.uploadFile(
            fileData,
            fileArgs,
           
            (completedBytes, totalBytes) => {
                if(totalBytes){
                    console.log(Math.round((completedBytes / totalBytes) * 100), " completed")
                }
            },
            "edoor.api.upload.upload_file"
        )
        .then(async (result:any) =>{
            
            // Log to See Structure
            console.log(result.data.message.file_url);
             
            return { data: result.data.message.file_url, error: null };
        })
        .catch(async(e) => {
           
            handleErrorMessage(e);
            return { data: null, e }
        })
         
       
       
}

export async function removeAttachment(docType: string, docname: string, file_url: string) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }

    try {
        const response = await frappe.call({
            method: "frappe.desk.form.utils.remove_attach",
            args: {
                doctype: docType,
                docname: docname,
                file_url: file_url
            }
        });

        window.showSuccess(window.t("File removed successfully"));
        return { data: response, error: null };
    } catch (error) {
        console.error("Error removing file:", error);
        return { data: null, error };
    }
}





