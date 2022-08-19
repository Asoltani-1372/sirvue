<template>
  <div class="financial">
    <div class="flex flex-col gap-8 w-full lg:w-1/3">
      <Wallet :input="wallet" />
      <Bank :input="bank" />
      <Clearing :input="clearing" />
    </div>
    <Transactions class="w-full lg:w-2/3"/>
  </div>
</template>

<script>
import Transactions from "../views/financial/Transactions.vue";
import Wallet from "../views/financial/Wallet.vue";
import Bank from "../views/financial/Bank.vue";
import Clearing from "../views/financial/Clearing.vue";
export default {
  components: { Bank, Transactions, Wallet, Clearing },
  data() {
    return {
      wallet: null,
      bank: null,
      clearing: null,
    };
  },
};
</script>

<style scoped>
.financial {
  @apply flex flex-col lg:flex-row gap-8 pt-12 items-start justify-start;
}
</style>