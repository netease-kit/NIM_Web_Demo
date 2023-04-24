<template>
  <div class='g-inherit m-article p-teamlist'>
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <h1 class="m-tab-top">{{pageTitle}}</h1>
      <a slot="left"></a>
    </x-header>
    <div class="m-list">
      <group>
        <cell v-for='team in teamList' :key='team.teamId' :title='team.name' is-link :link='`/chat/team-${team.teamId}`'>
          <span class="icon icon-team-advanced" slot="icon"></span>
        </cell>
      </group>
    </div>
    <div class='empty-hint' v-if='!teamList || teamList.length<1'>暂无内容</div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$nextTick(() => {
      this.teamType = this.$route.params.teamType
    })
  },
  data () {
    return {
      teamType: 'normal' // normal or advanced
    }
  },
  computed: {
    teamList: function () {
      return this.$store.state.teamlist && this.$store.state.teamlist.filter(team => {
        return team.type === this.teamType && team.validToCurrentUser
      })
    },
    pageTitle: function () {
      return this.teamType === 'advanced' ? '高级群' : '讨论组'
    }
  }
}
</script>

<style scoped>
  .p-teamlist {
    .m-list {
      padding-top: 3.6rem;
    }
    .empty-hint{
      position: absolute;
      left: 0;
      right: 0;
      top: 5rem;  
      margin: auto;
      text-align: center;
    }
  }
</style>

