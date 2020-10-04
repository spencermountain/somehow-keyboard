<script>
  export let key = ''
  export let fill = ''
  export let color = fill

  import c from 'spencer-color'
  color = c.colors[color] || color

  export let show = ''
  import { onMount } from 'svelte'
  import { keys } from './store'
  if (key) {
    $keys[key] = {
      key,
      show,
      color,
    }
  }
</script>
