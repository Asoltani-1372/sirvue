<template>
  <div class="flex flex-col gap-8 items-start justify-start w-full">
    <Wallet/>
    <OfflinePayments />
    <PayRequests />
  </div>
</template>

<script>
import Wallet from "../../views/financial/wallet/Wallet.vue";
import PayRequests from "../../views/financial/wallet/PayRequests.vue";
import OfflinePayments from '../../views/financial/wallet/OfflinePayments.vue';
export default {
  components: { Wallet, PayRequests, OfflinePayments },
  data() {
    return {
      balance: 0,
      clearing: 0,
    };
  },
};
</script>

<style>
</style>