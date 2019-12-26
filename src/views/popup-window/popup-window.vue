<script>
  export default {
    render (h, cxt) {
      return h(require(`./${this.component}`).default, {
        props: {
          prop: this.prop,
          componentId: this.componentId,
        },
      })
    },
    props: {
      component: String,
      componentId: String,
      prop: [Object, Array, String, Number]
    },
    methods: {
      eventListener: function(params) {
        this.$emit('eventListener', params)
      }
    }
  }
</script>
<style></style>