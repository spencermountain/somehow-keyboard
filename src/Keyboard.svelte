<script>
  // fix a certain aspect-ratio
  let w = 400
  $: height = w * 0.3
  import { onMount } from 'svelte'
  import { keys } from './store'

  onMount(() => {
    $keys = $keys
  })
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    align-self: stretch;
    width: 100%;
    height: 500px;
    font-size: 0.1px;
  }
  .row {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    flex-wrap: nowrap;
    align-self: stretch;
  }
  .key {
    /* border: 1px solid grey; */
    border-radius: 3px;
    flex: 1;
    height: 80%;
    margin: 0.5%;
    color: #fbfbfb;
    box-sizing: border-box;
    box-shadow: 1px 2px 4px 0px rgba(0, 0, 0, 0.2);
  }
  .show {
    box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, 0.2);
    border: none;
    color: #d7d5d2;
    opacity: 0.9;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
</style>

<div class="container" bind:clientWidth={w} style="max-height:{height}px;">
  <div class="row">
    <div class="key" style="background-color:{$keys['`'].color};flex:0.7;" class:show={$keys['`'].color}>
      {$keys['`'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['1'].color};" class:show={$keys['1'].color}>
      {$keys['1'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['2'].color};" class:show={$keys['2'].color}>
      {$keys['2'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['3'].color};" class:show={$keys['3'].color}>
      {$keys['3'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['4'].color};" class:show={$keys['4'].color}>
      {$keys['4'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['5'].color};" class:show={$keys['5'].color}>
      {$keys['5'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['6'].color};" class:show={$keys['6'].color}>
      {$keys['6'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['7'].color};" class:show={$keys['7'].color}>
      {$keys['7'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['8'].color};" class:show={$keys['8'].color}>
      {$keys['8'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['9'].color};" class:show={$keys['9'].color}>
      {$keys['9'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['0'].color};" class:show={$keys['0'].color}>
      {$keys['0'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['-'].color};" class:show={$keys['-'].color}>
      {$keys['-'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['='].color};" class:show={$keys['='].color}>
      {$keys['='].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['del'].color}; opacity:{$keys['del'].opacity}; flex:1.5;"
      class:show={$keys['del'].color}>
      {$keys['del'].show || ''}
    </div>
  </div>
  <div class="row">
    <div
      class="key"
      style="background-color:{$keys['tab'].color}; opacity:{$keys['tab'].opacity};"
      class:show={$keys['tab'].color}>
      {$keys['tab'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['q'].color};" class:show={$keys['q'].color}>
      {$keys['q'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['w'].color};" class:show={$keys['w'].color}>
      {$keys['w'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['e'].color};" class:show={$keys['e'].color}>
      {$keys['e'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['r'].color};" class:show={$keys['r'].color}>
      {$keys['r'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['t'].color};" class:show={$keys['t'].color}>
      {$keys['t'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['y'].color};" class:show={$keys['y'].color}>
      {$keys['y'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['u'].color};" class:show={$keys['u'].color}>
      {$keys['u'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['i'].color};" class:show={$keys['i'].color}>
      {$keys['i'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['o'].color};" class:show={$keys['o'].color}>
      {$keys['o'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['p'].color};" class:show={$keys['p'].color}>
      {$keys['p'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['['].color};" class:show={$keys['['].color}>
      {$keys['['].show || ''}
    </div>
    <div class="key" style="background-color:{$keys[']'].color};" class:show={$keys[']'].color}>
      {$keys[']'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['\\'].color};" class:show={$keys['\\'].color}>
      {$keys['\\'].show || ''}
    </div>
  </div>
  <div class="row">
    <div
      class="key"
      style="background-color:{$keys['caps'].color}; opacity:{$keys['caps'].opacity}; flex:1.6;"
      class:show={$keys['caps'].color}>
      {$keys['caps'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['a'].color};" class:show={$keys['a'].color}>
      {$keys['a'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['s'].color};" class:show={$keys['s'].color}>
      {$keys['s'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['d'].color};" class:show={$keys['d'].color}>
      {$keys['d'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['f'].color};" class:show={$keys['f'].color}>
      {$keys['f'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['g'].color};" class:show={$keys['g'].color}>
      {$keys['g'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['h'].color};" class:show={$keys['h'].color}>
      {$keys['h'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['j'].color};" class:show={$keys['j'].color}>
      {$keys['j'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['k'].color};" class:show={$keys['k'].color}>
      {$keys['k'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['l'].color};" class:show={$keys['l'].color}>
      {$keys['l'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys[';'].color};" class:show={$keys[';'].color}>
      {$keys[';'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys["'"].color};" class:show={$keys["'"].color}>
      {$keys["'"].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['enter'].color}; opacity:{$keys['enter'].opacity}; flex:1.6;"
      class:show={$keys['enter'].color}>
      {$keys['enter'].show || ''}
    </div>
  </div>
  <div class="row">
    <div
      class="key"
      style="background-color:{$keys['lshift'].color}; opacity:{$keys['lshift'].opacity}; flex:2.2;"
      class:show={$keys['lshift'].color}>
      {$keys['lshift'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['z'].color};" class:show={$keys['z'].color}>
      {$keys['z'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['x'].color};" class:show={$keys['x'].color}>
      {$keys['x'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['c'].color};" class:show={$keys['c'].color}>
      {$keys['c'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['v'].color};" class:show={$keys['v'].color}>
      {$keys['v'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['b'].color};" class:show={$keys['b'].color}>
      {$keys['b'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['n'].color};" class:show={$keys['n'].color}>
      {$keys['n'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['m'].color};" class:show={$keys['m'].color}>
      {$keys['m'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys[','].color};" class:show={$keys[','].color}>
      {$keys[','].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['.'].color};" class:show={$keys['.'].color}>
      {$keys['.'].show || ''}
    </div>
    <div class="key" style="background-color:{$keys['/'].color};" class:show={$keys['/'].color}>
      {$keys['/'].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['rshift'].color}; opacity:{$keys['rshift'].opacity}; flex:2.2;"
      class:show={$keys['rshift'].color}>
      {$keys['rshift'].show || ''}
    </div>
  </div>
  <div class="row">
    <div
      class="key"
      style="background-color:{$keys['lctrl'].color}; opacity:{$keys['lctrl'].opacity}; flex:1.4;"
      class:show={$keys['lctrl'].color}>
      {$keys['lctrl'].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['lopt'].color}; opacity:{$keys['lopt'].opacity}; flex:1.4;"
      class:show={$keys['lopt'].color}>
      {$keys['lopt'].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['lcmd'].color}; opacity:{$keys['lcmd'].opacity}; flex:1.4;"
      class:show={$keys['lcmd'].color}>
      {$keys['lcmd'].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['space'].color}; opacity:{$keys['space'].opacity}; flex:6.8;"
      class:show={$keys['space'].color}>
      {$keys['space'].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['rcmd'].color}; opacity:{$keys['rcmd'].opacity}; flex:1.4;"
      class:show={$keys['rcmd'].color}>
      {$keys['rcmd'].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['ropt'].color}; opacity:{$keys['ropt'].opacity}; flex:1.4;"
      class:show={$keys['ropt'].color}>
      {$keys['ropt'].show || ''}
    </div>
    <div
      class="key"
      style="background-color:{$keys['rctrl'].color}; opacity:{$keys['rctrl'].opacity}; flex:1.4;"
      class:show={$keys['rctrl'].color}>
      {$keys['rctrl'].show || ''}
    </div>
  </div>
</div>
<slot />
