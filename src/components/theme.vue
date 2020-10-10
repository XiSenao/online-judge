<template>
  <div class="theme">
    <el-popover
      v-model="visible"
      placement="top"
      width="230"
    >
      <div class="themes">
        <div
          v-for="(themeValue, themeKey, index) in themeMap"
          :key="index"
          class="theme-item"
          @click="changeTheme(themeKey)"
        >
          <div
            :style="themeValue.style"
            class="theme-icon"
          ></div>
          <p>{{ themeValue.title }}</p>
        </div>
      </div>
      <Icon
        slot="reference"
        :backdrop="true"
        type="skin"
      />
    </el-popover>
  </div>
</template>

<script type="text/ecmascript-6">
import variables from '@/styles/themes/variables'
import variablesWhite from '@/styles/themes/variables-white'
import variablesRed from '@/styles/themes/variables-red'
import { mapGetters, mapMutations } from 'vuex'

const themes = {
  white: 'white',
  dark: 'dark',
  red: 'red'
}
export default {
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters(['theme'])
  },
  created() {
    this.themeMap = {
      [themes.dark]: {
        title: '深色',
        file: variables,
        style: {
          backgroundColor: '#202020'
        }
      },
      [themes.white]: {
        title: '浅色',
        file: variablesWhite,
        style: {
          backgroundColor: '#F6F6F6',
          border: '1px solid #EBEAEA'
        }
      },
      [themes.red]: {
        title: '红色',
        file: variablesRed,
        style: {
          backgroundColor: '#D33A31'
        }
      }
    }
    // 默认浅色
    this.changeTheme(this.theme)
  },
  methods: {
    ...mapMutations({
      changeMyTheme: 'changeTheme'
    }),
    changeTheme(themeKey) {
      this.changeMyTheme(themeKey)
      const theme = this.themeMap[themeKey].file
      Object.keys(theme).forEach(key => {
        const value = theme[key]
        document.documentElement.style.setProperty(key, value)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.themes {
  @include flex-center();

  .theme-item {
    @include flex-center();
    flex-direction: column;
    margin: 0 8px;
    cursor: pointer;

    .theme-icon {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      margin-bottom: 4px;
    }
  }
}
</style>
