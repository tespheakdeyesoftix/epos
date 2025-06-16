
import { onMounted, ref } from "vue";


export function useHome() {
    const currentMenu = ref()
    const appMenu = ref()

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
        let filters = [["parent_mobile_app_module", "is", "not set"],["show_in_home","=","1"]]
        if (app.route.params.parent_menu) {
            filters = [["parent_mobile_app_module", "=", app.route.params.parent_menu]]
        }
        filters.push(["is_active","=",1])
    
        const res = await app.getDocList("Mobile App Module", {
            fields: ["*"],
            filters: filters,
              orderBy: {
            field: 'sort_order',
            order: 'asc',
        },

        })
        appMenu.value = res.data;
    }

    async function getCurrentMenu(name){
        const res = await app.getDoc("Mobile App Module",name)
        currentMenu.value = res.data
    }

    return {
        appMenu,
        currentMenu,
        getAppMenu,
        onOpenRoute,
        getCurrentMenu
    };
}
