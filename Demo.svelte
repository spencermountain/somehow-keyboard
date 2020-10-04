<script>
  import { Keyboard, Key } from './src'
</script>

<style>
  .main {
    margin: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    align-self: stretch;
  }
  .link {
    color: steelblue;
    text-decoration: none;
    margin: 3rem;
  }
  .m3 {
    margin: 3rem;
  }
</style>

<div class="main">
  <div class="f2 m3">
    <a class="link" href="https://github.com/spencermountain/somehow-keyboard/">somehow-keyboard</a>
  </div>
  <Keyboard>
    <Key key="rshift" fill="red" show="" />
    <Key key="lshift" fill="red" show="" />
    <Key key="rctrl" fill="red" show="" />
    <Key key="ropt" fill="red" show="" />
    <Key key="rcmd" fill="red" show="" />
    <Key key="lctrl" fill="red" show="" />
    <Key key="lopt" fill="red" show="" />
    <Key key="lcmd" fill="red" show="" />
    <Key key="caps" fill="red" show="" />
    <Key key="space" fill="#94b4d4" show="" />
    <Key key="enter" fill="#94b4d4" show="" />
    <Key key="tab" fill="#94b4d4" show="" />
    <Key key="del" fill="#94b4d4" show="" />
  </Keyboard>
</div>
