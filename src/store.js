import { writable } from 'svelte/store'
export let keys = writable({
  '`': {},
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  0: {},
  '-': {},
  '=': {},
  del: {},
  // 2nd row
  tab: {},
  q: {},
  w: {},
  e: {},
  r: {},
  t: {},
  y: {},
  u: {},
  i: {},
  o: {},
  p: {},
  '[': {},
  ']': {},
  '\\': {},
  // 3rd row
  caps: {},
  a: {},
  s: {},
  d: {},
  f: {},
  g: {},
  h: {},
  j: {},
  k: {},
  l: {},
  ';': {},
  "'": {},
  enter: {},
  // 4th row
  lshift: {},
  z: {},
  x: {},
  c: {},
  v: {},
  b: {},
  n: {},
  m: {},
  ',': {},
  '.': {},
  '/': {},
  rshift: {},
  // bottom row
  lctrl: {},
  lopt: {},
  lcmd: {},
  space: {},
  rcmd: {},
  ropt: {},
  rctrl: {},
})