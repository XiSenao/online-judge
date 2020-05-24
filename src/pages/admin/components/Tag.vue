<template>
	<div>
		<el-tag
            v-for="(tag, index) in dynamicTags.filter(res => {
                if (checkR === 1 || checkR === 0) {
                    return res.status === checkR || res.status === checkR
                }
                return true
            })"
            :key="tag.name" closable
            :disable-transitions="false"
            @click.native="editTag(tag,index)"
            @close="handleClose(tag)">
			<span v-if="index!=num">{{tag.name}}</span>
			<input
                class="custom_input"
                type="text" v-model="words"
                v-if="index==num"
                ref="editInput"
                @keyup.enter.native="handleInput(tag,index)"
                @blur="handleInput(tag,index)">
		</el-tag>
		<el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
		</el-input>
		<el-button
            v-else
            v-show="checkR"
            class="button-new-tag"
            size="small"
            @click.native="showInput">{{theme}}</el-button>
	</div>
</template>

<script>
	export default {
		name: 'star-input-tag',
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
				default: '+ 新标签'
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
					return this.tagList;
				},
				set(tagList) {
					this.$emit('input', tagList);
				}
			}
		},
		methods: {
			unique(inputValue) {
				// let x = new Set(arr);
                // return [...x];
                if (this.dynamicTags.filter(res => {
					return res.name === inputValue
				}).length) {
					return false
                }
                return true
			},
			handleClose(tag) {
                let index = this.dynamicTags.indexOf(tag)
				if (!tag.id) {
					this.dynamicTags.splice(index, 1)
					return
				}
                this.dynamicTags[index].status = tag.status ? 0 : 1	
			},
			showInput() {
                this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
                let inputValue = this.inputValue && this.inputValue.trim();
				if (!inputValue) {
					return
				}
				if (this.dynamicTags.filter(res => {
					return res.name === inputValue 
				}).length) {
					this.$Message.info('不能创建重复标签')
					return 
				}
				this.dynamicTags.push({
					id: 0,
					name: inputValue,
					status: 1
				})
                this.inputVisible = false;
                this.inputValue = '';
			},
			editTag(tag, index) {
				this.num = index;
				this.$nextTick(_ => {
					this.$refs.editInput[0].focus();
				});
				this.words = tag.name;
			},
			handleInput(tag) {
                let words = this.words;
                let index = this.dynamicTags.indexOf(tag), saveList = this.saveList
				if (tag.name !== words && this.unique(words)) {
                    if (tag.id) {
                        let saveValue = saveList.filter(res => res.id === tag.id)
                        saveValue = saveValue.length ? saveValue[0] : null 
                        if (saveValue) {
                            let savaIndex = saveList.indexOf(saveValue)
                            saveList.splice(savaIndex, 1)
                        }
                        this.saveList.push(tag)
                    }
                    this.dynamicTags[index].name = words;
                    this.words = '';
                    this.num = -1;
				} else if (tag.name === words) {
                    this.words = '';
                    this.num = -1;
                } else {
                    this.$Message.info('不能创建重复标签')
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