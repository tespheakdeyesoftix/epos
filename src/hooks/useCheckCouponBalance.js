import supabase from "@/services/supabase-client";

import { ref } from "vue"
 





export function useCheckCouponBalance() {
    let page = 0;          // current page index
    const pageSize = 20;   // number of items per page
    let canLoadMore  = ref(true)
    const totalRow = ref(0)
    const couponData = ref([])
    const filter = ref({
        keyword: "",
        has_balance: true,
        is_redeem: 0,
        sort_field:"coupon_number",
        sort_order:0,
        
    })
    const isServerRunning = ref(true)


    

    async function getMoreData() {
        const start = page * pageSize;
        const end = start + pageSize - 1;

        let query = supabase
            .from(import.meta.env.VITE_SUPABASE_COUPON_TRANSACTION_TABLE)
            .select(`
                name, 
                coupon_number,
                price,
                top_up_amount,
                use_amount,
                redeem_amount,
                balance_amount,
                posting_date,
                is_redeem
            `,{ count: 'exact' });

        // Apply dynamic conditions
        // keyword 
        if (filter.value.keyword && filter.value.keyword.trim() !== "") {
            query = query.ilike('coupon_number', `%${filter.value.keyword}%`);  
        }

        // start date and end date
        if (filter.value.posting_date?.start_date) {
            query = query.gte('posting_date', filter.value.posting_date.start_date);
        }
        if (filter.value.posting_date?.end_date) {
            query = query.lte('posting_date', filter.value.posting_date.end_date);
        }

        // balance 
        if (filter.value.has_balance==1) {
            query = query.gt('balance_amount', 0);
        }
        else  if (filter.value.has_balance==0) {
            query = query.eq('balance_amount', 0);
        }

        // redeem 
        if (filter.value.is_redeem>=0) {
            query = query.eq('is_redeem', filter.value.is_redeem);
        }
        // apply order by
        query = query.order(filter.value.sort_field || "coupon_number", { ascending: filter.value.sort_order == 0 }) 

        // Apply pagination
        query = query.range(start, end);

        // Execute query
        const { data,count, error } = await query;
    
        if (error) {
            app.showWarning('Error fetching coupon codes');
           
            return null;
        }
        totalRow.value = count;
        return data;

    }

    async function getData(is_reset_filter=true){
        if(is_reset_filter){
            page = 0;
            canLoadMore.value =  true
            totalRow.value = 0;
           
        }else {
            page++;
        }
        const data  = await getMoreData();
        if(data.length<pageSize){
            canLoadMore.value = false
        }
        
        if (is_reset_filter){
        couponData.value = data    
        }else {
            couponData.value = [...couponData.value ,...data]
        }
    }

    
  const onLoadMoreData = async (event) => {
    if (!canLoadMore.value) return event.target.complete();
    await getData(false)
    event.target.complete();
  };


  
const onRedeem = async (coupon) => {

    if (isServerRunning.value) {
        await app.showWarning("Your server is running. Please system redeem option to redeem coupon.")
        return
    } 
    // prevent redeeming again

  if (coupon.is_redeem === "1") {
    app.showSuccess("This coupon has already been redeemed.")
    return;
  }

  if (coupon.balance_amount <= 0) {
    app.showWarning("Cannot redeem. The coupon balance is 0.");
    return;
  }

  const confirm = await app.utils.onConfirm("Redeem Coupon", "Are you sure you want to Redeem this coupon code?");
  if (!confirm) {
    return;
  }
const loading = await app.showLoading()

const { data, error } = await supabase
  .from(import.meta.env.VITE_SUPABASE_COUPON_TRANSACTION_TABLE)
  .update({ is_redeem: "1" })
  .eq("name", coupon.name); 

  if (error) {
    app.showWarning("Failed to redeem coupon. Please try again.");
    await loading.dismiss()
    return;
  }

  coupon.is_redeem = "1";
  app.showSuccess(`Coupon ${coupon.coupon_number} redeemed successfully`);
  await loading.dismiss()
};




    return {
        couponData,
        filter,
        totalRow,
        isServerRunning,
        getData,
        onLoadMoreData,
        onRedeem
    }

}