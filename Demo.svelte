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
</style>

<div class="main">
  <div class="f2">
    <a class="link" href="https://github.com/spencermountain/somehow-keyboard/">somehow-keyboard</a>
  </div>
  <Keyboard>
    <Key key="8" fill="red" show="*" />
  </Keyboard>
</div>
