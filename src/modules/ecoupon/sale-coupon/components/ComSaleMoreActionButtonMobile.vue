<template>
  <ion-button shape="round" expand="full" @click="openActionSheet">
    <ion-icon :icon="ellipsisHorizontal"></ion-icon>
  </ion-button>

  <ion-action-sheet
    :is-open="actionSheetOpen"
    :buttons="actionSheetButtons"
    @didDismiss="actionSheetOpen = false"
  />
</template>

<script setup>
import { ref } from "vue";
import { ellipsisHorizontal } from "ionicons/icons";
import ComOrderDetailModal from "@/modules/ecoupon/sale-coupon/components/ComOrderDetailModal.vue";
import ComSaleUISetting from "@/views/components/ComSaleUISetting.vue";
import { useApp } from "@/hooks/useApp";
import { useSaleCoupon } from "@/hooks/useSaleCoupon";

const { saleDoc } = useSaleCoupon();
const { getUserPreference } = useApp();
const t = window.t;

const actionSheetOpen = ref(false);

function openActionSheet() {
  actionSheetOpen.value = true;
}

async function onChangeReferenceNumber() {
  actionSheetOpen.value = false;
  const result = await app.utils.onOpenKeyboard({
    title: t("Reference Number"),
  });
  if (result) {
    saleDoc.value.reference_number = result;
  }
}

async function onChangeNote() {
  actionSheetOpen.value = false;
  const result = await app.utils.onOpenKeyboard({
    title: t("Note"),
    defaultValue: saleDoc.value.note || "",
    storageKey: "sale_note",
  });
  if (typeof result === "string") {
    saleDoc.value.note = result;
  }
}

async function onOpenUISetting() {
  actionSheetOpen.value = false;
  const result = await app.openModal({
    component: ComSaleUISetting,
  });

 
  if (result) {
    await app.storageService.setItem("userPreference", JSON.stringify(result));
  } else {
    await getUserPreference();
  }
}

function onViewOrderDetail() {
  actionSheetOpen.value = false;
  app.openModal({
    component: ComOrderDetailModal,
    cssClass: "fullscreen-modal",
  });
}

async function onDeleteOrder() {
  actionSheetOpen.value = false;
  const confirm = await app.onConfirm(
    "Delete order",
    "Are you sure you want to delete this order"
  );
  if (!confirm) return;

  const l = await app.showLoading();
  const res = await app.postApi("epos_restaurant_2023.api.api.delete_sale", {
    name: saleDoc.value.name,
    auth: {
      full_name: app.currentUser.full_name,
      username: app.currentUser.name,
      note: "",
    },
  });

  if (res.data) {
    await l.dismiss();
    app.ionRouter.navigate("/sale-coupon", "forward", "replace");
  }

  await l.dismiss();
}

const actionSheetButtons = [
  {
    text: t("Set Reference Number"),
    handler: onChangeReferenceNumber,
  },
  {
    text: t("Note"),
    handler: onChangeNote,
  },
  // {
  //   text: t("UI Setting"),
  //   handler: onOpenUISetting,
  // },
  {
    text: t("View Order Detail"),
    handler: onViewOrderDetail,
  },
  {
    text: t("Delete this Order"),
    role: "destructive",
    disabled: !saleDoc.value.name,
    handler: onDeleteOrder,
  },
  {
    text: t("Cancel"),
    role: "cancel",
  },
  
];
</script>
