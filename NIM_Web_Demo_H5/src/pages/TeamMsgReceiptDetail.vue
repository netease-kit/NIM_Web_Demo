<template>
  <div class='g-inherit m-article p-msg-receipt'>
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <h1 class="m-tab-top">已读回执详情</h1>
      <a slot="left"></a>
    </x-header>
    <div class="g-body">
      <div class='select-bar'>
        <div class='item' :class='{active: selectIndex===0}' @click='selectIndex=0'>
          未读 ({{unreadAccounts.length}})
        </div>
        <div class='item' :class='{active: selectIndex===1}' @click='selectIndex=1'>
          已读 ({{readAccounts.length}})
        </div>
      </div>
    </div>
    <team-member :teamId='teamId' :advanced='true' :showAllMode='true' :filterAccount='selectIndex===0? unreadAccounts: readAccounts'></team-member>
  </div>
</template>

<script>
import TeamMember from './components/TeamMember.vue'

export default {
  data() {
    return {
      selectIndex: 0,
    }
  },
  computed: {
    teamId() {
      return /(\d+)-(\d+)/.exec(this.$route.params.msgInfo)[1]
    },
    idServer() {
      return /(\d+)-(\d+)/.exec(this.$route.params.msgInfo)[2]
    },
    readAccounts() {
      return this.$store.state.teamMsgReadsDetail.readAccounts
    },
    unreadAccounts() {
      return this.$store.state.teamMsgReadsDetail.unreadAccounts
    }
  },
  created() {
    this.$store.dispatch('delegateTeamFunction', {
      functionName: 'getTeamMsgReadAccounts',
      options: {
        teamMsgReceipt: {
          teamId: this.teamId,
          idServer: this.idServer
        },
        done: (error, obj, content)=>{
          if (!error) {
            this.$store.commit('initMsgReceiptDetail', content)
          }
        }
      }
    })
  },
  methods: {

  },
  components: {
    TeamMember
  }
}
</script>

<style>
  .m-article.p-msg-receipt {
    background: #ebeef3;

    .select-bar {
      display: flex;
      width: 100%;
      height: 3rem;
      background: #fff;
      
      .item {
        height: 3rem;
        width: 50%;
        line-height: 3rem;
        box-sizing: border-box;
        text-align: center;

        &.active {
          color: #0091e4;
          border-bottom: #0091e4 5px solid;
        }
      }
    }
  }
</style>
