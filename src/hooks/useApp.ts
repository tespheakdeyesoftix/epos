 
import { getApi } from "@/services/api-service";
import { onMounted, ref } from "vue";
 
const currentProperty = ref({property_name:""})
const setting = ref()


async function getSetting() {

 
  const res = await app.postApi("epos_restaurant_2023.api.setting.get_settings")
  if (res.data) {

    setting.value = res.data
    app.setSetting(res.data)
    
  }
}


export function useApp() {

  const metas = ref<any[]>([])


  const currentLanguage = ref("en")
  const languages = [
    {
      lang:"en",
      icon:"/assets/en.svg",
      label:"English"
    },
    
    {
      lang:"kh",
      icon:"/assets/kh.svg",
      label:"ភាសារខ្មែរ"
    }
    ]


    
      async function getMeta(doctype:string){
      
        const existingDoctype = metas.value.find(r=>r.name == doctype);
      
        if(existingDoctype){
        
          return existingDoctype
        }
    
        const response =await getApi("edoor.api.frontdesk.get_meta",{
          doctype:doctype
        });
        
        if(response.data){
          metas.value.push(response.data);
          return response.data;
        }
    
    
      }


  async function getDoctypeDefaultFields(docType:string){
    let fields = ["name"]
    const meta = await getMeta(docType)
    if (meta.image_field) {
      fields.push(meta.image_field)
    }

    if (meta.title_field) {
      fields.push(meta.title_field)
    }
    
    if (meta.search_fields) {
      fields = [...fields, ...meta.search_fields.split(",").map((item: string) => item.trim())];
    }

    return [...new Set(fields)];

  }


  onMounted(()=>{
      currentLanguage.value = window.storageService.getItem("lang") || "en";
       
  })

  return { 
    languages,
    currentProperty,
    currentLanguage,
    getSetting,
    getMeta,
    getDoctypeDefaultFields
};
}
