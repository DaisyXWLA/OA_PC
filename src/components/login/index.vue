<style lang="less" scoped>
@gradient-color: #3788ee;
@bg-color: #f7f8fa;
@title-color: #3a3a3a;
@text-color: #7e7e7e;
@placeholder-color: #7e7e7e;
.login-vue {
  min-width: 1366px;
  overflow: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url(../../images/login/login_bg.png) no-repeat;
  background-size: cover;
  z-index: 1;
  .login-con {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    width: 70%;
    min-height: 70%;
    margin: auto;
    background: #fff;
    box-shadow: 0px 6px 41px 5px rgba(15, 98, 134, 0.15);
    border-radius: 6px;
    z-index: 3;
    .login-pic {
      position: absolute;
      width: 50%;
      height: 100%;
      float: left;
      text-align: center;
      overflow: hidden;
      img {
        width: 80%;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        margin: 0 auto;
        margin-left: 15%;
      }
    }
    .login-info-con {
      width: 50%;
      min-height: 100%;
      float: right;
      text-align: center;
      overflow: hidden;
      .login-info {
        width: 100%;
        height: 80%;
        margin: 0 auto;
        margin-top: 25%;
        margin-bottom: 10%;
        .login-title {
          font-size: 2em;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: rgba(18, 139, 241, 1);
          margin-bottom: 10%;
        }
        .login-name {
          .info;
          img {
            width: 5%;
          }
        }
        .login-pwd {
          .info;
        }
        .btn {
          width: 60%;
          margin: 0 auto;
          margin-top: 10%;
          button {
            font-size: 1em;
          }
        }
      }
    }
  }
  .copyright {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    letter-spacing: 1px;
    // margin-bottom: 5%;
    color: #fff;
    a {
      color: @text-color;
    }
    z-index: 2;
  }
  .info {
    width: 60%;
    margin: 5% auto;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    img {
      width: 4%;
      vertical-align: middle;
    }
    input {
      width: 90%;
      border: none;
      outline: none;
      background-color: rgba(0, 0, 0, 0);
      font-size: 1em;
      vertical-align: middle;
    }
    input::placeholder {
      font-size: 1em;
    }
  }
}
// /deep/ .h-notice.h-notify-show .h-notify-container{
//   max-width: 500px!important;
// }
</style>
<style lang="less">
.h-notice.h-notify-show .h-notify-container {
  max-width: 600px !important;
}
.h-notice-container {
  max-width: 600px;
}
</style>
<template>
  <div class="login-vue" @wheel.prevent>
    <div class="login-con">
      <div class="login-pic">
        <img src="../../images/login/login_pic.png" alt="企业智慧云办公平台" />
      </div>
      <div class="login-info-con">
        <div class="login-info">
          <div class="login-title">企业智慧云办公平台</div>
          <div class="login-name">
            <img src="../../images/login/user.png" alt="用户名" />
            <input type="text" placeholder="请输入用户名" v-model="login.username" autocomplete="off" />
          </div>
          <div class="login-pwd">
            <img src="../../images/login/pwd.png" alt="密码" />
            <input
              type="password"
              placeholder="请输入密码"
              v-model="login.password"
              @keyup.enter="submit"
              autocomplete="off"
            />
          </div>
          <div class="btn">
            <Button :loading="loading" block color="primary" size="l" @click="submit">登录</Button>
          </div>
        </div>
      </div>
    </div>
    <p class="copyright">Copyright © 2019 郑州海友科伟电子科技有限公司 ·</p>
  </div>
</template>
<script>
import Login from 'model/login/Login';
import announcementModel from 'model/inform/informList';
export default {
  data() {
    return {
      login: Login.parse({}),
      announcementList: announcementModel.parse({}),
      loading: false,
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      announcement: {}
    };
  },
  created() {
    let that = this;
    document.onkeydown = function(e) {
      e = window.event || e;
      if (that.$route.path == '/login' && (e.code == 'Enter' || e.code == 'enter')) {
        //验证在登录界面和按得键是回车键enter
        that.submitForm('submit'); //登录函数
      }
    };
  },
  mounted() {
    // this.getData();
  },
  methods: {
    submit() {
      this.loading = true;
      this.login.grant_type = 'password';
      Utils.saveLocal('token', 'Basic aHlrdy1vYTpoeWt3LW9hLXNlY3JldA==');
      R.Login.login(Login.dispose(this.login)).then(resp => {
        //console.log(resp)
        if (resp.message == 'Source must not be null') {
          this.$Message.error('用户名错误');
          this.loading = false;
        } else if (resp.oAuth2ErrorCode == 'invalid_grant') {
          this.$Message.error('密码错误，请重新输入');
          this.loading = false;
        } else if (resp.tokenType == 'bearer') {
          Utils.saveLocal('token', resp.tokenType + ' ' + resp.value);
          R.Login.getInfo(Login.dispose(this.login)).then(resp => {
            Utils.saveLocal('role', resp.roleModels);
            Utils.saveLocal('botten', resp.modelActions);
            Utils.saveLocal('userId', resp.id);
            this.$router.push({ path: '/Home' });
            this.loading = false;
          });
        }
      });
    },
    //通知公告弹窗
    notice(timeout) {
      this.$Notice({
        title: this.announcement.title,
        content: this.announcement.content,
        timeout: timeout,
        buttons: [
          {
            name: '关闭',
            type: 'cancel'
          }
        ]
      });
    },
    //获取通知公告
    getData() {
      this.announcementList.page = this.pagination.page;
      this.announcementList.size = this.pagination.size;
      R.announcement.announcement(announcementModel.dispose(this.announcementList)).then(resp => {
        if (resp.ok) {
          this.announcement = resp.body[0];
          if (this.announcement.showType == '登录界面') {
            this.notice(2000);
          }
        }
      });
    }
  }
};
</script>
