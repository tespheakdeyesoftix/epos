export async function checkWorkingDay(){
    const res = await app.getApi("epos_restaurant_2023.api.setting.get_working_day",{
        pos_profile:app.setting.pos_profile.name
    })
    console.log("xx",res.data)
    alert(res.data.message)
    if(res.data){
        app.utils.getSetting()
        return 200
    }
    return 0//no any error
}