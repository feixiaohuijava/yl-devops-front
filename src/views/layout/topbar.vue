<template>
  <div class="row border-bottom">
    <nav
      class="navbar navbar-static-top"
      role="navigation"
      style="margin-bottom: 0"
    >
      <div class="navbar-header">
        <a href="javascript:;" class="navbar-minimalize minimalize-styl-2">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <ul class="nav navbar-top-links navbar-right">
        <li>
          <span class="m-r-sm text-muted welcome-message"
            >欢迎来到运维平台</span
          >
        </li>
        <li>
          <a @click="logout"> <i class="fa fa-sign-out"></i> 登出 </a>
        </li>
      </ul>
    </nav>
    <e-tags></e-tags>
  </div>
</template>
<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    'e-tags': require('../../components/Tags').default
  },
  mounted: function () {
    $('.navbar-minimalize').on('click', function (event) {
      event.preventDefault()
      $('body').toggleClass('mini-navbar')
      SmoothlyMenu()
    })
    function SmoothlyMenu () {
      if (
        !$('body').hasClass('mini-navbar') ||
        $('body').hasClass('body-small')
      ) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#side-menu').hide()
        // For smoothly turn on menu
        setTimeout(function () {
          $('#side-menu').fadeIn(400)
        }, 200)
      } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide()
        setTimeout(function () {
          $('#side-menu').fadeIn(400)
        }, 100)
      } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style')
      }
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style>
.border-bottom {
  background-color: #233645;
}
.navbar-fixed-top,
.navbar-static-top {
  background-color: #233645;
}
</style>
