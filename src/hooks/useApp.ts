
import { onMounted, ref } from "vue";
 
const currentProperty = ref({property_name:""})
const isAppLoadReady = ref(false)
const isWorkingDayOpened = ref(false)

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
    
        const response =await app.getApi("epos_restaurant_2023.api.api.get_meta",{
          doctype:doctype
        });
        
        if(response.data){
          metas.value.push(response.data);
          return response.data;
        }
    
    
      }


  async function getDoctypeDefaultFields(docType:string){
    let fields = ["name"]
    const meta = await app.getMeta(docType)
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
   isAppLoadReady,
   isWorkingDayOpened ,
    getMeta,
    getDoctypeDefaultFields
};
}
