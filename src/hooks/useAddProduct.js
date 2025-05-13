
import { getApi, getDoc,updateDoc,createDoc } from "@/services/api-service";
import { onMounted, ref } from "vue";
import { uploadFile } from '@/services/api-service.ts'
const doc = ref({})
const selectedFile = ref(null)
const previewUrl = ref(null)
const uploadProgress = ref(0)
const navigation = ref()

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
    console.log('Uploaded file URL:', result.data)
    // Optionally reset file input and preview
    selectedFile.value = null
    previewUrl.value = null
    uploadProgress.value = 0
  }
}

async function loadDoc(docname) {
  const loading = await window.showLoading()
  const res = await getDoc("Product", docname)
  doc.value = res.data;
await loading.dismiss()

}

async function onSave(){
  const loading = await window.showLoading();
  let res = null
  if(doc.value.name){
     res= await updateDoc("Product", doc.value.name, doc.value)
  }else {
    res= await createDoc("Product", doc.value)

  }
  if (res.data){
   await startUpload(res.data.name)
   resetDoc()
   if (doc.value.name){
    navigation.value.navigate("/add-product", 'forward', 'replace');
  }
    app.showSuccess(window.t("Save successfully"))
  }

  
  await loading.dismiss();
  
}

function resetDoc(){
  doc.value = {}
  selectedFile.value = null
  previewUrl.value = null
 

}

async function onRemovefile(){
  const result = await  app.Confirm();
  if(result){
    previewUrl.value = null
    selectedFile.value = null
    doc.value.photo = ""
  
  }
  
}

export function useAddProduct(props = null) {
  return {
    previewUrl,
    selectedFile,
    doc,
    navigation,
    onRemovefile,
    onSave,
    loadDoc,
    handleFileChange,
    resetDoc

  }

}