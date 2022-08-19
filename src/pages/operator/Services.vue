<template>
  <Card class="w-full">
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>خدمات</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="servicesList.length > 0"
          class="p-button-text p-button-success p-button-sm"
          label="افزودن"
          icon="pi pi-plus"
          @click="addRow()"
          :disabled="flag"
        />
      </div>
    </template>
    <template #content>
      <DataTable
        :value="servicesList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="servicesList.length > 5"
        :rows="5"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
      >
        <template #empty>
          <p class="text-xs py-2">اولین خدمت را اضافه نمایید</p>
          <Button
            class="p-button-text p-button-success p-button-sm"
            icon="pi pi-plus"
            label="افزودن"
            @click="addRow()"
          />
        </template>
        <Column
          v-for="col of columns"
          :field="col.field"
          :key="col.field"
          :class="[col.width]"
        >
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>{{ col.header }}</p>
          </template>
          <template #editor="{ data, field, index }" v-if="col.editable">
            <div
              v-if="field == 'image'"
              class="flex justify-center items-center h-20"
            >
              <div class="flex justify-center" v-if="data.image">
                <Button
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger p-button-text"
                  @click="removeImage(data.id)"
                />
                <img
                  :src="
                    data.image.indexOf('blob:') > -1
                      ? data.image
                      : rootUrl + '/uploads/' + data.image
                  "
                  class="h-20"
                />
              </div>
              <FileUpload
                v-else
                mode="basic"
                name="file"
                :url="rootUrl + '/api/upload?state=service'"
                chooseLabel="انتخاب تصویر"
                class="p-button-sm p-button-success p-button-outlined"
                :auto="true"
                @before-send="beforeUpload"
                @upload="onUpload(data.id, index, $event)"
                @select="onSelect(index, $event)"
              />
            </div>

            <InputText
              v-if="field == 'title'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              class="p-inputtext-sm w-full"
              placeholder="عنوان خدمت را وارد نمایید"
              autofocus
            />
            <div v-if="field == 'price'" style="direction: ltr">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon border-r-0 border-l">
                  تومان
                </span>
                <InputNumber
                  v-model="data[field]"
                  :class="{ 'p-invalid': errors[field] }"
                  class="p-inputtext-sm w-full"
                  placeholder="قیمت پایه خدمت را وارد نمایید"
                  style="direction: rtl"
                />
              </div>
            </div>

            <Dropdown
              v-if="field == 'option'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              :options="options"
              class="p-inputtext-sm w-full"
              optionLabel="title"
              optionValue="id"
              placeholder="گزینه‌های خدمت را انتخاب نمایید"
            />
          </template>
          <template #body="{ data, field, index }">
            <div v-if="data.id" class="flex items-center justify-center h-20">
              <img
                v-if="field == 'image'"
                :src="
                  data.image.indexOf('blob:') > -1
                    ? data.image
                    : rootUrl + '/uploads/' + data.image
                "
                class="h-20"
              />
              <p v-if="field == 'title'">{{ data.title }}</p>
              <p v-if="field == 'price'">
                {{
                  data.price
                    .toFixed(3)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    .replace(".000", "")
                }} تومان
              </p>
              <p v-if="field == 'option' && options.length > 0">
                {{ options.filter((e) => e.id == data.option)[0].title }}
              </p>
              <InputSwitch
                v-if="field == 'status'"
                class="h-6"
                @input="changeStatus(data.id, $event, index)"
                v-model="data.status"
                :disabled="data.status == null"
              />
              <ActionTable
                v-if="field == 'action'"
                :editing="editingRows[data.id.toString()]"
                @edit="editRow(data)"
                @cancel="cancelRow(data)"
                @save="saveRow(data, index)"
                @destroy="destroy(data, index)"
              />
              
            </div>
            <div v-else class="flex items-center h-12"> 
              <Skeleton />
            </div>
          </template>
        </Column>
      </DataTable>
      <div class="flex items-center justify-center pt-4" v-if="fetching">
        <Skeleton width="24rem" height="3rem" />
      </div>
    </template>
  </Card>
</template>

