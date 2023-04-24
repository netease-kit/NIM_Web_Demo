<template>
  <div class="g-inherit m-article">
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <h1 class="m-tab-top">[ 备注名 ]</h1>
      <a slot="left"></a>
    </x-header>
    <group class="u-card">
      <x-input
        class="u-ipt-default"
        type="text"
        :required="false"
        v-model="alias"
        :max = "16"
        placeholder="请输入备注名">
        <span slot="label">备注：</span>
      </x-input>
    </group>
    <div>
      <x-button type="primary" action-type="button" @click.native="setAlias">设置备注名</x-button>
    </div>
  </div>
</template>

<script>
import util from '../utils'

export default {
  data () {
    return {
      alias: ''
    }
  },
  mounted(){
    let info = this.$store.state.userInfos[this.account] || {}
    this.alias = info.alias
  },
  computed: {
    account () {
      return this.$route.params.userId
    }
  },
  methods: {
    setAlias () {
      this.alias = this.alias.replace(/\n/g, ' ').replace(/\r/g, '')
      if (/^\s*$/.test(this.alias)) {
        // ...
      } else if (this.alias.length > 16) {
        this.$vux.alert.show({
          title: '备注不能超过16个字符'
        })
        return
      }
      this.$store.dispatch('updateFriend', {
        account: this.account,
        alias: this.alias
      })
      window.history.go(-1)
    }
  }
}
</script>
