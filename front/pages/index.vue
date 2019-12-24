<template>
  <div><button type="button" @click="login">Login</button></div>
</template>

<script>
export default {
  methods: {
    login() {
      window.open('http://localhost:3000/auth/github')
    }
  }
}
</script>

<style></style>
