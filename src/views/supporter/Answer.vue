<template>
  <div>
    <Dialog
      :visible="sendMessageDialog"
      class="max-w-2xl w-full"
      header="ارسال پیام"
      :modal="true"
      :closable="false"
    >
      <div class="confirmation-content flex-col gap-3 items-center p-1">
        <Textarea v-model="content" placeholder="توضیحات" class="w-full" rows="7" />
        <FileUpload
          name="demo[]"
          url="./upload.php"
          @upload="onUpload"
          :multiple="true"
          accept="image/*"
          :maxFileSize="1000000"
          chooseLabel="انتخاب فایل"
          :showUploadButton="false"
          :showCancelButton="false"
          class="w-full"
        />
      </div>
      <template #footer>
        <div class="flex justify-between w-full">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="closeDialog()"
          />
          <Button
            label="ارسال"
            class="p-button-success p-button-sm"
            @click="sendMessage()"
            :loading="loading"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import SupporterService from "../../service/supporter.js";
export default {
  data() {
    return {
      sendMessageDialog: false,
      ticket: null,
      content: null,
      attachs: null,
      loading: false,
      supporterService: null
    };
  },
  created(){
    this.supporterService = new SupporterService()
  },
  methods: {
    open(ticket) {
      this.ticket = ticket;
      this.sendMessageDialog = true;
    },
    closeDialog() {
      this.loading = false;
      this.content = null;
      this.attachs = null;
      this.sendMessageDialog = false;
    },
    onUpload() {
      this.$toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
      });
    },

    sendMessage() {
      this.loading = true;
      const data = {
        ticket: this.ticket,
        content: this.content,
        attachs: this.attachs,
      };

      this.supporterService.sendMessage(
        data,
        () => {
          this.closeDialog();
          this.$emit("call", "");
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "پیام‌تان باموفقیت ارسال شد",
            life: 3000,
          });
        },
        (error) => {
          this.loading = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
  },
};
</script>

<style>
.p-fileupload {
  @apply w-full;
}
.p-fileupload > div > span {
  @apply max-w-max text-sm;
}

.p-fileupload-content {
  @apply p-0 !important;
}
.p-fileupload-buttonbar {
  @apply p-2 !important;
}
.p-fileupload-files {
  @apply text-xs;
}

.p-fileupload-files button {
  @apply bg-white text-right hover:bg-gray-100 rounded-full text-red-700 border-0 !important;
}
</style>