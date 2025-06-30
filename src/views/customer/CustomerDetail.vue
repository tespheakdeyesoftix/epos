<template>
  <ion-page>
    <ToolBar>
      {{ t("Customer Detail") }} - {{ data?.name }}
    </ToolBar>
 
    <ion-content >
      <!-- Header with background image -->
      <div class="profile-header">
         <div
          class="header-background"
          :style="{ backgroundImage: `url('${randomBgImage}')` }"
        ></div>
        <ion-avatar class="custom-avatar">
          <Img v-if="data?.photo" :src="data?.photo" />
          <div class="avatar-placeholder" v-else>{{ getAvatarLetter(data?.customer_name_en) }}</div>
        </ion-avatar>
      </div>

      <!-- Name below avatar -->
      <div class="profile-name">
        {{ data?.name }} - {{ data?.customer_name_en }}
      </div>

      <!-- Info Cards -->
      <div class="fix-container">
        
        <ComViewCard />
        <!-- Segment -->
        <ComSegment :data="data"/>
      </div>
    
    </ion-content>
      <ComCustomerFooter/>
  </ion-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ComSegment from "@/views/customer/components/ComSegment.vue";
import ComCustomerFooter from "@/views/customer/components/ComCustomerFooter.vue";
import ComViewCard from "@/views/customer/components/ComViewCard.vue";
import { getAvatarLetter } from "@/helpers/utils";
const data = ref();
import dayjs from 'dayjs';
const t = window.t;

const bgImages = [
  "/assets/back2.jpg",
  "/assets/back3.jpg",
  "/assets/back9.jpg",
  "/assets/back10.jpg"
];
const randomBgImage = ref("");

async function loadData() {
  const l = await app.showLoading();
  let res = await app.getDoc("Customer", app.route.params.name);
  if (res.data) {
    data.value = res.data;
  }
  await l.dismiss();
}

onMounted(async () => {

  const index = Math.floor(Math.random() * bgImages.length);
  randomBgImage.value = bgImages[index];
  console.log("Random background image:", randomBgImage.value);

  await loadData();
});
</script>

<style scoped>
/* Header section */
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

/* Avatar */
.custom-avatar {
  width: 150px;
  height: 150px;
  border: 1px solid white;
  
  overflow: hidden;
  position: absolute;
  left: 50%;
  bottom: -70px;
  transform: translateX(-50%);
  background-color: white;
  z-index: 2;
}

/* Name */
.profile-name {
  margin-top: 80px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

/* Optional fixes */
ion-item {
  --background: transparent;
}
</style>
