import supabase  from "@/services/supabase-client";

export const useCheckCouponBalance = async() => {
    const { data, error } = await supabase
        .from('food_court_coupon_codes')
        .select(`name, 
                coupon_number,
                price,
                top_up_amount,
                use_amount,
                redeem_amount,
                balance_amount,
                posting_date,
                is_redeem
                `);  
                 if (error) {
                console.error('Error fetching coupon codes:', error);
                return null;
            }

            return data; 
}