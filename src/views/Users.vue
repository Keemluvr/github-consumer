<template>
  <div class="users">
    <Navbar />

    <h1 class="title">Users</h1>
    <div v-if="loading">
      <Loading class="loading" />
    </div>
    <!-- user listing -->
    <transition-group appear>
    <div v-for="user in api" :key="user.id" class="user-list">
      <router-link
        tag="div"
        :to="{ name:'userDetail', params: { login: user.login, user: user } }"
        class="user"
      >
        <div class="user-left">
          <UserIcon size="1.5x" class="user-icon"></UserIcon>
          <p class="user-id">{{ user.id }}</p>
        </div>
        <p class="user-login">{{ user.login }}</p>
      </router-link>
    </div>
    </transition-group>
    <Pagination class="pagination" />
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import users from "@/services/users";
import fetchData from "@/mixins/fetchData.js";
import EventBus from "../eventBus";
import { UserIcon } from 'vue-feather-icons'

export default {
  name: "users",
  mixins: [fetchData],
  components: {
    Pagination,
    Navbar,
    UserIcon,
    Loading
  },
  methods: {
    /**
     * Initializes the variable that contains the first page
     */
    initializePage() {
      users.list(this.initialPage).then(response => {
        this.firstPage = response.data;
      });
    },
    /**
     * Logic to proceed to the next page
     */
    nextPage() {
      EventBus.$emit("enablePrevious");
      this.previousPagination.push(this.api);
      console.log(this.previousPagination.length);
      this.previousPaginationUser = this.previousPagination[
        this.previousPagination.length - 1
      ][0].id;
      this.api = this.fetchData(this.pagination.next);
    },
    /**
     * Logic to return to the page
     */
    previousPage() {
      // Check if there is a previous page using the size of the array that stores the previous pages
      if (this.previousPagination.length === 1) {
        // --- If there is no previous page, enter here ---
        EventBus.$emit("disablePrevious");
        this.api = this.fetchData(this.initialPage);
        this.previousPagination = [];
        this.previousPaginationUser = null;
      } else {
        // --- If there is a previous page enter here ---
        let previous = this.previousPagination[
          this.previousPagination.length - 1
        ];
        this.api = this.fetchData(`users?since=${previous[0].id - 1}`);
        this.previousPagination.pop();
        this.previousPaginationUser = this.previousPagination[
          this.previousPagination.length - 1
        ][0].id;
      }
    }
  },
  created() {
    this.initializePage();
    this.fetchData();
  },
  mounted() {
    EventBus.$on("nextPage", () => this.nextPage());
    EventBus.$on("previousPage", () => this.previousPage());
  }
};
</script>

<style scoped>
.title {
  font-size: 2.5em;
  font-weight: 400;
  text-align: center;
  margin: 30px auto 40px auto;
}

.title,
.user-list,
.pagination {
  max-width: 600px;
}

.user-list {
  margin: 0 auto;
}

.user {
  border-radius: 5px;
  display: block;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  box-shadow: 0 0.0875rem .4rem var(--gray-color);
  cursor: pointer;
}

.user:hover {
  box-shadow: 0 0.0875rem 1.4rem var(--gray-color);
  transition: all ease-in .3s;
}
.user:hover:first-child {
  background-color: var(--blue-color);
  color: white;
}

.user-left {
  background-color: var(--gray-color);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  padding: 20px;
  text-align: center;
  font-weight: 700;
}

.user-login {
  padding-left: 20px;
}

.pagination {
  margin: 20px auto 40px auto;
}

.loading {
  text-align: center;
}
</style>