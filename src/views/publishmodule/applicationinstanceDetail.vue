<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form :model="detailGroup" labelWidth="100px">
        <el-form-item prop="id" label="id">
          <el-input v-model="detailGroup.id" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item prop="applicationName" label="应用名">
          <el-input v-model="detailGroup.applicationName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="cluster" label="集群">
          <div v-if="detailGroup.cluster !== null">
            <el-input v-model="detailGroup.cluster.clusterName" style="width: 200px"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="namespace" label="命名空间">
          <div v-if="detailGroup.namespace !== null">
            <el-input v-model="detailGroup.namespace.namespaceName" style="width: 200px"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="project" label="项目  ">
          <div v-if="detailGroup.project !== null">
            <el-input v-model="detailGroup.project.projectName" style="width: 200px"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="subsystemNick" label="子系统中文名">
          <div v-if="detailGroup.subsystem !== null">
            <el-input v-model="detailGroup.subsystem.subsystemNick" style="width: 200px"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="environment" label="环境">
          <div v-if="detailGroup.environment !== null">
            <el-input v-model="detailGroup.environment.name" style="width: 200px"></el-input>
          </div>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button type="success" v-loading="loadingPreprocheMaster" @click="preprocheckmaster"-->
        <!--                     v-if="this.detailGroup.environment.name ==='pro' ">master预发布检测-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button type="success" v-loading="loadingPreprocheMaster" @click="applypublishmaster"
                     v-if="this.detailGroup.environment.name ==='pro' "> 申请master发布
          </el-button>
          <el-button type="success" v-loading="loadingPreprocheMaster" @click="applypublishhotfix"
                     v-if="this.detailGroup.environment.name ==='pro' "> 申请hotfix发布
          </el-button>
        </el-form-item>
        <!--        <el-form-item prop="commit_hotfix" label="hotfix" v-if="this.detailGroup.environment.name ==='pro' ">-->
        <!--          <div>-->
        <!--            <el-input placeholder="请输入hotfix分支的最新commit" v-model="detailGroup.commit_hotfix" style="width: 300px"-->
        <!--                      ></el-input>-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item>-->
        <!--          <el-button type="danger" v-loading="loadingPreprocheHotfix" @click="preprocheckhotfix"-->
        <!--                     v-if="this.detailGroup.environment.name ==='pro' ">hotfix预发布检测-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                loadingPreprocheMaster: false,
                loadingPreprocheHotfix: false,
                loadingapplydeploymaster: false,
                loadingapplydeployhotfix: false,
                application_id: null,
                detailGroup: {
                    id: null,
                    applicationName: null,
                    environment: null,
                    clusterName: null,
                    commit_hotfix: null
                },
                buttonChange: false
            }
        },
        created() {
            this.application_id = this.$route.params.id
            this.getPublishDetailApplicationIntance()
        },
        methods: {
            applypublishmaster() {
                this.$confirm('确认申请?', '提示', {type: 'warning'}).then(async () => {
                    const param = {
                        clusterId: this.detailGroup.cluster.id,
                        namespaceId: this.detailGroup.namespace.id,
                        environmentId: this.detailGroup.environment.id,
                        applicationName: this.detailGroup.applicationName,
                        deployType: 'master'
                    }
                    let res = await this.$http.publishapplyviewsetapi(param)
                    if (res.hasOwnProperty('results')) {
                        this.$router.push({name: 'publish_order'})
                    }
                }).catch(_ => {
                })
            },
            async applypublishhotfix() {
                this.$confirm('确认申请?', '提示', {type: 'warning'}).then(async () => {
                    const param = {
                        clusterId: this.detailGroup.cluster.id,
                        namespaceId: this.detailGroup.namespace.id,
                        environmentId: this.detailGroup.environment.id,
                        applicationName: this.detailGroup.applicationName,
                        deployType: 'hotfix'
                    }
                    let res = await this.$http.publishapplyviewsetapi(param)
                    if (res.hasOwnProperty('results')) {
                        this.$router.push({name: 'publish_order'})
                    }
                }).catch(_ => {
                })
            },
            // async preprocheckmaster() {
            //     this.loadingPreprocheMaster = true
            //     const param = {
            //         clusterId: this.detailGroup.cluster.id,
            //         namespaceId: this.detailGroup.namespace.id,
            //         environmentId: this.detailGroup.environment.id,
            //         applicationName: this.detailGroup.applicationName,
            //         deployType: 'master'
            //     }
            //     let res = await this.$http.preprocheckapi(param)
            //     this.$message.success(res.results)
            //     this.loadingPreprocheMaster = false
            // },
            // async preprocheckhotfix() {
            //     if (this.detailGroup.commit_hotfix) {
            //         this.loadingPreprocheHotfix = true
            //         const param = {
            //             clusterId: this.detailGroup.cluster.id,
            //             namespaceId: this.detailGroup.namespace.id,
            //             environmentId: this.detailGroup.environment.id,
            //             applicationName: this.detailGroup.applicationName,
            //             commit_hotfix: this.detailGroup.commit_hotfix,
            //             deployType: 'hotfix'
            //         }
            //         let res = await this.$http.preprocheckapi(param)
            //         this.$message.success(res.results)
            //         this.loadingPreprocheHotfix = false
            //     } else {
            //         this.$message.error('请输入hotfix分支的最新commit!')
            //     }
            // },
            async getPublishDetailApplicationIntance() {
                const param = {id: this.application_id}
                let res = await this.$http.getPublishDetailApplicationApi(param)
                this.detailGroup = res.results
            },
            getPerm() {
                let perm = JSON.parse(window.sessionStorage.getItem('permission'))
                if (perm.includes('add_brand')) {
                    this.buttonNew = true
                }
                if (perm.includes('delete_brand')) {
                    this.buttonDelete = true
                }
                if (perm.includes('change_brand')) {
                    this.buttonChange = true
                }
            },
            handleCommand(command) {
                let list = command.split('.')
                if (list[0] === 'delete') {
                    this.deleteSafeGroup(list[1])
                }
            }
        }
    }
</script>
<style scoped lang="less">
  .group-id {
    color: #409EFF;
    cursor: pointer;
  }

  .group-name {
    i {
      font-size: 16px;
      color: #f99;

      &:hover {
        color: #f00;
        font-size: 20px;
      }
    }
  }

  .warning {
    font-size: 12px;
    color: #999;
  }
</style>
