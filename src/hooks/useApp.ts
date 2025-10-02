
import { onMounted, reactive, ref } from "vue";
 
const currentProperty = ref({property_name:""})
const isAppLoadReady = ref(false)
const isWorkingDayOpened = ref(false)
const isCashierShiftOpened = ref(false)
const exchange_rate = ref(1)
const exchange_rate_input = ref(1)
const change_exchange_rate =  ref(1)
const appMenus = ref([])
const bluetoothPrinters = ref([])
let userPreference = reactive({sale_ui_setting:{
      product_card_height:200,
      product_columns:3,
      product_container_width:65,
      product_font_size:14,
      button_font_size:12,
      use_simple_product_list_ui:false
  }
}
)
export function useApp() {

  const metas = ref<any[]>([])


  const currentLanguage = ref("en")
  const languages = [
    {
      lang:"en",
      server_lang:"en",
      icon:"assets/en.svg",
      label:"English"
    },
    
    {
      lang:"kh",
      server_lang:"km",
      icon:"assets/kh.svg",
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


  async function getUserPreference(){
 
    const preference = await app.storageService.getItem("userPreference");
    if(preference){
      userPreference =
      Object.assign(userPreference,  JSON.parse(preference))

    }
  }

  onMounted(async ()=>{
      currentLanguage.value = app.storageService.getItem("lang") || "en";  

      await getUserPreference()


  })

  return { 
    languages,
    currentProperty,
    currentLanguage,
   isAppLoadReady,
   isWorkingDayOpened ,
   isCashierShiftOpened ,
   change_exchange_rate,
   exchange_rate_input,
   exchange_rate,
   appMenus,
   bluetoothPrinters,
   userPreference,
   getUserPreference,
    getMeta,
    getDoctypeDefaultFields
};
}
