<template>
  <div class='g-inherit m-article p-setting'>
    <x-header class="m-tab" :left-options="{backText: ' '}">
      <h1 class="m-tab-top">{{config.title}}</h1>
      <a slot="left"></a>
      <a v-if='config.inputType!=="select" && config.enable' slot="right" @click='() => update()'>确定</a>
    </x-header>
    <group>
      <x-input  v-if='config.inputType==="text"' :placeholder="placeHolder" v-model='inputModel' ref='input' :disabled='!config.enable' :max='10'></x-input>
      <x-textarea v-else-if='config.inputType==="textarea"' :placeholder="placeHolder" v-model="inputModel" ref='input' :readonly='!config.enable' :max='30'></x-textarea>
      <cell v-else-if='config.inputType==="select"' v-for="(item, index) in selects" :key='index' value-align="left" @click.native='() => update(item.key)'>
        {{item.value}}
        <span v-if='inputModel === item.key' slot='child' width="25" height="25" class='icon-selected'></span>
      </cell>
    </group>
  </div>
</template>

<script>
import Utils from '../utils'

export default {
  data(){
    return {
      inputModel:'',
      placeHolder: ''
    }
  },
  computed: {
    config(){
      var config = this.$store.state.teamSettingConfig
      if (!config.teamId) { // 在此页面刷新直接回到上一页
        history.go(-1)
        return
      }
      this.inputModel = config.defaultValue ? config.defaultValue : ''
      this.placeHolder = config.placeHolder ? config.placeHolder : config.enable? '请输入':'无'
      return config
    },
    selects(){
      var map = Utils.teamConfigMap[this.config.updateKey]
      var list = []
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          list.push({'key':key, 'value': map[key]})
        }
      }
      return list
    }
  },
  mounted() {
    // 立即focus会引起切页时白屏，故增加timeout
    setTimeout(() => {
      this.$refs.input && this.$refs.input.focus()
    }, 500);
  },
  methods:{
    update(value){
      if (value===undefined && this.inputModel.length < 1) {
        this.$toast('请输入内容后提交')
        return
      }
      var callback = this.config.confirmCallback
      if(callback && typeof callback === 'function') {
        callback(this.config.teamId, this.config.updateKey, value? value: this.inputModel)
        return
      }
      this.$store.dispatch('showLoading')
      var action = this.config.updateInfoInTeam? 'updateInfoInTeam' : 'updateTeam'
      this.$store.dispatch('delegateTeamFunction',{
        functionName: action,
        options: {
          teamId: this.config.teamId,
          [this.config.updateKey]: value ? value: this.inputModel,
          done: (error, team)=>{
            this.$store.dispatch('hideLoading')
            if(error) {
              this.$toast(error)
            }else{
              this.$toast('更改成功')
              setTimeout(() => {
                history.go(-1)
              }, 200);
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .p-setting{
    background-color: #e6ebf0;
    padding-top: 4.6rem;
  }
  .weui-cell{
    background-color: white;
  }
  .select {
    img{
      position: absolute;
      right: 0;
    }
  }
  .icon-selected{
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
    background-size: 20rem;
    background-image: url(http://yx-web-nosdn.netease.im/webdoc/h5/im/icons.png);
    background-position: -3.7rem -2.95rem;
  }
</style>
