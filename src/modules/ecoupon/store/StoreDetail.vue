<template>
    <ion-page>
        <ToolBar>{{ t("Store Detail") }} - {{ data?.name || 0}}</ToolBar>
        <ion-content>  
            <!-- {{ data }} -->
              
      <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

            <div class="profile-header">
        <div
          class="header-background"
          :style="{ backgroundImage: `url('${randomBgImage}')` }"
        ></div>

       
        <div class="avatar-wrapper">
           
           <ion-avatar class="custom-avatar" style="cursor: pointer">
                    <Img v-if="data?.image" :src="data?.image" />
                    <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.vendor_name) }}
                    </div>
            </ion-avatar>
         
         
        </div>
      </div>
  
      <div class="profile-name">
        {{ data?.name }} - {{ data?.vendor_name }}
      </div>
      <div class="fix-container">
        <ComViewStoreCard />
        <ComStoreSegment :data="data" />
      </div>
        </ion-content>
<ComStoreFooter />
    </ion-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'

import { getAvatarLetter } from "@/helpers/utils"
import ComViewStoreCard from '@/modules/ecoupon/store/components/ComViewStoreCard.vue'
import ComStoreSegment from '@/modules/ecoupon/store/components/ComStoreSegment.vue'
import ComStoreFooter from '@/modules/ecoupon/store/components/ComStoreFooter.vue'
const t = window.t

const data = ref(null)

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



async function loadData() {
  const l = await app.showLoading()

  const res = await app.getDoc("Vendor", app.route.params.name)
  if (res.data) data.value = res.data

  await l.dismiss()
}

async function onRefreshData(event) {
  await loadData()
  event.target.complete() // Finish the refresh animation
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
