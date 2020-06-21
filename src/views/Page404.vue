<template>
  <div class="page404">
    <Navbar />
    <transition appear>
      <div class="err">
        <img src="@/assets/notfound.svg" alt />
        <p>{{ message }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "page404",
  props: {
    message: {
      default: "Page not found"
    }
  },
  components: {
    Navbar
  }
};
</script>

<style scoped>
.err {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 15vh;
}

img {
  width: 60vw;
  max-width: 60vh;
}

p {
  font-size: 70px;
  margin-top: 5vh;
}

@media screen and (max-width: 680px) {
  p {
    font-size: 2em;
  }
}
</style>