<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      class="max-w-3xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <!-- TypeError: _this.requests.forEach is not a function -->
      <template #header>
        <div class="text-lg font-bold">تخصیص خدمت دهنده</div>
      </template>
      <div class="flex justify-center w-full gap-8">
        <div
          class="flex flex-col gap-3 w-1/2"
          v-if="$route.path.split('/')[1] == 'allocator'"
        >
          <div>خدمت دهندگان سیرنگ</div>
          <Listbox
            v-model="sirangSelect"
            :options="sirangServants"
            :multiple="false"
            optionLabel="name"
            listStyle="max-height:250px"
            class="w-full"
            filterPlaceholder="جستجو"
          >
            <template #empty>
              <p class="text-center w-full text-sm py-4">
                موردی جهت نمایش وجود ندارد
              </p>
            </template>
            <template #option="slotProps">
              <div class="flex gap-3 text-sm items-center">
                <Avatar
                  shape="circle"
                  :image="slotProps.option.avatar"
                  size="large"
                />
                <p>{{ slotProps.option.firstname }}</p>
                <p>{{ slotProps.option.lastname }}</p>
                <p>- {{ slotProps.option.distance / 1000 }} کیلومتر فاصله</p>
              </div>
            </template>
          </Listbox>
        </div>
        <div class="flex flex-col gap-3 w-1/2">
          <div>
            {{
              $route.path.split("/")[1] == "company"
                ? "خدمت دهندگان"
                : "سایر خدمت دهندگان"
            }}
          </div>
          <Listbox
            v-model="otherSelect"
            :options="otherServants"
            :multiple="false"
            optionLabel="dk"
            listStyle="max-height:250px"
            class="w-full"
            filterPlaceholder="جستجو"
          >
            <template #empty>
              <p class="text-center w-full text-sm py-4">
                موردی جهت نمایش وجود ندارد
              </p>
            </template>
            <template #option="slotProps">
              <div class="flex gap-3 text-sm items-center">
                <Avatar
                  shape="circle"
                  :image="slotProps.option.avatar"
                  size="large"
                />
                <p>{{ slotProps.option.firstname }}</p>
                <p>{{ slotProps.option.lastname }}</p>
                <p>- {{ slotProps.option.distance / 1000 }} کیلومتر فاصله</p>
              </div>
            </template>
          </Listbox>
        </div>
      </div>
      <div class="p-inputgroup mt-4" dir="ltr">
        <span class="p-inputgroup-addon border-l border-r-0">تومان</span>
        <InputNumber
          v-model="transport"
          class="p-inputtext-sm w-auto"
          placeholder="هزینه ایاب و ذهاب"
        />
      </div>

      <!-- <div class="p-inputgroup mt-4" dir="ltr">
        <span class="p-inputgroup-addon border-l border-r-0">تومان</span>
        <InputNumber
          v-model="price"
          class="p-inputtext-sm w-auto"
          placeholder="هزینه خدمت"
        />
      </div> -->

      <template #footer>
        <div class="flex justify-between">
          <div>
            <Button
              label="بازگشت"
              class="p-button-text p-button-info p-button-sm"
              @click="closeDialog()"
              :disabled="loading || publishing"
            />
          </div>
          <div>
            <Button
              label="تخصیص داده شود"
              class="p-button-raised p-button-success p-button-sm"
              @click="allocate()"
              :loading="loading"
              :disabled="(!sirangSelect && !otherSelect) || transport == null"
            />
            <Button
              v-if="$route.path.split('/')[1] == 'company'"
              label="واگذاری به سامانه"
              class="p-button-raised p-button-help p-button-sm"
              @click="transfer()"
              :loading="transferring"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import AllocatorService from "../../../service/allocator";

export default {
  data() {
    return {
      allocatorService: null,
      sirangServants: [],
      otherServants: [],
      dialog: false,
      loading: false,
      transferring: false,
      availableServants: null,
      sirangSelect: null,
      otherSelect: null,
      serviceRequest: null,
      transport: 0,
      //price: 0,
      errors: {},
    };
  },

  methods: {
    open(data) {
      this.transport = 0;
      //let price = data.price + "";
      //price = price.replaceAll(",", "");
      //this.price = parseInt(price);
      this.getServant(data.id);
    },

    getServant(id) {
      this.allocatorService.nearest(
        id,
        (data) => {
          this.$parent.loading = false;
          this.serviceRequest = id;
          this.dialog = true;
          data.servants.forEach((element) => {
            if (element.sirang) this.sirangServants.push(element);
            else this.otherServants.push(element);
          });
          this.showPagination = true;
        },
        (error) => {
          this.$parent.loading = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },

    allocate() {
      this.loading = true;
      let servant;
      if (this.sirangSelect) servant = this.sirangSelect.id;
      else servant = this.otherSelect.id;
      setTimeout(() => {
        const data = {
          servant,
          id: this.serviceRequest,
          transport: this.transport,
          //price: this.price,
        };
        if (this.transport == null) {
          this.errors.transport = "هزینه ایاب و ذهاب را وارد کنید";
        } else {
          this.allocatorService.allocate(
            data,
            () => {
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "با موفقیت تخصیص داده شد",
                life: 3000,
              });
              this.$emit("call", "");
              this.closeDialog();
              const role = this.$route.path.split("/")[1];
              if (role == "allocator") {
                this.$router.push("/allocator/allocated");
              }
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
      }, 100);
    },

    closeDialog() {
      this.sirangServants = [];
      this.otherServants = [];
      this.sirangSelect = null;
      this.otherSelect = null;
      this.publishing = false;
      this.loading = false;
      this.dialog = false;
    },

    transfer() {
      this.$confirm.require({
        message: "آیا از واگذاری این درخواست اطمینان دارید؟",
        header: "هشدار",
        icon: "pi pi-check",
        acceptLabel: "واگذار شود",
        acceptClass: "p-button-success p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.transferring = true;
          this.allocatorService.transfer(
            this.serviceRequest,
            () => {
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "باموفقیت واگذار شد",
                life: 3000,
              });
              this.$emit("call", this.request);
              this.transferring = false;
              this.dialog = false;
            },
            (error) => {
              this.transferring = false;
              this.$toast.add({
                severity: "error",
                summary: "خطا",
                detail: error,
                life: 3000,
              });
            }
          );
        },
        reject: () => {},
      });
    },
  },

  created() {
    this.allocatorService = new AllocatorService();
  },

  mounted() {},

  watch: {
    transport(v) {
      if (v == null)
        this.errors.transport = "هزینه ایاب و ذهاب نمی تواند خالی باشد.";
      else this.errors.transport = "";
    },
  },
};
</script>

<style>
</style>