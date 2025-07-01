

import { onMounted, ref } from "vue";
import { uploadFile } from '@/services/api-service.ts'
const doc = ref({
  cost:0,
  price:0,
  unit:"Unit",
  product_price:[]})
const selectedFile = ref(null)
const previewUrl = ref(null)
const uploadProgress = ref(0)
const navigation = ref()
const router = ref()
const warningMessage = ref("")
function handleFileChange(event) {
  const input = event.target;
  const file = input?.files?.[0] || null;
  selectedFile.value = file;
  if (file && file.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
}

async function startUpload(docname) {
   
  if (!selectedFile.value) {
    
    return
  }

  const result = await uploadFile(
    'Product',
    docname,
    'photo',
    selectedFile.value,
    { file_url: '' },
    (completedBytes, totalBytes) => {
      if (totalBytes) {
        uploadProgress.value = Math.round((completedBytes / totalBytes) * 100)
      }
    }
  )

  if (result.error) {
    console.error('Upload failed:', result.error)
  } else {
 
    // Optionally reset file input and preview
    selectedFile.value = null
    previewUrl.value = null
    uploadProgress.value = 0
  }
}

async function loadDoc(docname) {
 
  const loading = await window.showLoading()
  const res = await app.getDoc("Product", docname)
  doc.value = res.data;
await loading.dismiss()

}

async function onSave(){
  const loading = await window.showLoading();
  let res = null
  if(doc.value.name){
     res= await app.updateDoc("Product", doc.value.name, doc.value)
  }else {
    res= await app.createDoc("Product", doc.value)

  }
  if (res.data){
   await startUpload(res.data.name)

   if (doc.value.name){
    navigation.value.navigate("/add-product", 'forward', 'replace');
  }
  resetDoc()
    app.showSuccess(window.t("Save successfully"))
  }

  
  await loading.dismiss();
  
}

function resetDoc(){
  doc.value ={
    cost:0,
    price:0,
    unit:"Unit",
    product_price:[]}

  selectedFile.value = null
  previewUrl.value = null
  warningMessage.value = ""
 

}

async function onRemovefile(){
  const result = await  app.Confirm();
  if(result){
    previewUrl.value = null
    selectedFile.value = null
    doc.value.photo = ""
  
  }
  
}

async function onProductCodeChange(){
  warningMessage.value = ""
   if(doc.value.product_code && (doc.value.name || "") != doc.value.product_code){
      const res = await app.getDocList("Product",{
        filters:[["product_code","=",doc.value.product_code]]
      })
      
      if (res.data){
       
        if(res.data.length>0){
         
        
          warningMessage.value = window.t(`Product Code ${doc.value.product_code} is already exist.` )

        }else{
          if(doc.value.name){
            const loading = await app.showLoading(window.t("Change Product Code"))
            
            const rename_res =await  app.renameDoc("Product",doc.value.name, doc.value.product_code)
            if(rename_res.data){
                router.value.replace("/add-product/" + rename_res.data.name)
            }
            await loading.dismiss()

            
          }
          
        }
      }
   }
  
}


async function onDelete(){
  const isConfirm = await app.onConfirm()
  
  if(!isConfirm) return ;

  const l = await app.showLoading()
  const res = await app.deleteDoc("Product",doc.value.name);
  if(res.data){
    app.router.back();
  }
  await l.dismiss();
}

export function useAddProduct(props = null) {
  return {
    previewUrl,
    selectedFile,
    doc,
    navigation,
    warningMessage,
    router,
    onProductCodeChange,
    onRemovefile,
    onSave,
    loadDoc,
    handleFileChange,
    resetDoc,
    onDelete

  }

}