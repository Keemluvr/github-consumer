import users from "@/services/users";
import parser from "@/utils/linkParser.js";

/** Standard API path */
export default {
  data() {
    return {
      api: null,
      loading: true,
      pagination: null,
      initialPage: "users?since=0",
      firstPage: null,
      previousPagination: [],
      previousPaginationUser: null,
      previousDisable: false,
    };
  },
  methods: {
    /** Fetch the data
     * @param {String} page - destination page
     */
    fetchData(page) {
      this.loading = true;
      // List a page
      users
        .list(page == undefined ? this.initialPage : page)
        .then((response) => {
          this.api = response.data;
          this.pagination = parser(response.headers.link);
          this.loading = false;
          return this.api;
        })
        .catch((err) => {
          this.$router.push({
            name: "page404",
            params: { message: "Users not found" },
          });
          return err;
        });
    },
  },
};
