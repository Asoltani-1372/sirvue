<template>
  <div>
    <Dialog
      :visible="ticketDialog"
      class="max-w-2xl lg:w-full w-11/12"
      header="تیکت جدید"
      :modal="true"
      :closable="false"
    >
      <div class="confirmation-content flex-col gap-3 items-center p-1">
        <InputText
          v-model="subject"
          class="w-full"
          placeholder="عنوان را وارد نمایید"
          :class="{ 'p-invalid': errors.subject }"
        />
        <p class="text-xs text-red-600 self-start">{{ errors.subject }}</p>
        <Dropdown
          v-model="type"
          :options="input"
          optionLabel="title"
          class="w-full"
          placeholder="پشتیبانی مربوطه"
          :class="{ 'p-invalid': errors.type }"
        />
        <p class="text-xs text-red-600 self-start">{{ errors.type }}</p>
        <Textarea
          v-model="content"
          placeholder="توضیحات"
          class="w-full"
          rows="7"
          :class="{ 'p-invalid': errors.content }"
        />
        <p class="text-xs text-red-600 self-start">{{ errors.content }}</p>
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
          class="w-full hidden"
        />
      </div>
      <template #footer>
        <div class="flex justify-between w-full">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="close()"
          />
          <Button
            label="ارسال پیام"
            class="p-button-success p-button-sm"
            @click="sendTicket()"
            :loading="loading"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import TicketService from "../../service/ticket.js";
export default {
  props: ["input"],
  data() {
    return {
      ticketDialog: false,
      type: null,
      subject: "",
      content: "",
      ticketService: null,
      errors: {},
      loading: false,
    };
  },
  created() {
    this.ticketService = new TicketService();
  },
  methods: {
    open() {
      this.ticketDialog = true;
    },
    close() {
      this.ticketDialog = false;
      this.subject = null;
      this.type = null;
      this.content = null;
    },
    sendTicket() {
      if (this.subject.length < 5) {
        this.errors.subject = "عنوان باید حداقل 5 حرف باشد";
      } else if (!this.type) {
        this.errors.type = "پشتیبانی مربوطه را انتخاب نمایید";
      } else if (this.content.length < 15) {
        this.errors.content = "توضیحات  باید حداقل 15 حرف باشد";
      } else {
        this.loading = true;
        const ticket = {
          subject: this.subject,
          type: this.type.id,
          content: this.content,
        };
        this.ticketService.sendTicket(
          ticket,
          () => {
            this.loading = false;
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "تیکت '" + this.subject + "' باموفقیت ایجاد شد",
              life: 3000,
            });
            this.$emit("call", "");
            this.close();
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
      }
    },
  },
  watch: {
    subject(v) {
      if (v) this.errors.subject = null;
      else this.errors.subject = "عنوان نمیتواند خالی باشد";
    },

    type() {
      this.errors.type = null;
    },

    content(v) {
      if (v) this.errors.content = null;
      else this.errors.content = "توضیحات نمیتواند خالی باشد";
    },
  },
};
</script>

<style>
.p-fileupload {
  @apply w-full;
}
.p-fileupload > div > span {
  @apply max-w-max bg-green-600 text-sm;
}
.p-fileupload > div > span:hover {
  @apply bg-green-700 !important;
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