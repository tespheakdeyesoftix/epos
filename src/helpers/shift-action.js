
    import { useApp } from '@/hooks/useApp';
const { isWorkingDayOpened, isCashierShiftOpened } = useApp();

export async function checkWorkingDay(){
    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.setting.get_working_day",{
        pos_profile:app.setting.pos_profile.name
    })
    if(res.data){
        app.utils.getSetting()
        l.dismiss()
        isWorkingDayOpened.value = true
        return 200
    }
    isWorkingDayOpened.value = false
    l.dismiss()
    return 0//no any error
}

export async function checkCashierShift(){

    const l = await app.showLoading();
    // check if working open or not
    const workingRes = await app.getApi("epos_restaurant_2023.api.setting.get_working_day",{
        pos_profile:app.setting.pos_profile.name
    })
    if(!workingRes.data){
        await l.dismiss()
        return 203;
    }

    const res = await app.getApi("epos_restaurant_2023.api.api.get_current_cashier_shift",{
        pos_profile:app.setting.pos_profile.name
    })
    if(res.data){
        app.setting.cashier_shift = res.data
        isCashierShiftOpened.value = true;
        l.dismiss()
        return 202 
    }
    delete app.setting.cashier_shift;

 isCashierShiftOpened.value = false;
    l.dismiss()
    return 0//no any error
}


export async function validateCloseShift(){

    const l = await app.showLoading();
    // chekc if shift is still open
    const res = await app.getApi("epos_restaurant_2023.selling.doctype.cashier_shift.cashier_shift.validate_before_close_shift",{
        pos_profile:app.setting.pos_profile.name
    });
    if(res.data){
        if(res.data.error_code == "No Shift Opened"){
            isCashierShiftOpened.value = false
            app.setting.cashier_shift = null
        }

            await l.dismiss()
        return res.data.error_code
    }
await l.dismiss()
    return ""
}