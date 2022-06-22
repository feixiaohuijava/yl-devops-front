<template>
  <div class="main">
    <div class="wrapper wrapper-content animated fadeIn">
      <div class="wrapper wrapper-content">
        <div class="current-duty">
          <h1 class="be-duty">
            账号授权,发版操作请联系今日运维值班人员
          </h1>
          <el-form label-width="120px" class="form-duty">
            <el-form-item label="运维值班人员:" class="color">
              <el-input
                v-model="currentDutyMember"
                style="width: 250px;font-size:16px"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话:" class="color">
              <el-input
                v-model="phone"
                style="width: 250px;font-size:16px"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="div-row">
          <!-- <div class="col-lg-1"></div> -->
          <div class="col">
            <div class="ibox">
              <div class="icon-host icon">
                <i class="el-icon-monitor el-icon"></i>
              </div>
              <div class="rigth">
                <h1 class="no-margins">{{ this.host }}</h1>
                <span>主机</span>
              </div>
              <!-- <div class="ibox-title">
                <span class="label label-success float-right">主机</span>
              </div>
              <div class="ibox-content">
                <h1 class="no-margins">{{ this.host }}</h1>
              </div> -->
            </div>
          </div>
          <div class="col">
            <div class="ibox">
              <div class="icon-cluster icon">
                <i class="el-icon-date el-icon"></i>
              </div>
              <div class="rigth">
                <h1 class="no-margins">{{ this.cluster }}</h1>
                <span>集群</span>
              </div>
              <!-- <div class="ibox-title">
                <span class="label label-primary float-right">集群</span>
              </div>
              <div class="ibox-content">
                <h1 class="no-margins">{{ this.cluster }}</h1>
              </div> -->
            </div>
          </div>
          <div class="col">
            <div class="ibox">
              <div class="icon-idc icon">
                <i class="el-icon-postcard el-icon"></i>
              </div>
              <div class="rigth">
                <h1 class="no-margins">{{ this.idc }}</h1>
                <span>IDC</span>
              </div>
              <!-- <div class="ibox-title">
                <span class="label label-warning float-right">IDC</span>
              </div>
              <div class="ibox-content">
                <h1 class="no-margins">{{ this.idc }}</h1>
              </div> -->
            </div>
          </div>
          <div class="col">
            <div class="ibox">
              <div class="icon-room icon">
                <i class="el-icon-house el-icon"></i>
              </div>
              <div class="rigth">
                <h1 class="no-margins">{{ this.room }}</h1>
                <span>机房</span>
              </div>
              <!-- <div class="ibox-title">
                <span class="label label-warning float-right">机房</span>
              </div>
              <div class="ibox-content">
                <h1 class="no-margins">{{ this.room }}</h1>
              </div> -->
            </div>
          </div>
          <div class="col">
            <div class="ibox">
              <div class="icon-cabinet icon">
                <i class="el-icon-printer el-icon"></i>
              </div>
              <div class="rigth">
                <h1 class="no-margins">{{ this.cabinet }}</h1>
                <span>机柜</span>
              </div>
              <!-- <div class="ibox-title">
                <span class="label label-warning float-right">机柜</span>
              </div>
              <div class="ibox-content">
                <h1 class="no-margins">{{ this.cabinet }}</h1>
              </div> -->
            </div>
          </div>
          <!-- <div class="col-lg-1"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentDutyMember: null,
      phone: null,
      host: 0,
      cluster: 0,
      idc: 0,
      room: 0,
      cabinet: 0
    }
  },
  created () {
    this.getCurrentDuty()
  },
  methods: {
    async get_homepage () {
      let hostCount = await this.$http.getHostCount()
      this.host = hostCount['host_count']
      let clusetrCount = await this.$http.getClusterCount()
      this.cluster = clusetrCount['cluster_count']
      let idcCount = await this.$http.getIdcCount()
      this.idc = idcCount['idc_count']
      let roomCount = await this.$http.getRoomCount()
      this.room = roomCount['machine_room_count']
      let cabinetCount = await this.$http.getCabinetCount()
      this.cabinet = cabinetCount['cabinet_count']
      console.log(this.host, this.cluster, this.idc, this.room, this.cabinet)
    },
    async getCurrentDuty () {
      let res = await this.$http.getcurrentdutyapi()
      this.currentDutyMember = res.results[0].username
      this.phone = res.results[0].phone
    }
  }
}
</script>
<style scoped lang="less">
.current-duty {
  width: 100%;
  height: 270px;
  background-color: #fff;
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  align-content: center;
  flex-direction: column;
  border-radius: 12px;
}
.be-duty {
  margin: 0 auto;
  /* background-image: linear-gradient(#d6eb00, #74b900); */
  /* width: 700px; */
  margin-bottom: 30px;
  height: 50px;
  font-size: 40px;
  text-align: center;
  line-height: 50px;
  font-weight: 500;
  color: #409eff;
}
.form-duty {
  justify-content: center;
  margin: 0 auto;
}
.col {
  background-color: #fff;
  height: 200px;
  width: 400px;
  border-radius: 12px;
  .ibox {
    display: flex;
    align-items: center;
    height: 200px;
  }
  .icon {
    display: flex;
    padding-top: 25px;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 50px;
    margin-left: 60px;
    .el-icon {
      font-size: 30px;
    }
  }
  .no-margins {
    font-size: 40px;
    color: #000;
    font-weight: 500;
  }
}
.icon-host {
  background-color: #f0ecfa;
  .el-icon-monitor {
    color: #a59be4;
  }
}
.icon-cluster {
  background-color: #f0f9fe;
  .el-icon-date {
    color: #81aef5;
  }
}
.icon-idc {
  background-color: #f6e0ec;
  .el-icon-postcard {
    color: #d47498;
  }
}
.icon-room {
  background-color: #fcf4f1;
  .el-icon-house {
    color: #db807b;
  }
}
.icon-cabinet {
  background-color: #eaf9da;
  .el-icon-printer {
    color: #5db400;
  }
}
.div-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 200px;
}
</style>
<style>
.color .el-form-item__label {
  font-size: 16px;
  color: #000;
}
</style>
