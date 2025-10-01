import supabase  from "@/services/supabase-client";

export async function getPropertyInformation(propertyCode:string,apiUrl:string = "") {
    
    
    if(propertyCode && apiUrl){
        const data = {"property_code":propertyCode,
            "app_url":apiUrl
        }
        return    { data, error:null };
    }
    
    

    if(import.meta.env.VITE_API_URL && import.meta.env.VITE_PROPERTY_CODE){
        const data = {"property_code":import.meta.env.VITE_PROPERTY_CODE,
            "app_url":import.meta.env.VITE_API_URL
        }
        
        return    { data, error:null };
    }
    
  
 
    const { data, error } = await supabase
        .from('business_information')
        .select('property_code, app_url')
        .eq("property_code", propertyCode)
        .single();

    if (error) {
        return { data: null, error };
    }

    return { data, error:null };
}

  