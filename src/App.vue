<template>
  <div class="app">
    <router-view />
    <Toast position="top-left" class="z-50" />
    <ConfirmDialog class="w-11/12 lg:w-1/3 md:w-1/2" :draggable="false" :closable="false" />
  </div>
</template>

<script>
export default {

};
</script>


<style scoped>
.app {
  @apply min-h-screen ;
}
</style>
