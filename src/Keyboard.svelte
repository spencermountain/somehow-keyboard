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
    border: 1px solid grey;
    border-radius: 3px;
    /* width: 50px; */
    flex: 1;
    /* height: 30px; */
    height: 80%;
    /* margin: 3px; */
    margin: 0.5%;
    color: #fbfbfb;
    box-sizing: border-box;
  }
  .show {
    /* border: 2px solid #d68881; */
    background-color: #2d85a8;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
    color: #d7d5d2;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
</style>

<div class="container" bind:clientWidth={w} style="max-height:{height}px;">
  <div class="row">
    <div class="key" style="background-color:{$keys['`'].color};flex:0.7;" class:show={$keys['`']}>~</div>
    <div class="key" style="background-color:{$keys['1'].color};" class:show={$keys['1']}>!</div>
    <div class="key" style="background-color:{$keys['2'].color};" class:show={$keys['2']}>@</div>
    <div class="key" style="background-color:{$keys['3'].color};" class:show={$keys['3']}>#</div>
    <div class="key" style="background-color:{$keys['4'].color};" class:show={$keys['4']}>$</div>
    <div class="key" style="background-color:{$keys['5'].color};" class:show={$keys['5']}>%</div>
    <div class="key" style="background-color:{$keys['6'].color};" class:show={$keys['6']}>^</div>
    <div class="key" style="background-color:{$keys['7'].color};" class:show={$keys['7']}>&</div>
    <div class="key" style="background-color:{$keys['8'].color};" class:show={$keys['8']}>{$keys['8'].show}</div>
    <div class="key" style="background-color:{$keys['9'].color};" class:show={$keys['9']}>(</div>
    <div class="key" style="background-color:{$keys['0'].color};" class:show={$keys['0']}>)</div>
    <div class="key" style="background-color:{$keys['-'].color};" class:show={$keys['-']}>-</div>
    <div class="key" style="background-color:{$keys['='].color};" class:show={$keys['=']}>=</div>
    <div class="key" style="background-color:{$keys['del'].color}; flex:1.5;" class:show={$keys['del']}>⟵</div>
  </div>
  <div class="row">
    <div class="key" style="background-color:{$keys['tab'].color};" class:show={$keys['tab']} />
    <div class="key" style="background-color:{$keys['q'].color};" class:show={$keys['q']}>q</div>
    <div class="key" style="background-color:{$keys['w'].color};" class:show={$keys['w']}>w</div>
    <div class="key" style="background-color:{$keys['e'].color};" class:show={$keys['e']}>e</div>
    <div class="key" style="background-color:{$keys['r'].color};" class:show={$keys['r']}>r</div>
    <div class="key" style="background-color:{$keys['t'].color};" class:show={$keys['t']}>t</div>
    <div class="key" style="background-color:{$keys['y'].color};" class:show={$keys['y']}>y</div>
    <div class="key" style="background-color:{$keys['u'].color};" class:show={$keys['u']}>u</div>
    <div class="key" style="background-color:{$keys['i'].color};" class:show={$keys['i']}>i</div>
    <div class="key" style="background-color:{$keys['o'].color};" class:show={$keys['o']}>o</div>
    <div class="key" style="background-color:{$keys['p'].color};" class:show={$keys['p']}>p</div>
    <div class="key" style="background-color:{$keys['['].color};" class:show={$keys['[']}>[</div>
    <div class="key" style="background-color:{$keys[']'].color};" class:show={$keys[']']}>]</div>
    <div class="key" style="background-color:{$keys['\\'].color};" class:show={$keys["'"]}>\</div>
  </div>
  <div class="row">
    <div class="key" style="flex:1.6;" class:show={$keys['caps']} />
    <div class="key" style="background-color:{$keys['a'].color};" class:show={$keys['a']}>a</div>
    <div class="key" style="background-color:{$keys['s'].color};" class:show={$keys['s']}>s</div>
    <div class="key" style="background-color:{$keys['d'].color};" class:show={$keys['d']}>d</div>
    <div class="key" style="background-color:{$keys['f'].color};" class:show={$keys['f']}>f</div>
    <div class="key" style="background-color:{$keys['g'].color};" class:show={$keys['g']}>g</div>
    <div class="key" style="background-color:{$keys['h'].color};" class:show={$keys['h']}>h</div>
    <div class="key" style="background-color:{$keys['j'].color};" class:show={$keys['j']}>j</div>
    <div class="key" style="background-color:{$keys['k'].color};" class:show={$keys['k']}>k</div>
    <div class="key" style="background-color:{$keys['l'].color};" class:show={$keys['l']}>l</div>
    <div class="key" style="background-color:{$keys[';'].color};" class:show={$keys[';']}>;</div>
    <div class="key" style="background-color:{$keys["'"].color};" class:show={$keys["'"]}>'</div>
    <div class="key" style="background-color:{$keys['enter'].color}; flex:1.6;" class:show={$keys['enter']}>↵</div>
  </div>
  <div class="row">
    <div class="key" style="flex:2.2;" class:show={$keys['lshift']}>⇧</div>
    <div class="key" style="background-color:{$keys['z'].color};" class:show={$keys['z']}>z</div>
    <div class="key" style="background-color:{$keys['x'].color};" class:show={$keys['x']}>x</div>
    <div class="key" style="background-color:{$keys['c'].color};" class:show={$keys['c']}>c</div>
    <div class="key" style="background-color:{$keys['v'].color};" class:show={$keys['v']}>v</div>
    <div class="key" style="background-color:{$keys['b'].color};" class:show={$keys['b']}>b</div>
    <div class="key" style="background-color:{$keys['n'].color};" class:show={$keys['n']}>n</div>
    <div class="key" style="background-color:{$keys['m'].color};" class:show={$keys['m']}>m</div>
    <div class="key" style="background-color:{$keys[','].color};" class:show={$keys[',']}>,</div>
    <div class="key" style="background-color:{$keys['.'].color};" class:show={$keys['.']}>.</div>
    <div class="key" style="background-color:{$keys['/'].color};" class:show={$keys['/']}>/</div>
    <div class="key" style="flex:2.2;" class:show={$keys['rshift']}>⇧</div>
  </div>
  <div class="row">
    <div class="key" style="background-color:{$keys['lctrl'].color}; flex:1.4;" class:show={$keys['lctrl']}>⌃</div>
    <div class="key" style="background-color:{$keys['lopt'].color}; flex:1.4;" class:show={$keys['lopt']}>⌥</div>
    <div class="key" style="background-color:{$keys['lcmd'].color}; flex:1.4;" class:show={$keys['lcmd']}>⌘</div>
    <div class="key" style="background-color:{$keys['space'].color}; flex:6.8;" class:show={$keys['space']} />
    <div class="key" style="background-color:{$keys['rcmd'].color}; flex:1.4;" class:show={$keys['rcmd']}>⌘</div>
    <div class="key" style="background-color:{$keys['ropt'].color}; flex:1.4;" class:show={$keys['ropt']}>⌥</div>
    <div class="key" style="background-color:{$keys['rctrl'].color}; flex:1.4;" class:show={$keys['rctrl']}>⌃</div>
  </div>
</div>
<slot />
