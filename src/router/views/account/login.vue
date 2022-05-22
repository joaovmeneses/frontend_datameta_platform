<script>

import Layout from "../../layouts/auth"
import {
  authMethods,
  authFackMethods,
  notificationMethods,
} from "@/state/helpers"
import { mapState } from "vuex"

import appConfig from "@/app.config"
import { required, email } from "vuelidate/lib/validators"

/**
 * Login component
 */
export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
  },
  data() {
    return {
      loading:false,
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    }
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  computed: {
    ...mapState("authfack", ["status"]),
    notification() {
      return this.$store ? this.$store.state.notification : null
    },
  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,
    tryToLogIn() {
      this.submitted = true
      // stop here if form is invalid
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      } else {
        this.loading = true
        const vm = this
        this.$http
          .post('auth/login', {
            email: this.email,
            password: this.password,
          })
          .then( async (res) => {
            if(res.data.body && res.data.status === 200) {
              sessionStorage.setItem('userToken', res.data.body.session)
              sessionStorage.setItem('userRole', res.data.body.user.Role.name)
              this.$router.push({
                name: "default",
              })
            } else {
              alert("Login failed")
              vm.loading = false
            }
          })
      }
    },
  },
  mounted() {
    localStorage.setItem('reload', true)
  },
}
</script>

<template>
  <Layout>
    <div class="row justify-content-center">  
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-danger">
            <div class="row">
              <div class="col-7">
                <div class="text-danger p-4">
                  <h5 class="text-danger">Bem-vindo(a) de volta!</h5>
                  <p>Efetue o login para prosseguir!</p>
                </div>
              </div>
              <div class="col-5 align-self-end">
                <img
                  src="@/assets/images/profile-img.png"
                  alt
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <div>
              <router-link tag="a" to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="@/assets/images/logo-icon.png" alt height="34" />
                  </span>
                </div>
              </router-link>
            </div>
            <b-alert
              v-model="isAuthError"
              variant="danger"
              class="mt-3"
              dismissible
              >{{ authError }}</b-alert
            >
            <div
              v-if="notification.message"
              :class="'alert ' + notification.type"
            >
              {{ notification.message }}
            </div>

            <b-form class="p-2" @submit.prevent="tryToLogIn">
              <b-form-group
                class="mb-3"
                id="input-group-1"
                label="Email"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="text"
                  placeholder="Seu email"
                  :class="{ 'is-invalid': submitted && $v.email.$error }"
                ></b-form-input>
                <div
                  v-if="submitted && $v.email.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.email.required">Email is required.</span>
                  <span v-if="!$v.email.email">Please enter valid email.</span>
                </div>
              </b-form-group>

              <b-form-group
                class="mb-3"
                id="input-group-2"
                label="Password"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="password"
                  type="password"
                  placeholder="Sua senha"
                  :class="{ 'is-invalid': submitted && $v.password.$error }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.password.required"
                  class="invalid-feedback"
                >
                  Password is required.
                </div>
              </b-form-group>
              <b-form-checkbox
                  class="form-check"
                  id="customControlInline"
                  name="checkbox-1"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  Remember me
                </b-form-checkbox>
              <div class="mt-3 d-grid">
                
                <b-button type="submit" variant="danger" class="btn-block">
                  <div v-if='loading' class="spinner-border" role="status">
                  </div>
                  <span v-else>Entrar</span>
                </b-button>
              </div>
              <div class="mt-4 text-center">
                <router-link tag="a" to="/forgot-password" class="text-muted">
                  <i class="mdi mdi-lock me-1"></i> Forgot your password?
                </router-link>
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <div class="mt-5 text-center">
          <p>
            © {{ new Date().getFullYear() }} Data 3<br> All rights reserved.
          </p>
        </div>
        <!-- end row -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>

<style lang="scss" module></style>
