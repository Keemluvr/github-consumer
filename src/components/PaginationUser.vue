<template>
  <div>
    <ul>
      <li>
        <button @click="previousPage" :disabled="disabled">anterior</button>
      </li>
      <li>
        <button @click="nextPage">próximo</button>
      </li>
    </ul>
  </div>
</template>

<script>
import EventBus from '../eventBus'

export default {
  name: "paginationUser",
  data() {
    return {
      disabled: true
    }
  },
  methods: {
    nextPage() {
      EventBus.$emit("nextPage")
    },
    previousPage() {
      EventBus.$emit("previousPage")
    },
  },
  mounted() {
    EventBus.$on("disablePrevious", () => this.disabled = true)
    EventBus.$on("enablePrevious", () => this.disabled = false)
  }
}
</script>

<style scoped>
  ul {
    list-style: none;
    display: inline;
  }
</style>