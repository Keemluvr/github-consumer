<template>
  <div class="user-detail">
    <Navbar />
    <div v-if="loading">
      <Loading class="loading" />
    </div>
    <div v-else>
      <ArrowLeftIcon size="1.5x" class="arrowLeftIcon" @click="backRouter()"></ArrowLeftIcon>
      <!-- infomations -->
      <div class="information">
        <UserIcon size="2.5x" class="user-icon"></UserIcon>
        <span class="user-id">{{ this.userMoreDetail.id }}</span>
        <h1 class="user-login">{{ this.userMoreDetail.login }}</h1>
        <div class="user-created">
          <span>Created at</span>
          <p>{{ this.userMoreDetail.created_at | formatDate }}</p>
        </div>
        <a :href="this.userMoreDetail.html_url" target="_blank">
          <GithubIcon size="1.5x" class="user-icon-social"></GithubIcon>
        </a>
      </div>
      <TableRepositories class="table" />
      <Pagination class="pagination" />
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import EventBus from "../eventBus";
import parser from "@/utils/linkParser.js";
import users from "@/services/users.js";
import repositories from "@/services/repositories.js";
import { UserIcon } from "vue-feather-icons";
import { GithubIcon } from "vue-feather-icons";
import { ArrowLeftIcon } from "vue-feather-icons";

import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";

export default {
  name: "userDetail",
  props: {
    login: {
      required: true,
      type: String
    }
  },
  components: {
    Loading,
    Navbar,
    UserIcon,
    GithubIcon,
    ArrowLeftIcon,
    'TableRepositories': () => import('../components/TableRepositories'),
    Pagination
  },
  data() {
    return {
      userMoreDetail: {},
      pagination: "",
      loading: true
    };
  },
  methods: {
    backRouter() {
      this.$router.go(-1);
    },
    getMoreInfosUser() {
      this.loading = true;
      users
        .get(this.login)
        .then(response => {
          this.userMoreDetail = response.data;
          this.getRepositories(this.userMoreDetail.repos_url);
          this.loading = false;
        })
        .catch(err => {
          this.$router.push({
            name: "page404",
            params: { message: "User not found" }
          });
          return err;
        });
    },
    getRepositories(link) {
      repositories
        .list(link)
        .then(response => {
          this.pagination = parser(response.headers.link);
          this.repositoriesList = response.data;
          EventBus.$emit(
            "getRepositories",
            this.repositoriesList,
            ["ID", "Name", "URL repository"],
            false
          );
        })
        .catch(err => {
          this.$router.push({
            name: "page404",
            params: { message: "Repositories not found" }
          });
          return err;
        });
    },
    /**
     * Logic to proceed to the next page
     */
    nextPage() {
      // Check if it's on the last page
      if (
        this.pagination.next === undefined &&
        this.pagination.last === undefined
      ) {
        this.getRepositories(this.pagination.next);
        EventBus.$emit("disableNext", true);
        // Check if it's on the first page
      } else if (
        this.pagination.first == undefined &&
        this.pagination.prev == undefined
      ) {
        this.repositoriesList = this.getRepositories(this.pagination.next);
        EventBus.$emit("disablePrevious", false);
      } else {
        // --- Enter here if you are on the mid page ---
        this.repositoriesList = this.getRepositories(this.pagination.next);
        EventBus.$emit("disablePrevious", false);
        EventBus.$emit("disableNext", false);
      }
    },
    /**
     * Logic to return to the page
     */
    previousPage() {
      // Check if it's on the first page
      if (
        this.pagination.first == undefined &&
        this.pagination.prev == undefined
      ) {
        EventBus.$emit("disablePrevious", true);
      } else {
        // --- Enter here if you are on the mid page ---
        this.repositoriesList = this.getRepositories(this.pagination.prev);
        EventBus.$emit("disablePrevious", false);
        EventBus.$emit("disableNext", false);
      }
    }
  },
  filters: {
    formatDate: date => {
      let dateFormat = new Date(date);
      return `${dateFormat.getDate()}/${dateFormat.getMonth() +
        1}/${dateFormat.getFullYear()}`;
    }
  },
  created() {
    this.getMoreInfosUser();
  },
  mounted() {
    EventBus.$on("nextPage", () => this.nextPage());
    EventBus.$on("previousPage", () => this.previousPage());
  }
};
</script>

<style scoped>
.information,
.table,
.pagination {
  max-width: 600px;
}

.arrowLeftIcon {
  position: absolute;
  margin: -10px 0 0 20px;
}

.arrowLeftIcon:hover {
  cursor: pointer;
}

.information {
  text-align: center;
  margin: 30px auto 40px auto;
}

.user-icon {
  background-color: var(--blue-color);
  border-radius: 50%;
  padding: 10px;
}

.user-id {
  display: block;
  padding-top: 5px;
  font-weight: 700;
}

.user-login {
  padding-bottom: 10px;
  font-size: 1.5em;
  font-weight: 500;
}

.user-created {
  padding: 10px 0 30px;
}

.user-created span {
  font-size: 15px;
}

.user-icon-social {
  color: var(--dark-color);
}

.user-icon-social:hover {
  color: var(--gray-color);
  cursor: pointer;
  transition: all ease-in 0.3s;
}

.table {
  margin: 0 auto;
}

.pagination {
  margin: 20px auto 40px auto;
}

.loading {
  text-align: center;
  margin: 100px 0;
}
</style>