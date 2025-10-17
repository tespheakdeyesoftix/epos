<template>
     <div>Page 1</div>
    </template>
    <script setup>

 
 // Expose the refresh method to parent
 function refresh(){
     alert("u refresh me from page 1")
 }
defineExpose({
  refresh
})
 </script>