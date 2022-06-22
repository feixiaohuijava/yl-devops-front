<template>
  <div>
    <nav class="navbar-default navbar-static-side" role="navigation">
      <div class="sidebar-collapse">
        <ul class="nav" id="side-menu" style="">
          <li class="nav-header">
            <div class="dropdown profile-element">
              <span>
                <img
                  alt="image"
                  class="img-circle"
                  src="../../assets/img/profile_small.jpg"
                />
              </span>
              <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                <span class="clear">
                  <span class="block m-t-xs">
                    <strong class="font-bold">{{ user.username }}</strong>
                  </span>
                  <!--<span class="text-muted text-xs block">{{ user.role}}-->
                  <!--<b class="caret"></b>-->
                  <!--</span>-->
                </span>
              </a>
              <!--<ul class="dropdown-menu animated fadeInRight m-t-xs">-->
              <!--<li>-->
              <!--<a href="profile.html">个人信息</a>-->
              <!--</li>-->
              <!--<li>-->
              <!--<a href="contacts.html">联系人</a>-->
              <!--</li>-->
              <!--<li>-->
              <!--<a href="mailbox.html">邮箱</a>-->
              <!--</li>-->
              <!--<li class="divider"></li>-->
              <!--<li>-->
              <!--&lt;!&ndash;<a href="login.html">注销</a>&ndash;&gt;-->
              <!--</li>-->
              <!--</ul>-->
            </div>
            <div class="logo-element">
              {{ user.username }}
            </div>
          </li>
          <li
            v-for="one in menus"
            :key="one.name"
            @click.stop="triggle(one)"
            :class="[one.active ? 'active' : '']"
          >
            <a href="javascript:;">
              <i class="fa" :class="one.icon"></i>
              <span class="nav-label">{{ one.name }}</span>
              <span class="fa arrow" v-show="one.children"></span>
            </a>
            <ul
              class="nav nav-second-level collapse"
              v-show="one.children && one.children.length > 0"
              :class="[one.active ? 'in' : '']"
            >
              <li
                v-for="two in one.children"
                :key="two.name"
                @click.stop="triggle(two)"
                :class="[two.active ? 'active' : '']"
              >
                <a href="javascript:;">
                  <!-- <i class="fa" :class="two.icon"></i> -->
                  {{ two.name }}
                  <span class="fa arrow" v-show="two.children"></span>
                </a>
                <ul
                  class="nav nav-third-level collapse"
                  v-show="two.children && two.children.length > 0"
                  :class="[two.active ? 'in' : '']"
                >
                  <li
                    v-for="three in two.children"
                    :key="three.name"
                    @click.stop="triggle(three)"
                    :class="[three.active ? 'active' : '']"
                  >
                    <a href="javascript:;">
                      <!-- <i class="fa" :class="three.icon"></i> -->
                      {{ three.name }}
                      <span class="fa arrow" v-if="three.children"></span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentUrl: '',
      menus: [],
      user: {
        username: '',
        role: ''
      },
      oldMenus: ''
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  created () {
    this.currentUser()
  },
  methods: {
    triggle (one) {
      if (one.children && one.children.length > 0) {
        one.active = !one.active
        this.$forceUpdate()
      } else {
        this.$router.push({ path: one.path })
      }
    },
    updateMenu () {
      this.currentUrl = this.$route.path
      this.oldMenus = JSON.parse(JSON.stringify(this.menus))
      this.clearSelect()
      // 是否有已经选中的菜单
      let hasSelect = false
      this.menus.forEach(one => {
        if (this.currentUrl === one.path && !one.children) {
          one.active = true
          hasSelect = true
        }
        if (one.children && one.children.length > 0) {
          one.children.forEach(two => {
            if (this.currentUrl === two.path && !two.children) {
              two.active = true
              one.active = true
              hasSelect = true
            }
            if (two.children) {
              two.children.forEach(three => {
                if (this.currentUrl === three.path) {
                  three.active = true
                  two.active = true
                  one.active = true
                  hasSelect = true
                }
              })
            }
          })
        }
      })
      if (hasSelect) {
        this.$forceUpdate()
      } else {
        this.menus = this.oldMenus
      }
    },
    clearSelect () {
      this.menus.forEach(one => {
        one.active = false
        if (one.children && one.children.length > 0) {
          one.children.forEach(two => {
            two.active = false
            if (two.children) {
              two.children.forEach(three => {
                three.active = false
              })
            }
          })
        }
      })
    },
    currentUser () {
      const user = {
        username: window.sessionStorage.getItem('username'),
        role: 'adc'
      }
      this.user = user
    }
  },
  watch: {
    data: function (val) {
      this.menus = this.data
      this.updateMenu()
    },
    $route: function (val) {
      this.updateMenu()
    }
  }
}
</script>
<style scoped></style>
