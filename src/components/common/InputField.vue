<template>
  <div class="p-field p-col-12 p-md-4">
    <span class="p-float-label">
      <InputNumber
        v-if="input.type == 'number'"
        id="input"
        v-model="value"
        @input="$emit('update:modelValue', $event.value)"
        class="w-full"
        :format="input.format"
        :max="input.max"
        :class="{ 'p-invalid': input.error }"
      />
      <InputText
        id="input"
        v-else-if="input.type == 'text'"
        v-model="value"
        @input="$emit('update:modelValue', $event.value)"
        type="text"
        class="w-full"
        :class="{ 'p-invalid': input.error }"
        ref="input"
      />
      <label for="input" class="right-2">{{ input.label }}</label>
    </span>
    <p v-if="input.error" class="error-text">{{ input.error }}</p>
  </div>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      value: this.input.value,
    };
  },
  mounted() {
    this.$refs["input"].$el.focus();
  },
};
</script>

<style>
</style>