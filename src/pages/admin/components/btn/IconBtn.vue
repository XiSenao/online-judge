<template>
  <div style="display: inline-block;">
    <el-tooltip :content="name" class="item" effect="dark" placement="top">
      <el-button :icon="'el-icon-fa-' + icon" :disabled="disabled" plain size="mini">
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'IconBtn',
    props: {
      name: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
