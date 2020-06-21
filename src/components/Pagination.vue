<template>
  <div>
    <ul>
      <li>
        <button @click="previousPage" :disabled="disabledPrevious">Previous</button>
      </li>
      <li>
        <button @click="nextPage"  :disabled="disabledNext">Next</button>
      </li>
    </ul>
  </div>
</template>

<script>
import EventBus from '../eventBus'

export default {
  name: "pagination",
  data() {
    return {
      disabledPrevious: true,
      disabledNext: false
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
    EventBus.$on("disablePrevious", () => this.disabledPrevious = true)
    EventBus.$on("enablePrevious", () => this.disabledPrevious = false)
    EventBus.$on("disableNext", () => this.disabledNext = true)
    EventBus.$on("enableNext", () => this.disabledNext = false)
  }
}
</script>

<style scoped>
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
  }

  li:first-child {
    padding-right: 10px;
  }

  button {
    padding: 10px 20px;
    border-radius: 5px;
    border: 0px solid;
    background-color: var(--gray-color);
    cursor: pointer;
  }

  button:hover {
    background-color: var(--dark-color);
    color: var(--white-color);
    transition: all .3s;
  }

  button:hover:disabled {
    background-color: var(--gray-color);
    color: var(--white-color);
    transition: all .3s;
  }
</style>