<template>
 
  <div ref="tabBar" class="tab-bar"   v-if="tabs.length>1">
      <div
        v-for="(tab, index) in tabs"
       
        :key="index"
        class="tab-item"
        :class="{
          active: activeIndex === index,
          disabled: tab.disabled
        }"
        :style="getTabStyle(tab, index)"
        @click="!tab.disabled && onTabClick(index)"
      >
        <!-- Icon -->
        <div v-if="tab.icon || tab.iconClass || tab.iconUrl" class="tab-icon">
          <ion-icon v-if="tab.icon" :icon="tab.icon"></ion-icon>
          <i v-else-if="tab.iconClass" :class="tab.iconClass"></i>
          <img v-else-if="tab.iconUrl" :src="tab.iconUrl" class="custom-icon" />
        </div>
        
        <!-- Label -->
        <span class="tab-label" :style="getLabelStyle(tab, index)">
          {{ tab.label }}
        </span>

        <!-- Badge -->
        <span v-if="tab.badge !== undefined && tab.badge !== null" class="tab-badge" :class="tab.badgeClass">
          {{ tab.badge }}
        </span>
      </div>

      <div
        
        class="tab-indicator"
        :style="{
          width: indicatorWidth + 'px',
          transform: `translateX(${indicatorX}px)`,
          backgroundColor: activeTab?.indicatorColor || indicatorColor
        }"
      />
    </div>
  <div class="tabs-container">
    <!-- Customizable Tab Headers -->
    

    <!-- Lazy Loaded Content with Caching -->
    <div class="swiper-wrapper-container">
      <Swiper
        :slides-per-view="1"
        :space-between="0"
        @slideChange="onSlideChange"
        :onSwiper="setSwiper"
        class="swiper-content"
      >
        <SwiperSlide v-for="(tab, i) in tabs" :key="'tab-' + i">
          <div class="tab-content">
            <!-- Show cached component if already loaded -->
            <div v-if="isTabLoaded(i)" class="cached-tab">
              <component
                :is="tab.component"
                v-bind="tab.props || {}"
                :ref="el => setComponentRef(el, i)"
              ></component>
            </div>
            
            <!-- Show component for first load -->
            <component
              v-else-if="isTabActive(i)"
              :is="tab.component"
              v-bind="tab.props || {}"
              :ref="el => setComponentRef(el, i)"
            ></component>
            
            <!-- Simple content -->
            <div v-else-if="tab.content && isTabActive(i)">
              {{ tab.content }}
            </div>
            
            <!-- Loading placeholder -->
            <div v-else class="tab-placeholder">
              {{ tab.placeholder || `Select ${tab.label} to load content` }}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, computed, shallowRef } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return value.every(tab => tab.label && (tab.component || tab.content !== undefined))
    }
  },
  initialTab: {
    type: Number,
    default: 0
  },
  indicatorColor: {
    type: String,
    default: '#007bff'
  },
  lazyLoad: {
    type: Boolean,
    default: true
  },
  cacheComponents: {
    type: Boolean,
    default: true // NEW: Cache loaded components
  },
  // Global styling
  tabStyle: {
    type: Object,
    default: () => ({})
  },
  activeTabStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['tab-change', 'tab-refresh', 'component-loaded'])

// Refs
const activeIndex = ref(props.initialTab)
const swiperRef = ref(null)
const tabBar = ref(null)
const indicatorWidth = ref(0)
const indicatorX = ref(0)
const tabComponents = ref([])
const loadedTabs = shallowRef(new Set([props.initialTab])) // Track loaded tabs
const cachedTabs = shallowRef(new Set()) // NEW: Track cached tabs

// Computed
const activeTab = computed(() => props.tabs[activeIndex.value])

// Check if tab is currently active
const isTabActive = computed(() => (index) => {
  if (!props.lazyLoad) return true
  return activeIndex.value === index
})

// NEW: Check if tab is already loaded (for caching)
const isTabLoaded = computed(() => (index) => {
  return props.cacheComponents && loadedTabs.value.has(index)
})

// Styling methods
const getTabStyle = (tab, index) => {
  const isActive = activeIndex.value === index
  const styles = { ...props.tabStyle }
  
  if (tab.tabStyle) Object.assign(styles, tab.tabStyle)
  
  if (isActive) {
    Object.assign(styles, props.activeTabStyle)
    if (tab.activeTabStyle) Object.assign(styles, tab.activeTabStyle)
    if (tab.activeColor) styles.color = tab.activeColor
  } else {
    if (tab.color) styles.color = tab.color
  }
  
  if (tab.disabled) {
    styles.opacity = '0.5'
    styles.cursor = 'not-allowed'
  }
  
  return styles
}

const getLabelStyle = (tab, index) => {
  const isActive = activeIndex.value === index
  const styles = {}
  
  if (isActive && tab.activeLabelStyle) {
    Object.assign(styles, tab.activeLabelStyle)
  } else if (tab.labelStyle) {
    Object.assign(styles, tab.labelStyle)
  }
  
  return styles
}

// Core methods
const setSwiper = (swiper) => {
  swiperRef.value = swiper
}

const setComponentRef = (el, index) => {
  if (el) {
    tabComponents.value[index] = el
  }
}

const onSlideChange = (swiper) => {
  const newIndex = swiper.activeIndex
  activeIndex.value = newIndex
  
  // Mark the new tab as loaded when it becomes active
  if (!loadedTabs.value.has(newIndex)) {
    loadedTabs.value.add(newIndex)
    emit('component-loaded', newIndex, props.tabs[newIndex])
  }
  
  emit('tab-change', newIndex)
  
  nextTick(() => updateIndicator(true))
}

