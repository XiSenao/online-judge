<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(h('i', {
          class: [
            icon, 'sub-el-icon', 'icon-right'
          ]
        }))
      } else {
        vnodes.push(h('svg', {
          'icon-class': icon
        }))
      }
    }
    if (title) {
      let iTitle = title
      iTitle = iTitle.replace(/\s+/g, '_')
      vnodes.push(h('span', {
        slot: 'title'
      }, context.parent.$i18n.t(`m.${iTitle}`)))
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: '#303133';
  width: 1em;
  height: 1em;
}
.icon-right {
  margin-right: 16px;
}
</style>
