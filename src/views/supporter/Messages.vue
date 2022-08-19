<template>
  <div class="support-messages">
    <Card class="w-1/3">
      <template #title>
        <p>{{ subject }}</p>
      </template>
      <template #subtitle>
        <div v-if="status" class="flex justify-between">
          <p>{{ type }}</p>
          <Tag :value="status.title" :severity="status.severity" />
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <p>تاریخ ایجاد</p>
            <p>{{ date_created }}</p>
          </div>
          <div class="flex justify-between">
            <p>آخرین بروزرسانی</p>
            <p>{{ date_update }}</p>
          </div>
        </div>
      </template>
    </Card>
    <Card class="flex-grow px-3">
      <template #title>پیام‌ها</template>
      <template #content>
        <div class="messages-frame" dir="ltr" ref="messages">
          <Message
            v-for="message in messages"
            :key="message"
            :input="message"
            @call="setStar($event)"
            dir="rtl"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <Button
            v-if="status && status.type != 'closed'"
            label="بستن تیکت"
            icon="pi pi-check"
            class="p-button-outlined p-button-success"
            @click="confirmCloseTicket(id)"
          />
          <Button
            v-if="status && status.type != 'closed'"
            label="پاسخ دهید"
            class="p-button p-button-info"
            @click="$refs.answer.open(id)"
          />
        </div>
      </template>
    </Card>
    <Answer ref="answer" @call="getMessages()" />
    <!-- <ConfirmDialog class="w-3/12" /> -->
  </div>
</template>

<script>
import Message from "./Message.vue";
import Answer from "./Answer.vue";
import SupporterService from "../../service/supporter.js";
export default {
  components: { Message, Answer },
  data() {
    return {
      supporterService: null,
      id: null,
      messages: [{ isUser: true }, {}],
      subject: null,
      type: null,
      date_created: null,
      date_update: null,
      status: null,
      statuses: {
        pendingSupport: { title: "درانتظار پاسخ", severity: "warning" },
        pendingUser: { title: "درانتظار کاربر", severity: "info" },
        closed: { title: "بسته شده", severity: "success" },
      },
    };
  },
  created() {
    this.supporterService = new SupporterService();
  },
  mounted() {
    this.getMessages();
  },
  methods: {
    getMessages() {
      this.id = this.$route.params.id;
      this.supporterService.getMessages(
        this.id,
        (data) => {
          this.messages = data.messages;
          this.subject = data.ticket.subject;
          this.type = data.ticket.type;
          this.date_created = data.ticket.date_created;
          this.date_update = data.ticket.date_update;
          this.status = this.statuses[data.ticket.status];
          this.status.type = data.ticket.status;
          setTimeout(() => {
            this.$refs.messages.scrollBy({
              top: 1000000,
              left: 0,
              behavior: "smooth",
            });
          }, 100);
        },
        () => {}
      );
    },

    confirmCloseTicket(id) {
      this.$confirm.require({
        message: "آیا از بستن این تیکت اطمینان دارید؟",
        header: "بستن تیکت",
        icon: "pi pi-check",
        position: "bottom",
        acceptLabel: "بسته شود",
        rejectLabel: "بازگشت",
        accept: () => {
          this.closeTicket(id);
        },
        reject: () => {},
      });
    },
    closeTicket(id) {
      this.supporterService.closeTicket(
        { ticket: id },
        () => {
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "با موفقیت بشته شد",
            life: 3000,
          });
          this.$router.go(-1);
        },
        (error) => {
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

<style scoped>
.support-messages {
  @apply flex gap-8 items-start;
}

.messages-frame {
  max-height: 60vh;
  @apply w-full bg-gray-50 rounded-lg overflow-auto flex flex-col gap-8 p-8;
}

.messages-frame::-webkit-scrollbar {
  @apply w-2;
}

.messages-frame::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-500;
}
</style>

<style>
.p-dialog-footer {
  @apply flex justify-between !important;
}
</style>