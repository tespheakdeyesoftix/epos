<template>
     <div>Page 1</div>
    </template>
    <script setup>

 console.log("page 1 loaded")
 // Expose the refresh method to parent
 function refresh(){
     alert("u refresh me from page 1")
 }
defineExpose({
  refresh
})
 </script>