const onTabClick = (index) => {
  if (props.tabs[index]?.disabled) return
  
  activeIndex.value = index
  
  // Mark the tab as loaded when clicked
  if (!loadedTabs.value.has(index)) {
    loadedTabs.value.add(index)
    emit('component-loaded', index, props.tabs[index])
  }
  
  swiperRef.value?.slideTo(index)
  // emit('tab-change', index)
  // console.log("tab click")
  nextTick(() => updateIndicator(true))
}

// Refresh methods
const refreshCurrentTab = () => {
  const currentTabIndex = activeIndex.value
  const currentTabComponent = tabComponents.value[currentTabIndex]
  
 
  
  emit('tab-refresh', currentTabIndex)
  
  if (currentTabComponent && typeof currentTabComponent.refresh === 'function') {
    currentTabComponent.refresh()
    
    return true
  } else {
   
    return false
  }
}

const refreshTab = (index) => {
  if (index >= 0 && index < props.tabs.length) {
    const tabComponent = tabComponents.value[index]
    
    if (tabComponent && typeof tabComponent.refresh === 'function') {
      tabComponent.refresh()
     
      emit('tab-refresh', index)
      return true
    }
  }
  return false
}

// NEW: Force reload a tab (destroy and reload)
const reloadTab = (index) => {
  if (index >= 0 && index < props.tabs.length) {
    // Remove from loaded tabs to force reload
    loadedTabs.value.delete(index)
    tabComponents.value[index] = null
    
    // If it's the current tab, reload immediately
    if (activeIndex.value === index) {
      nextTick(() => {
        loadedTabs.value.add(index)
      })
    }
    
    
    return true
  }
  return false
}

// Navigation methods
const slideTo = (index) => {
  if (index >= 0 && index < props.tabs.length && !props.tabs[index]?.disabled) {
    onTabClick(index)
  }
}

const next = () => {
  let nextIndex = (activeIndex.value + 1) % props.tabs.length
  while (props.tabs[nextIndex]?.disabled && nextIndex !== activeIndex.value) {
    nextIndex = (nextIndex + 1) % props.tabs.length
  }
  if (!props.tabs[nextIndex]?.disabled) {
    onTabClick(nextIndex)
  }
}

const previous = () => {
  let prevIndex = (activeIndex.value - 1 + props.tabs.length) % props.tabs.length
  while (props.tabs[prevIndex]?.disabled && prevIndex !== activeIndex.value) {
    prevIndex = (prevIndex - 1 + props.tabs.length) % props.tabs.length
  }
  if (!props.tabs[prevIndex]?.disabled) {
    onTabClick(prevIndex)
  }
}

// Indicator update
function updateIndicator(scrollIntoView = false) {
  const bar = tabBar.value
  if (!bar) return

  const activeTab = bar.querySelector('.tab-item.active')
  if (!activeTab) return

  const barRect = bar.getBoundingClientRect()
  const tabRect = activeTab.getBoundingClientRect()

  indicatorWidth.value = tabRect.width
  indicatorX.value = tabRect.left - barRect.left + bar.scrollLeft

  if (scrollIntoView) {
    const targetScroll = bar.scrollLeft + tabRect.left - barRect.left - bar.clientWidth / 2 + tabRect.width / 2
    const maxScroll = bar.scrollWidth - bar.clientWidth
    const finalScroll = Math.max(0, Math.min(maxScroll, targetScroll))
    bar.scrollTo({ left: finalScroll, behavior: 'smooth' })
  }
}

// Expose public methods
defineExpose({
  refreshCurrentTab,
  refreshTab,
  reloadTab, // NEW: Expose reload method
  slideTo,
  next,
  previous,
  activeIndex,
  getCurrentTabIndex: () => activeIndex.value,
  isTabLoaded: (index) => loadedTabs.value.has(index),
  getLoadedTabs: () => Array.from(loadedTabs.value) // NEW: Get list of loaded tabs
})

// Lifecycle
onMounted(() => {
  nextTick(() => updateIndicator())
  window.addEventListener('resize', () => nextTick(() => updateIndicator()))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => nextTick(() => updateIndicator()))
})
</script>

<style scoped>
/* Keep all your existing styles the same */
.tabs-container {
  display: flex;
  flex-direction: column;
  height: 100%;

}

.tab-bar {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
border-bottom : 2px solid #eee;
  position: relative;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  /* position: fixed; */
  z-index: 9999;
  width: 100%;
  background: #fff;

}
.tab-bar::-webkit-scrollbar {
  display: none;
}

.tab-item {
  
  flex: 0 0 auto;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}
.tab-item.active {
  color: #007bff;
}
.tab-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: color 0.3s ease;
}

.custom-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.tab-label {
  transition: color 0.3s ease;
}

.tab-badge {
  background: #ff3b30;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #007bff;
  transition: transform 0.25s cubic-bezier(.22,.9,.38,1), width 0.25s cubic-bezier(.22,.9,.38,1);
}

.swiper-wrapper-container {
  flex: 1;
  /* height: 100%; */
  display: flex;
}
.swiper-content {
  flex: 1;
  height: 100%;
  
}

.tab-content {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.cached-tab {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.tab-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
  padding: 20px;
  text-align: center;
}

.no-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}
</style>