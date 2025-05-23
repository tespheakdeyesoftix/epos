import { ref, onMounted } from "vue";
import { getApi } from "@/services/api-service";

import { useApp } from "./useApp";

export function useDocument(props, doc = null, docInfo = null) {
  const { getMeta } = useApp();
  const loading = ref(true);
  let meta = {};

  const data = ref();

  async function getData() {
    const response = await getApi("frappe.desk.form.load.getdoc", {
      doctype: props.docType,
      name: props.docName,
    });
    if (!response.error) {
      data.value = response.data;
      if (doc) {
        doc.value = data.value.docs[0];
      }
      if (docInfo) {
        data.value.docinfo.owner = data.value.docs[0].owner;
        data.value.docinfo.modified_by = data.value.docs[0].modified_by;
        data.value.docinfo.creation = data.value.docs[0].creation;
        data.value.docinfo.modified = data.value.docs[0].modified;
        docInfo.value = data.value.docinfo;
      }
    }

    loading.value = false;
  }

  const onRefresh = async (event) => {
    await getData();
    event.target.complete();
  };

  onMounted(async () => {
    await getData();
  });

  return {
    loading,
    data,
    meta,
    getData,
    onRefresh,
  };
}
