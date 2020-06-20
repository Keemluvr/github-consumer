<template>
  <div class="user-detail">
    <p>id: {{ this.userMoreDetail.id }}</p>
    <p>login: {{ this.userMoreDetail.login }}</p>
    <p>URL: {{ this.userMoreDetail.html_url }}</p>
    <p>{{ this.userMoreDetail.created_at | formatDate }}</p>
    <div class="repos">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import users from "@/services/users.js";

export default {
  name: "userDetail",
  props: {
    login: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      userMoreDetail: {}
    };
  },
  methods: {
    getMoreInfosUser() {
      console.log(this.login);
      users
        .userCreatedAt(this.login)
        .then(response => {
          this.userMoreDetail = response.data;
          console.log("depois", this.userMoreDetail);
        })
        .catch(err => {
          console.log(err, "aaaaaaaaa");
        });
    }
  },
  filters: {
    formatDate: date => {
      let dateFormat = new Date(date);
      return `${dateFormat.getDate()}/${dateFormat.getMonth()}/${dateFormat.getFullYear()}`;
    }
  },
  created() {
    this.getMoreInfosUser();
  }
};
</script>

<style>
</style>