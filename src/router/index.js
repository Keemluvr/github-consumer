import Vue from "vue";
import VueRouter from "vue-router";
// Views
import Users from "../views/Users.vue";
import UserDetail from "../views/UserDetail.vue";
import Page404 from "../views/Page404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    component: Page404,
    name: "page404",
  },
  {
    path: "/",
    name: "Users",
    component: Users,
  },
  {
    path: "/:login",
    name: "userDetail",
    component: UserDetail,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
