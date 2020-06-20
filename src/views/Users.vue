<template>
  <div class="users">
    <!-- user listing -->
    <div v-for="user in api" :key="user.id" class="user">
      <router-link :to="{ name:'userDetail', params: { login: user.login, user: user } }">
        <p>{{ user.id }} - {{ user.login }}</p>
      </router-link>
    </div>
    <!-- pagination -->
    <PaginationUser />
  </div>
</template>

<script>
import PaginationUser from "@/components/PaginationUser";
import users from "@/services/users";
import fetchData from "@/mixins/fetchData.js";
import EventBus from "../eventBus";

export default {
  name: "users",
  mixins:[fetchData],
  components: {
    PaginationUser
  },
  methods: {
    /**
     * Initializes the variable that contains the first page
     */
    initializePage() {
       users.list(this.initialPage).then(response => {
         this.firstPage = response.data
       })
    },
    /**
     * Logic to proceed to the next page
     */
    nextPage() {
      // Add the previous pages to the array
      this.previousPagination.push(this.api) 
      // Saves the first user from the previous page
      this.previousPaginationUser = this.previousPagination[this.previousPagination.length - 1][0].id
      // Search the next page
      this.api = this.fetchData(this.pagination.next)
      // Sends the event to activate the previous button 
      EventBus.$emit("enablePrevious")
    },
    /**
     * Logic to return to the page
     */
    previousPage() {
      // Check if there is a previous page using the size of the array that stores the previous pages
      if( this.previousPagination.length  === 1) {
        // --- If there is no previous page, enter here ---
        // Sends an event to disable the previous button
        EventBus.$emit("disablePrevious")
        // Returns to the initial page
        this.api = this.fetchData(this.initialPage)
        // Resets the array with the previous pages to empty
        this.previousPagination = []
        // Resets the variable that saves the first user on the previous page to null
        this.previousPaginationUser = null
      } else {
        // --- If there is a previous page enter here ---
        // Takes the previous page in the array that stores all the previous pages
        let previous = this.previousPagination[this.previousPagination.length - 1]
        // Search this page
        this.api = this.fetchData(`users?since=${previous[0].id - 1}`)
        // Remove it from the array that saves all previous pages
        this.previousPagination.pop()
        // Updates the variable that contains the user on the previous page
        this.previousPaginationUser = this.previousPagination[this.previousPagination.length - 1][0].id
      }

    }
  },
  created() {
    this.initializePage()
    this.fetchData()
  },
  mounted() {
    EventBus.$on("nextPage", () => this.nextPage());
    EventBus.$on("previousPage", () => this.previousPage());
  }
};
</script>

<style>
p {
  font-size: 12px;
}
</style>
