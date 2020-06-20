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
      // Reactivates loading animation
      this.loading = true;
      // List a page
      users
        .list(page == undefined ? this.initialPage : page)
        .then((response) => {
          this.api = response.data;
          // Save the links parser
          this.pagination = parser(response.headers.link);
          // Disables loading animation
          this.loading = false;
          return this.api;
        })
        .catch((err) => {
          return err;
        });
    },
  },
};
