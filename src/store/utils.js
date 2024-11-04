import { defineStore } from "pinia";

export const utils = defineStore("utils", {
  state: () => ({
    status: false,
  }),
  getters: {
    getLoadStatus: (state) => state.status,
  },
  actions: {
    setLoadStatus(status) {
      this.status = status;
    },
  },
});
