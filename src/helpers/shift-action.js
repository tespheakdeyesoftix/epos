

export async function checkWorkingDay(){
    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.setting.get_working_day",{
        pos_profile:app.setting.pos_profile.name
    })
    if(res.data){
        app.utils.getSetting()
        l.dismiss()
        return 200
    }
    l.dismiss()
    return 0//no any error
}