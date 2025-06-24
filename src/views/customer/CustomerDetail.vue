<template>
  <ion-page>
    <ToolBar>
      {{ t("Customer Detail") }} - {{ data?.name }}
    </ToolBar>
 
    <ion-content >
      <!-- Header with background image -->
      <div class="profile-header">
        <div class="header-background"></div>
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
        
        <ComViewCard/>
        <!-- Segment -->
        <ComSegment />
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

async function loadData() {
  const l = await app.showLoading();
  let res = await app.getDoc("Customer", app.route.params.name);
  if (res.data) {
    data.value = res.data;
  }
  await l.dismiss();
}

onMounted(async () => {
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
  background-image: url('https://picsum.photos/1920/500?blur');
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  
}

/* Avatar */
.custom-avatar {
  width: 150px;
  height: 150px;
  /* border: 4px solid white; */
  
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
