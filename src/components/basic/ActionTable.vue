<template>
  <div class="flex justify-center" v-if="editing">
    <Button
      class="p-button-success p-button-text p-button-rounded"
      icon="pi pi-check"
      @click="$emit('save', '')"
    />
    <Button
      class="p-button-secondery p-button-text p-button-rounded"
      icon="pi pi-times"
      @click="$emit('cancel', '')"
    />
  </div>
  <div v-else class="flex justify-center">
    <Button
      class="p-button-secondery p-button-text p-button-rounded"
      icon="pi pi-pencil"
      @click="$emit('edit', '')"
    />
    <Button
      class="p-button-danger p-button-text p-button-rounded"
      icon="pi pi-trash"
      @click="$emit('destroy', $event)"
    />
  </div>
</template>

<script>
export default {
  props: ["editing"],
};
</script>

<style>
</style>