import { handleErrorMessage } from '@/helpers/error-message';
import { FrappeApp } from 'frappe-js-sdk';
import beep from '/assets/sound/submit.mp3'
let frappe: FrappeApp | null = null;


const beepSound = new Audio(beep)

export function setFrappeAppUrl(url: string) {

    frappe = new FrappeApp(url, {
        useToken: true,
        token: getToken,
        type: "token"
    });

}

function getToken() {
    const strCurrentUser = app.storageService.getItem("current_user");
    if (strCurrentUser) {
        const userObject = JSON.parse(strCurrentUser);
        const token = JSON.stringify(atob(userObject.token))

        return token.replaceAll('"', "")
    }
    return "";

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
        .catch(async (err) => {
            const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}




export function getApi(api_url: string, param: any = null) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const call = frappe.call();
    
    return call.get(api_url, param)
        .then((r: any) => {
            if (r.message) {
                return { data: r.message, error: null }
            } else {
               
                return { data: r.message, error: null }
            }
        })
        .catch(async (err) => {
            const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}

export function postApi(api_url: string, param: any = null) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const call = frappe.call();
    return call.post(api_url, param)
        .then((r: any) => ({ data: r.message, error: null }))
        .catch(async (err) => {
           const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}

export function getDoc(DocType: string, DocName: string) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.getDoc(DocType, DocName)
        .then((doc) => ({ data: doc, error: null }))
        .catch(async (err) => {
           const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}

export function getCount(DocType: string, filters:any) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()
    return db.getCount(DocType,filters,true,false)
        .then((count) => ({ data: count, error: null }))
        .catch(async (err) => {
            const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}

export function deleteDoc(DocType: string, DocName: string) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.deleteDoc(DocType, DocName)
        .then((msg) => ({ data: msg, error: null }))
        .catch(async (err) => {
           const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}


export function createDoc(DocType: string, params: any) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.createDoc(DocType, params)
        .then((doc) => ({ data: doc, error: null }))
        .catch(async (err) => {
          const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}


export function getValue(DocType: string, name: string, fields: any) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.getValue(DocType, fields, [["name", "=", name]])
        .then((doc) => ({ data: doc.name, error: null }))
        .catch(async (err) => {
            const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}

export function setValue(DocType: string, name: string, fields: any, value: any = null) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    if ((typeof fields) == "string") {
        return db.setValue(DocType, name, fields, value)
            .then((doc) => ({ data: doc.message, error: null }))
            .catch(async (err) => {
               const error = await handleErrorMessage(err);
            return { data: null, error }
            });

    } else {
        return db.setValue(DocType, name, fields)
            .then((doc) => ({ data: doc.message, error: null }))
            .catch(async (err) => {
              const error = await handleErrorMessage(err);
            return { data: null, error }
            });

    }



}



export function submitDoc(doc: any) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()


    return db.submit(doc)
        .then((doc) => {
            // pay beeb here
             beepSound.currentTime = 0
            beepSound.play()

            return { data: doc, error: null }
        })
        .catch(async (err) => {
           const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}


export function updateDoc(DocType: string, name: string, params: any) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
    const db = frappe.db()

    return db.updateDoc(DocType, name, params)
        .then((doc) => ({ data: doc, error: null }))
        .catch(async (err) => {
           const error = await handleErrorMessage(err);
            return { data: null, error }
        });
}



export async function uploadFile(
    docType: string,
    docname: string,
    fieldname: string,
    fileData: any,
    otherOption: any,
    p0: (completedBytes: any, totalBytes: any) => void
) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }

    const file = frappe.file();



    const fileArgs = {
        "isPrivate": false,
        "folder": "home",
        /** File URL (optional) */
        "file_url": otherOption.file_url ?? "",
        "doctype": docType,
        "docname": docname,
        /** Field in the document **/
        "fieldname": fieldname
    }

    return file.uploadFile(
        fileData,
        fileArgs,

        (completedBytes, totalBytes) => {
            if (totalBytes) {
              //  console.log(Math.round((completedBytes / totalBytes) * 100), " completed")
            }
        },
        "epos_restaurant_2023.api.upload.upload_file"
    )
        .then(async (result: any) => {

            // Log to See Structure
       
            return { data: result.data.message.file_url, error: null };
        })
        .catch(async (e) => {

           const err = handleErrorMessage(e);
            return { data: null, error:err }
        })



}

export async function removeAttachment(docType: string, docname: string, file_url: string) {
    if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }

    try {
        const call = frappe.call();
        const response = await call.get("frappe.desk.form.utils.remove_attach", {
            doctype: docType,
            docname: docname,
            file_url: file_url
        }
        );

        // Ensure translated message is a string
        const message = window.t?.("File removed successfully") || "File removed successfully";
        //window.showSuccess(message);

        return { data: response, error: null };
    } catch (err) {
       const error = await handleErrorMessage(err);
            return { data: null, error }
    }
}


export function getDoctypeCount(doctype:string, filters:any,orFilters:any) {
        
if (!frappe) {
        return { data: null, error: "Frappe is not defined" };
    }
  const call = frappe.call();
        return call.post("epos_restaurant_2023.api.utils.get_doctype_count",{doctype_name:doctype,filters:filters,or_filters:orFilters})
        .then((r) => {
            return { data: r.message, error: null };
})
        .catch((error) => {
        return { data: null, error }
    });
}






