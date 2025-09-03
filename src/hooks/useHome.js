
import { onMounted, ref } from "vue";
import { useAuth } from "./useAuth";

const {currentUser} = useAuth()


export function useHome() {
    const currentMenu = ref()
const appMenu = ref([{"component":"","icon":Object,"title":"","color":""}])

    function onOpenRoute(m) {
      
        if (m.is_group == 1) {
            app.ionRouter.navigate("/home/" + m.name, "forward", "push");
            return;
        }
        if (m.route_url) {
            app.ionRouter.navigate(m.route_url, "forward", "push");
            return
        }
    }


    async function getAppMenu() {
        
        let menus = []

        if (app.route.params.parent_menu) {

             menus = currentUser.value.app_menus.filter(x=>x.show_in_home == 1 && x.parent_mobile_app_module == app.route.params.parent_menu)
         
        }else {
            menus = currentUser.value.app_menus.filter(x=>x.show_in_home == 1 && (x.parent_mobile_app_module || "")== "")
        }
       
        appMenu.value =menus
    }

    async function getCurrentMenu(name){
      
        currentMenu.value = currentUser.value.app_menus.find(x=>x.name = name)
    }

    return {
        appMenu,
        currentMenu,
        getAppMenu,
        onOpenRoute,
        getCurrentMenu
    };
}
