<template>
  <div class="user-detail">
    <Navbar />
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
      <a :href="this.userMoreDetail.html_url">
        <GithubIcon size="1.5x" class="user-icon-social"></GithubIcon>
      </a>
    </div>
   
    <!-- table repositories -->
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
          <td>{{ repository.url }}</td>
        </tr>
      </tbody>
    </table>
    <!-- pagination -->
    <Pagination class="pagination" />
  </div>
</template>

<script>
import users from "@/services/users.js";
import repositories from "@/services/repositories.js";
import Navbar from "@/components/Navbar";
import { UserIcon } from 'vue-feather-icons';
import { GithubIcon } from 'vue-feather-icons'
import { ArrowLeftIcon } from 'vue-feather-icons'
import Pagination from "@/components/Pagination";
import EventBus from "../eventBus";
import parser from "@/utils/linkParser.js";

export default {
  name: "userDetail",
  props: {
    login: {
      required: true,
      type: String
    }
  },
  components: {
    Navbar,
    UserIcon,
    GithubIcon,
    ArrowLeftIcon,
    Pagination,
  },
  data() {
    return {
      userMoreDetail: {},
      gridColumns: ["ID", "Name", "URL repository"],
      repositoriesList: [],
      pagination: ''
    };
  },
  methods: {
    backRouter() {
      this.$router.go(-1)
    },
    getMoreInfosUser() {
      users
        .get(this.login)
        .then(response => {
          this.userMoreDetail = response.data;
          this.getRepositories(this.userMoreDetail.repos_url);
        })
        .catch(err => {
          console.log(err, "aaaaaaaaa");
        });
    },
    getRepositories( link ) {
      repositories
        .list(link)
        .then(response => {
          this.pagination = parser(response.headers.link)
          console.log('----------')
          console.log(this.pagination.first)
          console.log(this.pagination.prev)
          console.log(this.pagination.next)
          console.log(this.pagination.last)
          this.repositoriesList = response.data;
        })
        .catch(err => {
          console.log(err, "bbbbbbbbb");
        });
    },
    /**
     * Logic to proceed to the next page
     */
    nextPage() {
      // Check if it's on the last page
      if(this.pagination.next == undefined && this.pagination.last == undefined){
        this.getRepositories(this.pagination.next)
        EventBus.$emit("disableNext")
      // Check if it's on the first page
      } else if(this.pagination.first == undefined && this.pagination.prev == undefined) {
        this.repositoriesList = this.getRepositories(this.pagination.next)
        EventBus.$emit("enablePrevious")
      } else {
      // --- Enter here if you are on the mid page ---
        this.repositoriesList = this.getRepositories(this.pagination.next)
        EventBus.$emit("enablePrevious");
        EventBus.$emit("enableNext");
      }
    },
    /**
     * Logic to return to the page
     */
    previousPage() {
      // Check if it's on the first page
      if(this.pagination.first == undefined && this.pagination.prev == undefined) {
        EventBus.$emit("disablePrevious")
      } else {
      // --- Enter here if you are on the mid page ---
        this.repositoriesList = this.getRepositories(this.pagination.prev)
        EventBus.$emit("enablePrevious");
        EventBus.$emit("enableNext");
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
.table {
  max-width: 600px;
}
.arrowLeftIcon {
  position: absolute;
  margin: 10px 0 0 20px;
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
  transition: all ease-in .3s;
}

.table {
  margin: 0 auto;
}

.pagination {
  margin: 0 auto;
}
</style>