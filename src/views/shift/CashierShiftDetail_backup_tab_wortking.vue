<template>
  <ion-page>
    <ToolBar>Shift Detail</ToolBar>

    <ion-content fullscreen class="no-scroll">
      <div class="tabs-container">
        <div ref="tabBar" class="tab-bar">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{ active: activeIndex === index }"
            @click="onTabClick(index)"
          >
            {{ tab.label }}
          </div>

          <div
            class="tab-indicator"
            :style="{
              width: indicatorWidth + 'px',
              transform: `translateX(${indicatorX}px)`
            }"
          />
        </div>

        <div class="swiper-wrapper-container">
          <Swiper
            :slides-per-view="1"
            :space-between="0"
            @slideChange="onSlideChange"
            :onSwiper="setSwiper"
            class="swiper-content"
          >
            <SwiperSlide v-for="(tab, i) in tabs" :key="'s' + i">
              <div class="tab-content">{{ tab.content }}</div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const tabs = [
  { label: 'Home', content: '🏠 Home content' },
  { label: 'Profile', content: '👤 Profile content' },
  { label: 'Analytics Overview', content: '📊 Analytics content' },
  { label: 'Messages', content: '💬 Messages content' },
  { label: 'Settings', content: '⚙️ Settings content' },
  { label: 'Extra Long Tab Name', content: '🔎 Extra long content' }
]

const activeIndex = ref(0)
const swiperRef = ref(null)
const tabBar = ref(null)
const indicatorWidth = ref(0)
const indicatorX = ref(0)

const setSwiper = (swiper) => (swiperRef.value = swiper)

const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex
  nextTick(() => updateIndicator(true))
}

const onTabClick = (index) => {
  activeIndex.value = index
  swiperRef.value?.slideTo(index)
  nextTick(() => updateIndicator(true))
}

function updateIndicator(scrollIntoView = false) {
  const bar = tabBar.value
  if (!bar) return

  const activeTab = bar.querySelector('.tab-item.active')
  if (!activeTab) return

  const barRect = bar.getBoundingClientRect()
  const tabRect = activeTab.getBoundingClientRect()

  // set indicator width & position
  indicatorWidth.value = tabRect.width
  indicatorX.value = tabRect.left - barRect.left + bar.scrollLeft

  if (scrollIntoView) {
    const targetScroll = bar.scrollLeft + tabRect.left - barRect.left - bar.clientWidth / 2 + tabRect.width / 2
    const maxScroll = bar.scrollWidth - bar.clientWidth
    const finalScroll = Math.max(0, Math.min(maxScroll, targetScroll))
    bar.scrollTo({ left: finalScroll, behavior: 'smooth' })
  }
}

onMounted(() => {
  nextTick(() => updateIndicator())
  window.addEventListener('resize', () => nextTick(() => updateIndicator()))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => nextTick(() => updateIndicator()))
})
</script>

<style scoped>
.no-scroll::part(scroll) { overflow: hidden !important; }

.tabs-container { display: flex; flex-direction: column; height: 100%; background: #fff; }

.tab-bar {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  border-bottom: 2px solid #eee;
  position: relative;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.tab-bar::-webkit-scrollbar { display: none; }

.tab-item {
  flex: 0 0 auto;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: color 0.2s;
}
.tab-item.active { color: #007bff; }

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #007bff;
  transition: transform 0.25s cubic-bezier(.22,.9,.38,1), width 0.25s cubic-bezier(.22,.9,.38,1);
}

.swiper-wrapper-container { flex: 1; height: 100%; display: flex; }
.swiper-content { flex: 1; height: 100%; }

.tab-content {
  display: flex;
  height: 100%;
}
</style>
