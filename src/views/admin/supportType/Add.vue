<template>
  <Card>
    <template #title> افزودن نوع پشتیبانی  </template>
    <template #content>
      <div class="flex flex-col gap-3">
        <InputText
          type="text"
          v-model="value"
          placeholder="افزودن نوع پشتیبانی"
          class="w-full"
        />
        <div class="flex justify-end">
          <Button label="افزودن" class="p-button-success p-button-sm" icon="pi pi-plus"/>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
export default {};
</script>

<style>
</style>