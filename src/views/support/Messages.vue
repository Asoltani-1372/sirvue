<template>
  <div class="support-messages">
    <Card class="w-full xl:w-1/3">
      <template #title>
        <Skeleton v-if="!status" width="5rem" />
        <p v-else>{{ subject }}</p>
      </template>
      <template #subtitle>
        <div v-if="status" class="flex justify-between">
          <Skeleton v-if="!status" />
          <p v-else>{{ type }}</p>
          <Skeleton v-if="!status" />
          <Tag v-else :value="status.title" :severity="status.severity" />
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <Skeleton v-if="!status" />
            <p v-else>تاریخ ایجاد</p>
            <Skeleton v-if="!status" />
            <p v-else>{{ date_created }}</p>
          </div>
          <div class="flex justify-between">
            <Skeleton v-if="!status" />
            <p v-else>آخرین بروزرسانی</p>
            <Skeleton v-if="!status" />
            <p v-else>{{ date_update }}</p>
          </div>
        </div>
      </template>
    </Card>
    <Card class="w-full xl:w-auto flex-grow px-3">
      <template #title>پیام‌ها</template>
      <template #content>
        <div class="messages-frame" dir="ltr" ref="messages">
          <Message
            v-for="message in messages"
            :key="message"
            :input="message"
            @call="setStars($event)"
            dir="rtl"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <Button
            v-if="status && status.type != 'closed'"
            label="ارسال پیام"
            class="p-button p-button-success p-button-sm"
            @click="$refs.sendMessage.open(id)"
          />
        </div>
      </template>
    </Card>
    <SendMessage ref="sendMessage" @call="getMessages()" />
  </div>
</template>

<script>
import Message from "./Message.vue";
import SendMessage from "./SendMessage.vue";
import TicketService from "../../service/ticket.js";
export default {
  components: { Message, SendMessage },
  data() {
    return {
      ticketService: null,
      id: null,
      messages: [{ isUser: true }, {}],
      subject: null,
      type: null,
      date_created: null,
      date_update: null,
      status: null,
      statuses: {
        pendingSupport: { title: "درانتظار پاسخ پشتیبان", severity: "warning" },
        pendingUser: { title: "پاسخ داده شده", severity: "success" },
        closed: { title: "بسته شده", severity: "info" },
      },
    };
  },
  created() {
    this.ticketService = new TicketService();
  },
  mounted() {
    this.getMessages();
  },
  methods: {
    getMessages() {
      this.id = this.$route.params.id;
      this.ticketService.getMessages(
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
    setStars(message) {
      this.ticketService.setStars(
        message,
        () => {
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "باموفقیت ثبت شد",
            life: 3000,
          });
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
  @apply flex w-full gap-8 items-start flex-col xl:flex-row;
}

.messages-frame {
  max-height: 60vh;
  @apply w-full bg-gray-50 rounded-lg overflow-auto flex flex-col gap-8 xl:p-8;
}

.messages-frame::-webkit-scrollbar {
  @apply w-2;
}

.messages-frame::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-500;
}
</style>