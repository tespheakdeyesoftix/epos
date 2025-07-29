<template>
  <BaseModal :title="t('Add Coupon Register')" @onConfirm="onSave" :confirmText="t('Save')">
    <stack>
      <stack row equal>
        <com-input
          type="date"
          :label="t('Posting Date')"
          v-model="doc.posting_date"
        />
      </stack>
      <com-input
        type="text-area"
        keyboard
        :label="t('Note')"
        v-model="doc.note"
      />
    </stack>
  </BaseModal>
</template>

<script setup>
import { modalController } from "@ionic/vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
const router = useRouter();
const t = window.t;

const props = defineProps({
  docListRef: Object,
  docname: String,
});

const doc = ref({
  posting_date: null,
  note: '',
});

async function onSave() {
  const loading = await app.showLoading();

  let posting_date = null;
  if (doc.value.posting_date) {
    posting_date = dayjs(doc.value.posting_date).format('YYYY-MM-DD');
  }

  const saveDoc = {
    posting_date,
    note: doc.value.note,
  };

  const result = await app.createDoc('Coupon Register', saveDoc);

  
  await loading.dismiss();
  if (result?.data?.name) {
    // Navigate to the new page
    router.push(`/coupon-register/${result.data.name}`);
  }
  modalController.dismiss(result.data, 'confirm');

  if (props.docListRef?.value) {
    props.docListRef.value.onRefresh();
  }
}
</script>