<script>
import ServiceService from "../../service/operator/services.js";
import ActionTable from "../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  data() {
    return {
      columns: [
        { header: "تصویر", field: "image", width: "w-1/6", editable: true },
        { header: "عنوان", field: "title", width: "w-1/6", editable: true },
        {
          header: "قیمت پایه",
          field: "price",
          width: "w-1/5",
          editable: true,
        },
        {
          header: "گزینه‌ها",
          field: "option",
          width: "w-1/6",
          editable: true,
        },
        { header: "وضعیت", field: "status", width: "w-1/12" },
        { header: "عملیات", field: "action", width: "w-1/12" },
      ],
      fetching: true,
      servicesList: [{}, {}, {}],
      options: [],
      rootUrl: null,
      flag: false,
      serviceService: null,
      editingRows: {},
      errors: {},
    };
  },
  methods: {
    getList() {
      this.serviceService.getList(
        (data) => {
          this.options = data.options;
          this.rootUrl = data.rootUrl;
          this.servicesList = data.services;
          this.fetching = false;
        },
        () => {}
      );
    },
    store(service) {
      this.servicesList[0] = {};
      this.serviceService.store(
        service,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(service);
          service.id = reposnse.id;
          this.servicesList[0] = service;
        },
        (error) => {
          this.cancelRow(service);
          this.flag = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    update(service, index) {
      if(index > 5)index -= (index % 5) * 5;
      this.serviceService.update(
        service,
        () => {
          this.cancelRow(service);
          this.servicesList[index].id = service.id;
        },
        (error) => {
          this.cancelRow(service);
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    destroy(data, index) {
      const id = data.id;
      this.$confirm.require({
        message: "آیا از حذف این زمین اطمینان دارید؟",
        icon: "pi pi-info-circle",
        acceptLabel: "حذف شود",
        rejectLabel: "بازگشت",
        acceptClass: "p-button-danger",
        accept: () => {
          if (this.flag) {
            this.flag = false;
            this.servicesList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.servicesList[index].id = null;
            this.serviceService.destroy(
              id,
              () => {
                this.servicesList.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              (error) => {
                this.servicesList[index].id = id;
                this.$toast.add({
                  severity: "warn",
                  summary: "خطا",
                  detail: error,
                  life: 5000,
                });
              }
            );
          }
        },
        reject: () => {},
      });
    },
    changeStatus(id, event, index) {
      if (this.flag) {
        this.servicesList[0].status = event;
      } else if (this.servicesList[index].status != null) {
        this.servicesList[index].status = null;
        const status = event ? "enable" : "disable";
        const data = {
          status,
          id,
        };
        this.serviceService.changeStatus(
          data,
          () => {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "باموفقیت " + (event ? "" : "غیر") + "فعال شد",
              life: 3000,
            });
            this.servicesList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.servicesList.unshift({});
        setTimeout(() => {
          this.servicesList[0] = {
            id: 1,
            image: null,
            title: "",
            option: {},
            status: true,
          };
          this.editRow(this.servicesList[0]);
        }, 300);
      }
    },
    editRow(data) {
      const id = data.id;
      this.editingRows[id.toString()] = true;
      if (!this.$refs.table.d_editingRowKeys)
        this.$refs.table.d_editingRowKeys = {};
      this.$refs.table.d_editingRowKeys[id.toString()] = 1;
    },
    saveRow(service, index) {
      if (this.flag) {
        if (
          service.image &&
          service.image.indexOf("blob:") === -1 &&
          service.title.length > 2 &&
          service.price > 0 &&
          service.option
        )
          this.store(service);
      } else {
        if (service.id) {
          index = this.servicesList.findIndex((e) => e.id == service.id);
          let data = { id: service.id };
          let update = false;
          const preservice = this.servicesList[index];
          Object.entries(service).forEach((key) => {
            if (preservice[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.servicesList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.servicesList[index].id = null;
            this.update(data, index);
          } else this.cancelRow(data);
        }
      }
    },
    cancelRow(data) {
      const id = data.id;
      delete this.$refs.table.d_editingRowKeys[id.toString()];
      Object.entries(this.$refs.table.d_editingMeta).forEach((e) => {
        if (id == e[1].data.id) delete this.$refs.table.d_editingMeta[e[0]];
      });
      delete this.editingRows[id.toString()];
      if (this.flag && id === 1) {
        this.servicesList.shift();
        this.flag = false;
      }
    },
    onUpload(id, index, event) {
      const xhr = event.xhr;
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (id > 1)
          Object.entries(this.$refs.table.d_editingMeta).forEach((meta) => {
            if (meta[1].data.id == id) {
              this.$refs.table.d_editingMeta[meta[0]].data.image = xhr.response;
            }
          });
        else this.servicesList[index].image = xhr.response;
      } else {
        this.servicesList[index].image = null;
      }
    },
    beforeUpload(event) {
      event.xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    onSelect(index, event) {
      this.servicesList[index].image = event.files[0].objectURL;
    },
    removeImage(id) {
      Object.entries(this.$refs.table.d_editingMeta).forEach((meta) => {
        if (meta[1].data.id == id) {
          this.$refs.table.d_editingMeta[meta[0]].data.image = null;
        }
      });
    },
  },
  created() {
    this.serviceService = new ServiceService();
  },
  mounted() {
    this.getList();
  },
};
</script>
