<template>
  <div class="tableRepositories">
    <div v-if="loading">
      <Loading class="loading" />
    </div>
    <div v-else class="content-table">
      <transition appear>
        <table class="table">
          <thead>
            <tr>
              <th v-for="column in gridColumns" :key="column">
                {{ column }}
                <span class="arrow"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repository in repositoriesList" :key="repository.id">
              <td>{{ repository.id }}</td>
              <td>{{ repository.name }}</td>
              <td>
                <a class="repository-link" :href="repository.html_url" target="_blank">Link</a>
              </td>
            </tr>
          </tbody>
        </table>
      </transition>
    </div>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import Loading from "@/components/Loading";

export default {
  name: "table",
  data() {
    return {
      gridColumns: [],
      repositoriesList: [],
      loading: true
    };
  },
  components: {
    Loading
  },
  mounted() {
    EventBus.$on("getRepositories", (repos, grid, loading) => {
      this.loading = loading;
      this.gridColumns = grid;
      this.repositoriesList = repos;
    });
  }
};
</script>

<style scoped>
.content-table {
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

table {
  border: 2px solid var(--dark-color);
  border-radius: 3px;
  background-color: var(--white-color);
}

th {
  background-color: var(--dark-color);
  color: var(--white-color);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: var(--white-color);
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: var(--white-color);
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid var(--white-color);
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--white-color);
}

.loading {
  text-align: center;
  margin: 100px 0;
}
</style>