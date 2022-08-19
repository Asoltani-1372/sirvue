<template>
  <Card class="flex-grow">
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>مکان</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="places.length > 0"
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
        :value="placesList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="places.length > 5"
        :rows="5"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
      >
        <template #empty>
          <p class="text-xs py-2">اولین محصول را اضافه نمایید</p>
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
          <template #editor="{ data, field }" v-if="col.editable">
            <GetLocation
              v-if="field == 'breakpoint'"
              @call="data[field] = $event"
              :place="data[field]"
            />
            <div v-if="field == 'value'" style="direction: ltr">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon border-r-0 border-l text-sm">
                  %
                </span>
                <InputNumber
                  v-model="data[field]"
                  :class="{ 'p-invalid': errors[field] }"
                  class="p-inputtext-sm w-full"
                  placeholder="درصد تخفیف را وارد نمایید"
                  style="direction: rtl"
                />
              </div>
            </div>
          </template>
          <template #body="{ data, field, index }">
            <div v-if="data.id" class="flex items-center justify-center">
              <p v-if="field == 'breakpoint'">
                {{ getPlace(data.breakpoint) }}
              </p>
              <p v-if="field == 'value'">{{ data.value }} درصد</p>
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
            <Skeleton v-else />
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
import DiscountsService from "../../../service/operator/discounts.js";
import ActionTable from "../../../components/basic/ActionTable.vue";
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  components: { ActionTable, GetLocation },
  props: ["places"],
  data() {
    return {
      columns: [
        { header: "نام", field: "breakpoint", width: "w-1/3", editable: true },
        { header: "تخفیف", field: "value", width: "w-1/6", editable: true },
        { header: "عملیات", field: "action", width: "w-1/6" },
      ],
      prefix: {
        country: "کشور",
        province: "استان",
        township: "شهرستان",
        region: "بخش",
        city: "شهر",
        hamlet: "دهستان",
        village: "روستا",
      },
      fetching: true,
      flag: false,
      placesList: this.places,
      discountsService: null,
      editingRows: {},
      errors: {},
    };
  },
  methods: {
    store(place) {
      const count = place.breakpoint.length - 1;
      let temp = place.breakpoint[count];
      let data = {
        breakpoint: { type: temp.type, id: temp.id },
        type: "place",
        value: place.value,
      };
      this.placesList[0] = {};
      this.discountsService.store(
        data,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(place);
          place.id = reposnse.id;
          this.placesList[0] = place;
        },
        (error) => {
          this.cancelRow(place);
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
    update(place, index) {
      if (index > 5) index -= (index % 5) * 5;
      let data = place;
      if ("breakpoint" in place) {
        const count = place.breakpoint.length - 1;
        data.breakpoint = data.breakpoint[count];
      }
      this.discountsService.update(
        data,
        () => {
          this.cancelRow(place);
          this.placesList[index].id = place.id;
        },
        (error) => {
          this.cancelRow(place);
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
            this.placesList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.placesList[index].id = null;
            this.discountsService.destroy(
              id,
              () => {
                this.placesList.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              (error) => {
                this.placesList[index].id = id;
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
        this.placesList[0].status = event;
      } else if (this.placesList[index].status != null) {
        this.placesList[index].status = null;
        const status = event ? "enable" : "disable";
        const data = {
          status,
          id,
        };
        this.discountsService.changeStatus(
          data,
          () => {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "باموفقیت " + (event ? "" : "غیر") + "فعال شد",
              life: 3000,
            });
            this.placesList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.placesList.unshift({});
        setTimeout(() => {
          this.placesList[0] = {
            id: 1,
            breakpoint: [{ id: 1, title: "ایران", type: "country" }],
            value: null,
          };
          this.editRow(this.placesList[0]);
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
    saveRow(place, index) {
      if (this.flag) {
        if (place.breakpoint.length > 0 && place.value > 0) this.store(place);
      } else {
        if (place.id) {
          index = this.placesList.findIndex((e) => e.id == place.id);
          let data = { id: place.id };
          let update = false;
          const preplace = this.placesList[index];
          Object.entries(place).forEach((key) => {
            if (preplace[key[0]] != key[1]) {
              data[key[0]] = key[1];
              if (key[0] == "breakpoint") {
                delete data.breakpoint.title;
              }
              this.placesList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.placesList[index].id = null;
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
        this.placesList.shift();
        this.flag = false;
      }
    },
    getPlace(data) {
      const last = data[data.length - 1];
      const prefix = this.prefix[last.type];
      return prefix + " " + last.title.replaceAll(prefix, "");
    },
  },
  created() {
    this.discountsService = new DiscountsService();
  },
  watch: {
    places(v) {
      this.placesList = v;
      this.fetching = false;
    },
  },
};
</script>
