import { onMounted, ref } from "vue"


export function useDoc() {
    const meta = ref()
    const form = ref()
    onMounted(async ()=>{
        meta.value = await app.getMeta(app.route.params.doctype)
        form.value = await app.generateUIJsonFromMeta(app.route.params.doctype)
    })
    return {
        form,
        meta
    }
}
