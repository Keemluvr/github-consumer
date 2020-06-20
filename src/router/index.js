import Vue from "vue";
import VueRouter from "vue-router";
// Views
import Users from "../views/Users.vue";
import UserDetail from "../views/UserDetail.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/",
    name: "Users",
    component: Users,
  },
  {
    path: '/:login',
    name: 'userDetail',
    component: UserDetail,
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
