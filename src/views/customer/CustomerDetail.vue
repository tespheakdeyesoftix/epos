<template>
  <ion-page>
    <ToolBar>
      {{ t("Customer Detail") }} - {{ data?.name }}
      <template #end>
        <ComPopOver>
          <ion-button shape="round">
          <ion-icon slot="icon-only" :icon="ellipsisVertical"/>
        </ion-button>
        <template #content>
            <ion-list>
              <ion-item>
                <ion-label>{{ t("Edit") }}</ion-label>
              </ion-item>
            </ion-list>
        </template>
        </ComPopOver>
      </template>
    </ToolBar>

    <ion-content>
      <!-- Header with background image -->
      <div class="profile-header">
        <div
          class="header-background"
          :style="{ backgroundImage: `url('${randomBgImage}')` }"
        ></div>

        <!-- Avatar wrapper with overlay icon -->
        <div class="avatar-wrapper">
          <ion-avatar class="custom-avatar" @click="onAvatarClick" style="cursor: pointer">
            <img
              v-if="data?.photo"
              :src="data.photo"
              alt="avatar"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
            <div class="avatar-placeholder" v-else>
              {{ getAvatarLetter(data?.customer_name_en) }}
            </div>
          </ion-avatar>
         
          <ion-icon
            v-if="data?.photo"
            :icon="trash"
            @click.stop="onClearPhoto"
            class="trash-icon"
          ></ion-icon>
        </div>
      </div>
  
     
      <div class="profile-name">
        {{ data?.name }} - {{ data?.customer_name_en }}
      </div>

      
      <div class="fix-container">
        <ComViewCard />
        <ComSegment :data="data" />
      </div>
    </ion-content>

    
    <ComCustomerFooter class="ion-hide-sm-down" :data="data" @reload="onRefresh" ref="docListRef" />
  </ion-page>
</template>

<script setup>
  import { IonIcon } from '@ionic/vue';
import {   ellipsisVertical, trash } from 'ionicons/icons';
import { onMounted, ref } from 'vue'
import ComSegment from "@/views/customer/components/ComSegment.vue"
import ComCustomerFooter from "@/views/customer/components/ComCustomerFooter.vue"
import ComViewCard from "@/views/customer/components/ComViewCard.vue"
import { getAvatarLetter } from "@/helpers/utils"

const t = window.t
const footerRef = ref(null)
const data = ref()
const randomBgImage = ref("")

const bgImages = [
  "./assets/back2.jpg",
  "./assets/back3.jpg",
  "./assets/back9.jpg",
  "./assets/back10.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Gull_feeding_on_flies_with_tufa_and_Sierra_Nevada_in_background-2000px.jpeg/1200px-Gull_feeding_on_flies_with_tufa_and_Sierra_Nevada_in_background-2000px.jpeg",
  "https://c4.wallpaperflare.com/wallpaper/800/831/598/digital-art-neon-mountains-lake-wallpaper-thumb.jpg",
  "https://i.etsystatic.com/56713946/r/il/0d08c9/6638762685/il_fullxfull.6638762685_p2xv.jpg",
]

const onAvatarClick = () => {
  footerRef.value?.uploadRef?.triggerFileInput('brows')
}

const onClearPhoto = async () => {
  const confirmed = await app.utils.onConfirm(t("Remove Photo"), t("Are you sure you want to remove this photo?"))
  if (!confirmed) return

  const loading = await app.showLoading("Removing...")
  const res = await app.updateDoc("Customer", data.value.name, { photo: null })
  await loading.dismiss()

  if (res?.data) {
    app.showSuccess(t("Photo removed successfully"))
    await onRefresh()
  } else {
    app.showError(t("Failed to remove photo"))
  }
}

async function loadData() {
  const l = await app.showLoading()
  let res = await app.getDoc("Customer", app.route.params.name)
  if (res.data) {
    data.value = res.data
  }
  await l.dismiss()
}

async function onRefresh() {
  const l = await app.showLoading()
  const res = await app.getDoc("Customer", app.route.params.name)
  if (res.data) {
    data.value = res.data
  }
  await l.dismiss()
}

onMounted(async () => {
  const index = Math.floor(Math.random() * bgImages.length)
  randomBgImage.value = bgImages[index]
  await loadData()
})
</script>

<style scoped>
.profile-header {
  position: relative;
  height: 300px;
  background-color: #f0f0f0;
}

.header-background {
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
}

.avatar-wrapper {
  position: absolute;
  left: 50%;
  bottom: -70px;
  transform: translateX(-50%);
  z-index: 2;
}

.custom-avatar {
  width: 150px;
  height: 150px;
  border: 1px solid white;
  overflow: hidden;
  background-color: white;
  z-index: 2;
}

.trash-icon {
  position: absolute;
  top: -2px;
  right: 20px;
  background: white;
  border-radius: 50%;
  font-size: 20px;
  padding: 5px;
  color: red;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 5;
}

.profile-name {
  margin-top: 80px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

ion-item {
  --background: transparent;
}
</style>
