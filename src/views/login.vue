<template>
  <div
    class="login-div"
    style="background: url(/static/img/背景.png) no-repeat;background-size:cover;"
  >
    <div class="form-wrap">
      <div class="form-btn clearfix"></div>
      <div class="formcon">
        <img src="/static/img/logo.png" />
        <br /><br />
        <el-tabs type="card">
          <el-form ref="form" :model="loginForm" class="form-horizontal">
            <el-form-item
              prop="username"
              style="margin-bottom: 20px"
              :rules="{
                required: true,
                message: '请输入账号',
                trigger: 'blur'
              }"
            >
              <el-input v-model="loginForm.username" placeholder="请输入账号">
                <i slot="prefix" class="el-input__icon fa fa-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="password"
              style="margin-bottom: 20px"
              :rules="{
                required: true,
                message: '请输入密码',
                trigger: 'blur'
              }"
            >
              <el-input
                :type="pwdType"
                v-model="loginForm.password"
                @keyup.enter.native="login()"
                placeholder="请输入密码"
              >
                <i slot="prefix" class="el-input__icon fa fa-key"></i>
                <i
                  slot="suffix"
                  title="显示密码"
                  @click="showPass()"
                  style="cursor:pointer;"
                  class="el-icon-view"
                ></i>
              </el-input>
              <a
                class="a-style"
                @click="updatePasswork('http://ssp.jms.com/authorization.do')"
                >修改密码</a
              >
            </el-form-item>
            <div class="btns">
              <el-button
                type="text"
                class="f-btn"
                @click="login"
                :loading="loading"
                >登 陆</el-button
              >
            </div>
            <div class="remember">
              <div align="center" class="errormsg" v-if="error != null">
                <i class="fas fa-exclamation-triangle"></i>
                <small v-text="error"></small>
              </div>
            </div>
          </el-form>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      error: null,
      loginForm: {},
      pwdType: 'password'
    }
  },
  methods: {
    updatePasswork (url) {
      window.open(url, '_blank') // 新窗口打开外链接
    },
    showPass () {
      this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
    },
    login () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = false
          let res = await this.$http.userLogin(this.loginForm)
          if (res) {
            if (res.results.token !== undefined) {
              window.sessionStorage.setItem('token', res.results.token)
              window.sessionStorage.setItem('username', res.results.username)
              window.sessionStorage.setItem(
                'permission',
                JSON.stringify(res.results.permission)
              )
              window.sessionStorage.setItem(
                'menu',
                JSON.stringify(res.results.menulist)
              )
              this.$router.push({ path: '/home/' })
            }
          } else {
            this.$message.error('网络超时，无法连接服务器。')
          }
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-div {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder,
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder,
input:-moz-placeholder,
textarea:-moz-placeholder,
input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #666;
}

html,
body,
div,
span,
iframe,
input,
map,
font,
img,
a img,
samp,
strong,
hr,
h1,
h2,
h3,
h4,
h5,
h6,
b,
p,
blockquote,
a,
address,
code,
dl,
dt,
dd,
ol,
ul,
li,
form,
label,
table,
tr,
td,
th {
  padding: 0;
  margin: 0;
  border: 0;
}

.errormsg {
  color: red;
  text-align: center;
}

* {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

input[type='text'],
input[type='button'],
input[type='submit'] {
  -webkit-appearance: none; /*去除iPhone input默认样式}*/
}

input {
  font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
}

.clearfix:after {
  clear: both;
  content: '.';
  display: block;
  width: 0;
  height: 0;
  visibility: hidden;
}

.clearfix {
  zoom: 1;
}

.form-wrap {
  width: 597px;
  height: 419px;
  /*background: url(/static/img/loginform_bg.png) no-repeat;*/
  position: fixed;
  left: 70%;
  top: 55%;
  margin-left: -300px;
  margin-top: -210px;
  z-index: 990;
  border-radius: 6px;
}

.form-wrap > .form-btn > .langclass {
  cursor: pointer;
}

.formcon {
  width: 300px;
  float: left;
  margin-right: 100px;
  padding-top: 37px;
}

.login-title {
  margin-left: 30px;
  /*margin-top:-50px;*/
  position: absolute;
  color: #89538e;
  font-style: italic;
}

input {
  outline: none;
}

.formcon li input {
  display: block;
  width: 100%;
  height: 34px;
  line-height: 34px;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  padding-left: 29px;
  background-color: rgba(255, 255, 255, 0.6);
  border: solid 1px #d5dadc;
  background-repeat: no-repeat;
  background-position: 3px center;
}

.formcon li input.f-yzm {
  width: 155px;
  float: left;
  padding-left: 8px;
}

.formcon li .yzm {
  display: block;
  float: right;
  width: 124px;
  height: 36px;
  border-radius: 6px;
}

.btns {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.f-btn {
  display: block;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  background: #8e0004;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  -webkit-transition: all 0.35s;
  -moz-transition: all 0.35s;
  -ms-transition: all 0.35s;
  -o-transition: all 0.35s;
  transition: all 0.35s;
}

.f-btn:hover {
  /*background: rgba(255, 255, 255, .4);*/
  color: #800080;
}

.remember {
  margin-top: 15px;
  color: #666666;
}

.remember input {
  width: 13px;
  height: 13px;
  vertical-align: -2px;
}

.formcon .errMsg {
  height: 26px;
  color: #fc1919 !important;
  line-height: 26px;
  font-size: 14px;
}

.form-btn {
  position: absolute;
  right: 7px;
  top: 7px;
  border: solid 1px #dcdcdc;
}

.form-btn a {
  display: block;
  padding: 3px 6px;
  background: #fff;
  font-size: 12px;
  color: #7a7a7a;
  float: left;
}

.form-btn a.on {
  background: #dcdcdc;
  color: #fff;
}

.a-style {
  color: #99a4ac;
  size: A5;
  cursor: pointer;
  text-decoration: underline;
}
</style>
