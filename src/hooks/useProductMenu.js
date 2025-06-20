import {ref} from "vue"

const products = ref([])

getProducts();
async function getProducts(){
     
    const params =  {
        fields:["name","product_name_en","product_name_kh","photo",
        "price","unit","allow_discount","allow_change_price","is_open_product",
        "coupon_value","coupon_markup_type","coupon_markup_value",
        "append_quantity",
        "allow_free"
        ],
        filters:[["is_coupon","=",1],["disabled","=",0]],
        limit: 500000,
        orderBy: {
            field: 'sort_order',
            order: 'asc',
        }
    }

    const res =await  app.getDocList("Product",params)
    if(res.data) {
        products.value = res.data
    }


}

export function useProductMenu() {
    

return {
    products,
    getProducts
}

}