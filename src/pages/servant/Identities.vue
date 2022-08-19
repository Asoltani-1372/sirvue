<template>
  <div class="grid lg:grid-cols-2 grid-cols-1 gap-8">
    <NationalCode :input="documents" @call="change('nationalCard')" />
    <Plaque :input="documents" @call="change('plaque')" />
    <Certificate
      :input="documents"
      @call="change('certificate')"
      v-if="false"
    />
    <Representer :input="documents" @call="change('representer')" />
    <NoCriminalRecord
      :input="documents"
      @call="change('noCriminalRecord')"
      v-if="false"
    />
    <DegreeEducation
      :input="documents"
      @call="change('degreeEducation')"
      v-if="false"
    />
  </div>
</template>

<script>
import IdentitiesService from "../../service/servant/Identity";
import NationalCode from "../../views/servant/identities/NationalCard.vue";
import Plaque from "../../views/servant/identities/Plaque.vue";
import Certificate from "../../views/servant/identities/Certificate.vue";
import Representer from "../../views/servant/identities/Representer.vue";
import NoCriminalRecord from "../../views/servant/identities/NoCriminalRecord.vue";
import DegreeEducation from "../../views/servant/identities/DegreeEducation.vue";

export default {
  components: {
    NationalCode,
    Plaque,
    Certificate,
    Representer,
    NoCriminalRecord,
    DegreeEducation,
  },
  data() {
    return {
      identitiesService: null,
      documents: null,
      showStatus: null,
      rootUrl: null,
      showDialog: false,
    };
  },
  methods: {
    change(document) {
      this.documents[document].status = "checking";
      this.showDialog = true;
    },
  },
  created() {
    this.identitiesService = new IdentitiesService();
  },

  mounted() {
    this.identitiesService.getIdentity(
      (data) => {
        this.documents = data.documents;
        this.status = data.status;
        this.rootUrl = data.rootUrl;
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
  watch: {
    documents: {
      handler(v) {
        let counter = 0;
        if (v) {
          if (v.nationalCard.status) counter++;
          if (v.plaque.status) counter++;
          //if (v.certificate.status) counter++;
          if (v.representer.status) counter++;
          //if (v.degreeEducation.status) counter++;
          //if (v.noCriminalRecord.status) counter++;
          this.showStatus = counter == 3;

          if (this.showStatus && this.showDialog) {
            if (v.nationalCard.status == "rejected") counter--;
            if (v.plaque.status == "rejected") counter--;
            //if (v.certificate.status == "rejected") counter--;
            if (v.representer.status == "rejected") counter--;
            //if (v.degreeEducation.status == "rejected") counter--;
            //if (v.noCriminalRecord.status == "rejected") counter--;
            if (counter == 3) {
              this.$confirm.require({
                message:
                  "مدارک شما برای مدیر سامانه ارسال شد. لظفا تا بررسی کامل مدارک شکیبا باشید",
                header: "احراز هویت",
                icon: "pi pi-check",
                acceptLabel: "متوجه شدم",
                rejectLabel: "",
                acceptClass: "float-left p-button-success",
                accept: () => {},
                reject: () => {},
              });
            } else {
              setTimeout(() => {
                this.$toast.add({
                  severity: "warn",
                  summary: "هشدار",
                  detail: "لطفا مدارک دیگر را نیز بارگذاری نمایید",
                  life: 4000,
                });
                0;
              }, 2000);
            }
          }
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>