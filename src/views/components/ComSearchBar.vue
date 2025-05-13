<template>
  
    <ion-searchbar 
    class="ion-no-padding"
      :placeholder="t('Search')" 
      @click="expandModal" 
      v-model="keyword"
      @ionInput="debouncedSearch"
    ></ion-searchbar>
  </template>
  
  <script setup lang="ts">
    import { ref } from "vue";
    import { debounce } from 'lodash';
  const t= window.t;
    const emit = defineEmits();
    const keyword = ref<string>('');
  
    function onExpandModal() {
      emit("click");
    }
  
    
    const debouncedSearch = debounce(() => {
      emit("onSearch", keyword.value);   
    }, 1000);  
  </script>
  