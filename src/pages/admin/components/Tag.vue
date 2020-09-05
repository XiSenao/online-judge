<template>
  <div>
    <el-tag
      v-for="(tag, index) in showDynamicTags"
      :key="tag.name"
      closable
      :disable-transitions="false"
      @click.native="editTag(tag, index)"
      @close="handleClose(tag)">
      <span v-if="index != num">{{ tag.name }}</span>
      <input
        v-if="index == num"
        ref="editInput"
        v-model="words"
        class="custom_input"
        type="text"
        @keyup.enter="handleInput(tag, index)"
        @blur="handleInput(tag, index)">
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-button
      v-else
      v-show="checkR"
      class="button-new-tag"
      size="small"
      @click.native="showInput">{{ theme }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'StarInputTag',
  model: {
    prop: 'tagList',
    event: 'input'
  },
  props: {
    tagList: {
      type: Array,
      default () {
        return []
      }
    },
    theme: {
      type: String,
      default: '+ new Tag'
    },
    checkR: {
      type: Number,
      default: 0
    },
    saveList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      editList: [],
      inputVisible: false,
      inputValue: '',
      num: -1,
      words: ''
    }
  },
  computed: {
    dynamicTags: {
      get() {
        return this.tagList
      },
      set(tagList) {
        this.$emit('input', tagList)
      }
    },
    showDynamicTags () {
      const availableTags = this.dynamicTags.filter(res => {
        if (this.checkR === 1 || this.checkR === 0) {
          return res.status === this.checkR
        }
        return true
      })
      return availableTags
    }
  },
  methods: {
    unique(inputValue) {
      if (this.dynamicTags.some(res => res.name === inputValue)) {
        return false
      }
      return true
    },
    handleClose(tag) {
      const index = this.dynamicTags.indexOf(tag)
      if (!tag.id) {
        this.dynamicTags.splice(index, 1)
        return
      }
      this.dynamicTags[index].status = tag.status ? 0 : 1
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue && this.inputValue.trim()
      if (!inputValue) {
        return
      }
      const isRepeat = this.dynamicTags.some(res => res.name === inputValue)
      if (isRepeat) {
        this.$Message.info('Cannot create duplicate label')
        return
      }
      this.dynamicTags.push({
        id: 0,
        name: inputValue,
        status: 1
      })
      this.inputVisible = false
      this.inputValue = ''
    },
    editTag(tag, index) {
      this.num = index
      this.$nextTick(_ => {
					// 必须要在下一次渲染的时候获取editInput, 否则获取到的为undefined(Vue采取的是异步更新渲染)
        this.$refs.editInput[0].focus()
      })
      this.words = tag.name
    },
    handleInput(tag) {
      const words = this.words
      const index = this.dynamicTags.indexOf(tag)
      const saveList = this.saveList
      if (tag.name !== words && this.unique(words)) {
        if (tag.id) {
          let saveValue = saveList.filter(res => res.id === tag.id)
          saveValue = saveValue.length ? saveValue[0] : null
          if (saveValue) {
            const savaIndex = saveList.indexOf(saveValue)
            saveList.splice(savaIndex, 1)
          }
          this.saveList.push(tag)
        }
        this.dynamicTags[index].name = words
        this.words = ''
        this.num = -1
      } else if (tag.name === words) {
        this.words = ''
        this.num = -1
      } else {
        this.$Message.info('Cannot create duplicate label')
        return
      }
    }
  }
}
</script>
<style scoped>
	.el-tag+.el-tag {
		margin-left: 10px;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	.custom_input {
		width: 80px;
		height: 16px;
		outline: none;
		border: transparent;
		background-color: transparent;
		font-size: 12px;
		color: #B59059;
	}
</style>
