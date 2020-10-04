
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ` +
            `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = `data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>`;
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let keys = writable({
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
    });

    /* src/Keyboard.svelte generated by Svelte v3.24.1 */
    const file = "src/Keyboard.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-1xqyb7b-style";
    	style.textContent = ".container.svelte-1xqyb7b{display:flex;flex-direction:column;justify-content:flex-start;align-items:center;text-align:center;flex-wrap:wrap;align-self:stretch;width:100%;height:500px;font-size:0.1px}.row.svelte-1xqyb7b{flex:1;display:flex;flex-direction:row;justify-content:flex-start;align-items:center;text-align:center;flex-wrap:nowrap;align-self:stretch}.key.svelte-1xqyb7b{border:1px solid grey;border-radius:3px;flex:1;height:80%;margin:0.5%;color:#fbfbfb;box-sizing:border-box}.show.svelte-1xqyb7b{background-color:#2d85a8;box-shadow:2px 2px 8px 0px rgba(0, 0, 0, 0.2);color:#d7d5d2;font-size:18px;display:flex;flex-direction:column;justify-content:space-around}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5Ym9hcmQuc3ZlbHRlIiwic291cmNlcyI6WyJLZXlib2FyZC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgLy8gZml4IGEgY2VydGFpbiBhc3BlY3QtcmF0aW9cbiAgbGV0IHcgPSA0MDBcbiAgJDogaGVpZ2h0ID0gdyAqIDAuM1xuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJ1xuICBpbXBvcnQgeyBrZXlzIH0gZnJvbSAnLi9zdG9yZSdcblxuICBvbk1vdW50KCgpID0+IHtcbiAgICAka2V5cyA9ICRrZXlzXG4gIH0pXG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBhbGlnbi1zZWxmOiBzdHJldGNoO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogNTAwcHg7XG4gICAgZm9udC1zaXplOiAwLjFweDtcbiAgfVxuICAucm93IHtcbiAgICBmbGV4OiAxO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZmxleC13cmFwOiBub3dyYXA7XG4gICAgYWxpZ24tc2VsZjogc3RyZXRjaDtcbiAgfVxuICAua2V5IHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICAvKiB3aWR0aDogNTBweDsgKi9cbiAgICBmbGV4OiAxO1xuICAgIC8qIGhlaWdodDogMzBweDsgKi9cbiAgICBoZWlnaHQ6IDgwJTtcbiAgICAvKiBtYXJnaW46IDNweDsgKi9cbiAgICBtYXJnaW46IDAuNSU7XG4gICAgY29sb3I6ICNmYmZiZmI7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuICAuc2hvdyB7XG4gICAgLyogYm9yZGVyOiAycHggc29saWQgI2Q2ODg4MTsgKi9cbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMmQ4NWE4O1xuICAgIGJveC1zaGFkb3c6IDJweCAycHggOHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gICAgY29sb3I6ICNkN2Q1ZDI7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgfVxuPC9zdHlsZT5cblxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIGJpbmQ6Y2xpZW50V2lkdGg9e3d9IHN0eWxlPVwibWF4LWhlaWdodDp7aGVpZ2h0fXB4O1wiPlxuICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ2AnXS5jb2xvcn07ZmxleDowLjc7XCIgY2xhc3M6c2hvdz17JGtleXNbJ2AnXX0+fjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWycxJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWycxJ119PiE8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snMiddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snMiddfT5APC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJzMnXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJzMnXX0+IzwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyc0J10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWyc0J119PiQ8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snNSddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snNSddfT4lPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJzYnXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJzYnXX0+XjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyc3J10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWyc3J119PiY8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snOCddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snOCddfT57JGtleXNbJzgnXS5zaG93fTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyc5J10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWyc5J119Pig8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snMCddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snMCddfT4pPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJy0nXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJy0nXX0+LTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyc9J10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWyc9J119Pj08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snZGVsJ10uY29sb3J9OyBmbGV4OjEuNTtcIiBjbGFzczpzaG93PXska2V5c1snZGVsJ119PuKftTwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyd0YWInXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ3RhYiddfSAvPlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydxJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWydxJ119PnE8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1sndyddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1sndyddfT53PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ2UnXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ2UnXX0+ZTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydyJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWydyJ119PnI8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1sndCddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1sndCddfT50PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ3knXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ3knXX0+eTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyd1J10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWyd1J119PnU8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snaSddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snaSddfT5pPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ28nXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ28nXX0+bzwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydwJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWydwJ119PnA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snWyddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snWyddfT5bPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ10nXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ10nXX0+XTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydcXFxcJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzW1wiJ1wiXX0+XFw8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJmbGV4OjEuNjtcIiBjbGFzczpzaG93PXska2V5c1snY2FwcyddfSAvPlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydhJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWydhJ119PmE8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1sncyddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1sncyddfT5zPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ2QnXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ2QnXX0+ZDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydmJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWydmJ119PmY8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snZyddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snZyddfT5nPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ2gnXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ2gnXX0+aDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydqJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWydqJ119Pmo8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snayddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snayddfT5rPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ2wnXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ2wnXX0+bDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyc7J10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWyc7J119Pjs8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1tcIidcIl0uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzW1wiJ1wiXX0+JzwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydlbnRlciddLmNvbG9yfTsgZmxleDoxLjY7XCIgY2xhc3M6c2hvdz17JGtleXNbJ2VudGVyJ119PuKGtTwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImZsZXg6Mi4yO1wiIGNsYXNzOnNob3c9eyRrZXlzWydsc2hpZnQnXX0+4oenPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ3onXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ3onXX0+ejwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWyd4J10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWyd4J119Png8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snYyddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snYyddfT5jPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ3YnXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ3YnXX0+djwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydiJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWydiJ119PmI8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snbiddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snbiddfT5uPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ20nXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJ20nXX0+bTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWycsJ10uY29sb3J9O1wiIGNsYXNzOnNob3c9eyRrZXlzWycsJ119Piw8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snLiddLmNvbG9yfTtcIiBjbGFzczpzaG93PXska2V5c1snLiddfT4uPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJy8nXS5jb2xvcn07XCIgY2xhc3M6c2hvdz17JGtleXNbJy8nXX0+LzwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImZsZXg6Mi4yO1wiIGNsYXNzOnNob3c9eyRrZXlzWydyc2hpZnQnXX0+4oenPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ2xjdHJsJ10uY29sb3J9OyBmbGV4OjEuNDtcIiBjbGFzczpzaG93PXska2V5c1snbGN0cmwnXX0+4oyDPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ2xvcHQnXS5jb2xvcn07IGZsZXg6MS40O1wiIGNsYXNzOnNob3c9eyRrZXlzWydsb3B0J119PuKMpTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydsY21kJ10uY29sb3J9OyBmbGV4OjEuNDtcIiBjbGFzczpzaG93PXska2V5c1snbGNtZCddfT7ijJg8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1snc3BhY2UnXS5jb2xvcn07IGZsZXg6Ni44O1wiIGNsYXNzOnNob3c9eyRrZXlzWydzcGFjZSddfSAvPlxuICAgIDxkaXYgY2xhc3M9XCJrZXlcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6eyRrZXlzWydyY21kJ10uY29sb3J9OyBmbGV4OjEuNDtcIiBjbGFzczpzaG93PXska2V5c1sncmNtZCddfT7ijJg8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwia2V5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnska2V5c1sncm9wdCddLmNvbG9yfTsgZmxleDoxLjQ7XCIgY2xhc3M6c2hvdz17JGtleXNbJ3JvcHQnXX0+4oylPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImtleVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7JGtleXNbJ3JjdHJsJ10uY29sb3J9OyBmbGV4OjEuNDtcIiBjbGFzczpzaG93PXska2V5c1sncmN0cmwnXX0+4oyDPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG48c2xvdCAvPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWFFLFVBQVUsZUFBQyxDQUFDLEFBQ1YsT0FBTyxDQUFFLElBQUksQ0FDYixjQUFjLENBQUUsTUFBTSxDQUN0QixlQUFlLENBQUUsVUFBVSxDQUMzQixXQUFXLENBQUUsTUFBTSxDQUNuQixVQUFVLENBQUUsTUFBTSxDQUNsQixTQUFTLENBQUUsSUFBSSxDQUNmLFVBQVUsQ0FBRSxPQUFPLENBQ25CLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLEtBQUssQ0FDYixTQUFTLENBQUUsS0FBSyxBQUNsQixDQUFDLEFBQ0QsSUFBSSxlQUFDLENBQUMsQUFDSixJQUFJLENBQUUsQ0FBQyxDQUNQLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLEdBQUcsQ0FDbkIsZUFBZSxDQUFFLFVBQVUsQ0FDM0IsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsU0FBUyxDQUFFLE1BQU0sQ0FDakIsVUFBVSxDQUFFLE9BQU8sQUFDckIsQ0FBQyxBQUNELElBQUksZUFBQyxDQUFDLEFBQ0osTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUN0QixhQUFhLENBQUUsR0FBRyxDQUVsQixJQUFJLENBQUUsQ0FBQyxDQUVQLE1BQU0sQ0FBRSxHQUFHLENBRVgsTUFBTSxDQUFFLElBQUksQ0FDWixLQUFLLENBQUUsT0FBTyxDQUNkLFVBQVUsQ0FBRSxVQUFVLEFBQ3hCLENBQUMsQUFDRCxLQUFLLGVBQUMsQ0FBQyxBQUVMLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIsVUFBVSxDQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUM5QyxLQUFLLENBQUUsT0FBTyxDQUNkLFNBQVMsQ0FBRSxJQUFJLENBQ2YsT0FBTyxDQUFFLElBQUksQ0FDYixjQUFjLENBQUUsTUFBTSxDQUN0QixlQUFlLENBQUUsWUFBWSxBQUMvQixDQUFDIn0= */";
    	append_dev(document.head, style);
    }

    function create_fragment(ctx) {
    	let div65;
    	let div14;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let div3;
    	let t6;
    	let t7;
    	let div4;
    	let t8;
    	let t9;
    	let div5;
    	let t10;
    	let t11;
    	let div6;
    	let t12;
    	let t13;
    	let div7;
    	let t14;
    	let t15;
    	let div8;
    	let t16_value = /*$keys*/ ctx[2]["8"].show + "";
    	let t16;
    	let t17;
    	let div9;
    	let t18;
    	let t19;
    	let div10;
    	let t20;
    	let t21;
    	let div11;
    	let t22;
    	let t23;
    	let div12;
    	let t24;
    	let t25;
    	let div13;
    	let t26;
    	let t27;
    	let div29;
    	let div15;
    	let t28;
    	let div16;
    	let t29;
    	let t30;
    	let div17;
    	let t31;
    	let t32;
    	let div18;
    	let t33;
    	let t34;
    	let div19;
    	let t35;
    	let t36;
    	let div20;
    	let t37;
    	let t38;
    	let div21;
    	let t39;
    	let t40;
    	let div22;
    	let t41;
    	let t42;
    	let div23;
    	let t43;
    	let t44;
    	let div24;
    	let t45;
    	let t46;
    	let div25;
    	let t47;
    	let t48;
    	let div26;
    	let t49;
    	let t50;
    	let div27;
    	let t51;
    	let t52;
    	let div28;
    	let t53;
    	let t54;
    	let div43;
    	let div30;
    	let t55;
    	let div31;
    	let t56;
    	let t57;
    	let div32;
    	let t58;
    	let t59;
    	let div33;
    	let t60;
    	let t61;
    	let div34;
    	let t62;
    	let t63;
    	let div35;
    	let t64;
    	let t65;
    	let div36;
    	let t66;
    	let t67;
    	let div37;
    	let t68;
    	let t69;
    	let div38;
    	let t70;
    	let t71;
    	let div39;
    	let t72;
    	let t73;
    	let div40;
    	let t74;
    	let t75;
    	let div41;
    	let t76;
    	let t77;
    	let div42;
    	let t78;
    	let t79;
    	let div56;
    	let div44;
    	let t81;
    	let div45;
    	let t82;
    	let t83;
    	let div46;
    	let t84;
    	let t85;
    	let div47;
    	let t86;
    	let t87;
    	let div48;
    	let t88;
    	let t89;
    	let div49;
    	let t90;
    	let t91;
    	let div50;
    	let t92;
    	let t93;
    	let div51;
    	let t94;
    	let t95;
    	let div52;
    	let t96;
    	let t97;
    	let div53;
    	let t98;
    	let t99;
    	let div54;
    	let t100;
    	let t101;
    	let div55;
    	let t103;
    	let div64;
    	let div57;
    	let t104;
    	let t105;
    	let div58;
    	let t106;
    	let t107;
    	let div59;
    	let t108;
    	let t109;
    	let div60;
    	let t110;
    	let div61;
    	let t111;
    	let t112;
    	let div62;
    	let t113;
    	let t114;
    	let div63;
    	let t115;
    	let div65_resize_listener;
    	let t116;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div65 = element("div");
    			div14 = element("div");
    			div0 = element("div");
    			t0 = text("~");
    			t1 = space();
    			div1 = element("div");
    			t2 = text("!");
    			t3 = space();
    			div2 = element("div");
    			t4 = text("@");
    			t5 = space();
    			div3 = element("div");
    			t6 = text("#");
    			t7 = space();
    			div4 = element("div");
    			t8 = text("$");
    			t9 = space();
    			div5 = element("div");
    			t10 = text("%");
    			t11 = space();
    			div6 = element("div");
    			t12 = text("^");
    			t13 = space();
    			div7 = element("div");
    			t14 = text("&");
    			t15 = space();
    			div8 = element("div");
    			t16 = text(t16_value);
    			t17 = space();
    			div9 = element("div");
    			t18 = text("(");
    			t19 = space();
    			div10 = element("div");
    			t20 = text(")");
    			t21 = space();
    			div11 = element("div");
    			t22 = text("-");
    			t23 = space();
    			div12 = element("div");
    			t24 = text("=");
    			t25 = space();
    			div13 = element("div");
    			t26 = text("⟵");
    			t27 = space();
    			div29 = element("div");
    			div15 = element("div");
    			t28 = space();
    			div16 = element("div");
    			t29 = text("q");
    			t30 = space();
    			div17 = element("div");
    			t31 = text("w");
    			t32 = space();
    			div18 = element("div");
    			t33 = text("e");
    			t34 = space();
    			div19 = element("div");
    			t35 = text("r");
    			t36 = space();
    			div20 = element("div");
    			t37 = text("t");
    			t38 = space();
    			div21 = element("div");
    			t39 = text("y");
    			t40 = space();
    			div22 = element("div");
    			t41 = text("u");
    			t42 = space();
    			div23 = element("div");
    			t43 = text("i");
    			t44 = space();
    			div24 = element("div");
    			t45 = text("o");
    			t46 = space();
    			div25 = element("div");
    			t47 = text("p");
    			t48 = space();
    			div26 = element("div");
    			t49 = text("[");
    			t50 = space();
    			div27 = element("div");
    			t51 = text("]");
    			t52 = space();
    			div28 = element("div");
    			t53 = text("\\");
    			t54 = space();
    			div43 = element("div");
    			div30 = element("div");
    			t55 = space();
    			div31 = element("div");
    			t56 = text("a");
    			t57 = space();
    			div32 = element("div");
    			t58 = text("s");
    			t59 = space();
    			div33 = element("div");
    			t60 = text("d");
    			t61 = space();
    			div34 = element("div");
    			t62 = text("f");
    			t63 = space();
    			div35 = element("div");
    			t64 = text("g");
    			t65 = space();
    			div36 = element("div");
    			t66 = text("h");
    			t67 = space();
    			div37 = element("div");
    			t68 = text("j");
    			t69 = space();
    			div38 = element("div");
    			t70 = text("k");
    			t71 = space();
    			div39 = element("div");
    			t72 = text("l");
    			t73 = space();
    			div40 = element("div");
    			t74 = text(";");
    			t75 = space();
    			div41 = element("div");
    			t76 = text("'");
    			t77 = space();
    			div42 = element("div");
    			t78 = text("↵");
    			t79 = space();
    			div56 = element("div");
    			div44 = element("div");
    			div44.textContent = "⇧";
    			t81 = space();
    			div45 = element("div");
    			t82 = text("z");
    			t83 = space();
    			div46 = element("div");
    			t84 = text("x");
    			t85 = space();
    			div47 = element("div");
    			t86 = text("c");
    			t87 = space();
    			div48 = element("div");
    			t88 = text("v");
    			t89 = space();
    			div49 = element("div");
    			t90 = text("b");
    			t91 = space();
    			div50 = element("div");
    			t92 = text("n");
    			t93 = space();
    			div51 = element("div");
    			t94 = text("m");
    			t95 = space();
    			div52 = element("div");
    			t96 = text(",");
    			t97 = space();
    			div53 = element("div");
    			t98 = text(".");
    			t99 = space();
    			div54 = element("div");
    			t100 = text("/");
    			t101 = space();
    			div55 = element("div");
    			div55.textContent = "⇧";
    			t103 = space();
    			div64 = element("div");
    			div57 = element("div");
    			t104 = text("⌃");
    			t105 = space();
    			div58 = element("div");
    			t106 = text("⌥");
    			t107 = space();
    			div59 = element("div");
    			t108 = text("⌘");
    			t109 = space();
    			div60 = element("div");
    			t110 = space();
    			div61 = element("div");
    			t111 = text("⌘");
    			t112 = space();
    			div62 = element("div");
    			t113 = text("⌥");
    			t114 = space();
    			div63 = element("div");
    			t115 = text("⌃");
    			t116 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "key svelte-1xqyb7b");
    			set_style(div0, "background-color", /*$keys*/ ctx[2]["`"].color);
    			set_style(div0, "flex", "0.7");
    			toggle_class(div0, "show", /*$keys*/ ctx[2]["`"]);
    			add_location(div0, file, 61, 4, 1256);
    			attr_dev(div1, "class", "key svelte-1xqyb7b");
    			set_style(div1, "background-color", /*$keys*/ ctx[2]["1"].color);
    			toggle_class(div1, "show", /*$keys*/ ctx[2]["1"]);
    			add_location(div1, file, 62, 4, 1363);
    			attr_dev(div2, "class", "key svelte-1xqyb7b");
    			set_style(div2, "background-color", /*$keys*/ ctx[2]["2"].color);
    			toggle_class(div2, "show", /*$keys*/ ctx[2]["2"]);
    			add_location(div2, file, 63, 4, 1461);
    			attr_dev(div3, "class", "key svelte-1xqyb7b");
    			set_style(div3, "background-color", /*$keys*/ ctx[2]["3"].color);
    			toggle_class(div3, "show", /*$keys*/ ctx[2]["3"]);
    			add_location(div3, file, 64, 4, 1559);
    			attr_dev(div4, "class", "key svelte-1xqyb7b");
    			set_style(div4, "background-color", /*$keys*/ ctx[2]["4"].color);
    			toggle_class(div4, "show", /*$keys*/ ctx[2]["4"]);
    			add_location(div4, file, 65, 4, 1657);
    			attr_dev(div5, "class", "key svelte-1xqyb7b");
    			set_style(div5, "background-color", /*$keys*/ ctx[2]["5"].color);
    			toggle_class(div5, "show", /*$keys*/ ctx[2]["5"]);
    			add_location(div5, file, 66, 4, 1755);
    			attr_dev(div6, "class", "key svelte-1xqyb7b");
    			set_style(div6, "background-color", /*$keys*/ ctx[2]["6"].color);
    			toggle_class(div6, "show", /*$keys*/ ctx[2]["6"]);
    			add_location(div6, file, 67, 4, 1853);
    			attr_dev(div7, "class", "key svelte-1xqyb7b");
    			set_style(div7, "background-color", /*$keys*/ ctx[2]["7"].color);
    			toggle_class(div7, "show", /*$keys*/ ctx[2]["7"]);
    			add_location(div7, file, 68, 4, 1951);
    			attr_dev(div8, "class", "key svelte-1xqyb7b");
    			set_style(div8, "background-color", /*$keys*/ ctx[2]["8"].color);
    			toggle_class(div8, "show", /*$keys*/ ctx[2]["8"]);
    			add_location(div8, file, 69, 4, 2049);
    			attr_dev(div9, "class", "key svelte-1xqyb7b");
    			set_style(div9, "background-color", /*$keys*/ ctx[2]["9"].color);
    			toggle_class(div9, "show", /*$keys*/ ctx[2]["9"]);
    			add_location(div9, file, 70, 4, 2163);
    			attr_dev(div10, "class", "key svelte-1xqyb7b");
    			set_style(div10, "background-color", /*$keys*/ ctx[2]["0"].color);
    			toggle_class(div10, "show", /*$keys*/ ctx[2]["0"]);
    			add_location(div10, file, 71, 4, 2261);
    			attr_dev(div11, "class", "key svelte-1xqyb7b");
    			set_style(div11, "background-color", /*$keys*/ ctx[2]["-"].color);
    			toggle_class(div11, "show", /*$keys*/ ctx[2]["-"]);
    			add_location(div11, file, 72, 4, 2359);
    			attr_dev(div12, "class", "key svelte-1xqyb7b");
    			set_style(div12, "background-color", /*$keys*/ ctx[2]["="].color);
    			toggle_class(div12, "show", /*$keys*/ ctx[2]["="]);
    			add_location(div12, file, 73, 4, 2457);
    			attr_dev(div13, "class", "key svelte-1xqyb7b");
    			set_style(div13, "background-color", /*$keys*/ ctx[2]["del"].color);
    			set_style(div13, "flex", "1.5");
    			toggle_class(div13, "show", /*$keys*/ ctx[2]["del"]);
    			add_location(div13, file, 74, 4, 2555);
    			attr_dev(div14, "class", "row svelte-1xqyb7b");
    			add_location(div14, file, 60, 2, 1234);
    			attr_dev(div15, "class", "key svelte-1xqyb7b");
    			set_style(div15, "background-color", /*$keys*/ ctx[2]["tab"].color);
    			toggle_class(div15, "show", /*$keys*/ ctx[2]["tab"]);
    			add_location(div15, file, 77, 4, 2696);
    			attr_dev(div16, "class", "key svelte-1xqyb7b");
    			set_style(div16, "background-color", /*$keys*/ ctx[2]["q"].color);
    			toggle_class(div16, "show", /*$keys*/ ctx[2]["q"]);
    			add_location(div16, file, 78, 4, 2793);
    			attr_dev(div17, "class", "key svelte-1xqyb7b");
    			set_style(div17, "background-color", /*$keys*/ ctx[2]["w"].color);
    			toggle_class(div17, "show", /*$keys*/ ctx[2]["w"]);
    			add_location(div17, file, 79, 4, 2891);
    			attr_dev(div18, "class", "key svelte-1xqyb7b");
    			set_style(div18, "background-color", /*$keys*/ ctx[2]["e"].color);
    			toggle_class(div18, "show", /*$keys*/ ctx[2]["e"]);
    			add_location(div18, file, 80, 4, 2989);
    			attr_dev(div19, "class", "key svelte-1xqyb7b");
    			set_style(div19, "background-color", /*$keys*/ ctx[2]["r"].color);
    			toggle_class(div19, "show", /*$keys*/ ctx[2]["r"]);
    			add_location(div19, file, 81, 4, 3087);
    			attr_dev(div20, "class", "key svelte-1xqyb7b");
    			set_style(div20, "background-color", /*$keys*/ ctx[2]["t"].color);
    			toggle_class(div20, "show", /*$keys*/ ctx[2]["t"]);
    			add_location(div20, file, 82, 4, 3185);
    			attr_dev(div21, "class", "key svelte-1xqyb7b");
    			set_style(div21, "background-color", /*$keys*/ ctx[2]["y"].color);
    			toggle_class(div21, "show", /*$keys*/ ctx[2]["y"]);
    			add_location(div21, file, 83, 4, 3283);
    			attr_dev(div22, "class", "key svelte-1xqyb7b");
    			set_style(div22, "background-color", /*$keys*/ ctx[2]["u"].color);
    			toggle_class(div22, "show", /*$keys*/ ctx[2]["u"]);
    			add_location(div22, file, 84, 4, 3381);
    			attr_dev(div23, "class", "key svelte-1xqyb7b");
    			set_style(div23, "background-color", /*$keys*/ ctx[2]["i"].color);
    			toggle_class(div23, "show", /*$keys*/ ctx[2]["i"]);
    			add_location(div23, file, 85, 4, 3479);
    			attr_dev(div24, "class", "key svelte-1xqyb7b");
    			set_style(div24, "background-color", /*$keys*/ ctx[2]["o"].color);
    			toggle_class(div24, "show", /*$keys*/ ctx[2]["o"]);
    			add_location(div24, file, 86, 4, 3577);
    			attr_dev(div25, "class", "key svelte-1xqyb7b");
    			set_style(div25, "background-color", /*$keys*/ ctx[2]["p"].color);
    			toggle_class(div25, "show", /*$keys*/ ctx[2]["p"]);
    			add_location(div25, file, 87, 4, 3675);
    			attr_dev(div26, "class", "key svelte-1xqyb7b");
    			set_style(div26, "background-color", /*$keys*/ ctx[2]["["].color);
    			toggle_class(div26, "show", /*$keys*/ ctx[2]["["]);
    			add_location(div26, file, 88, 4, 3773);
    			attr_dev(div27, "class", "key svelte-1xqyb7b");
    			set_style(div27, "background-color", /*$keys*/ ctx[2]["]"].color);
    			toggle_class(div27, "show", /*$keys*/ ctx[2]["]"]);
    			add_location(div27, file, 89, 4, 3871);
    			attr_dev(div28, "class", "key svelte-1xqyb7b");
    			set_style(div28, "background-color", /*$keys*/ ctx[2]["\\"].color);
    			toggle_class(div28, "show", /*$keys*/ ctx[2]["'"]);
    			add_location(div28, file, 90, 4, 3969);
    			attr_dev(div29, "class", "row svelte-1xqyb7b");
    			add_location(div29, file, 76, 2, 2674);
    			attr_dev(div30, "class", "key svelte-1xqyb7b");
    			set_style(div30, "flex", "1.6");
    			toggle_class(div30, "show", /*$keys*/ ctx[2]["caps"]);
    			add_location(div30, file, 93, 4, 4097);
    			attr_dev(div31, "class", "key svelte-1xqyb7b");
    			set_style(div31, "background-color", /*$keys*/ ctx[2]["a"].color);
    			toggle_class(div31, "show", /*$keys*/ ctx[2]["a"]);
    			add_location(div31, file, 94, 4, 4166);
    			attr_dev(div32, "class", "key svelte-1xqyb7b");
    			set_style(div32, "background-color", /*$keys*/ ctx[2]["s"].color);
    			toggle_class(div32, "show", /*$keys*/ ctx[2]["s"]);
    			add_location(div32, file, 95, 4, 4264);
    			attr_dev(div33, "class", "key svelte-1xqyb7b");
    			set_style(div33, "background-color", /*$keys*/ ctx[2]["d"].color);
    			toggle_class(div33, "show", /*$keys*/ ctx[2]["d"]);
    			add_location(div33, file, 96, 4, 4362);
    			attr_dev(div34, "class", "key svelte-1xqyb7b");
    			set_style(div34, "background-color", /*$keys*/ ctx[2]["f"].color);
    			toggle_class(div34, "show", /*$keys*/ ctx[2]["f"]);
    			add_location(div34, file, 97, 4, 4460);
    			attr_dev(div35, "class", "key svelte-1xqyb7b");
    			set_style(div35, "background-color", /*$keys*/ ctx[2]["g"].color);
    			toggle_class(div35, "show", /*$keys*/ ctx[2]["g"]);
    			add_location(div35, file, 98, 4, 4558);
    			attr_dev(div36, "class", "key svelte-1xqyb7b");
    			set_style(div36, "background-color", /*$keys*/ ctx[2]["h"].color);
    			toggle_class(div36, "show", /*$keys*/ ctx[2]["h"]);
    			add_location(div36, file, 99, 4, 4656);
    			attr_dev(div37, "class", "key svelte-1xqyb7b");
    			set_style(div37, "background-color", /*$keys*/ ctx[2]["j"].color);
    			toggle_class(div37, "show", /*$keys*/ ctx[2]["j"]);
    			add_location(div37, file, 100, 4, 4754);
    			attr_dev(div38, "class", "key svelte-1xqyb7b");
    			set_style(div38, "background-color", /*$keys*/ ctx[2]["k"].color);
    			toggle_class(div38, "show", /*$keys*/ ctx[2]["k"]);
    			add_location(div38, file, 101, 4, 4852);
    			attr_dev(div39, "class", "key svelte-1xqyb7b");
    			set_style(div39, "background-color", /*$keys*/ ctx[2]["l"].color);
    			toggle_class(div39, "show", /*$keys*/ ctx[2]["l"]);
    			add_location(div39, file, 102, 4, 4950);
    			attr_dev(div40, "class", "key svelte-1xqyb7b");
    			set_style(div40, "background-color", /*$keys*/ ctx[2][";"].color);
    			toggle_class(div40, "show", /*$keys*/ ctx[2][";"]);
    			add_location(div40, file, 103, 4, 5048);
    			attr_dev(div41, "class", "key svelte-1xqyb7b");
    			set_style(div41, "background-color", /*$keys*/ ctx[2]["'"].color);
    			toggle_class(div41, "show", /*$keys*/ ctx[2]["'"]);
    			add_location(div41, file, 104, 4, 5146);
    			attr_dev(div42, "class", "key svelte-1xqyb7b");
    			set_style(div42, "background-color", /*$keys*/ ctx[2]["enter"].color);
    			set_style(div42, "flex", "1.6");
    			toggle_class(div42, "show", /*$keys*/ ctx[2]["enter"]);
    			add_location(div42, file, 105, 4, 5244);
    			attr_dev(div43, "class", "row svelte-1xqyb7b");
    			add_location(div43, file, 92, 2, 4075);
    			attr_dev(div44, "class", "key svelte-1xqyb7b");
    			set_style(div44, "flex", "2.2");
    			toggle_class(div44, "show", /*$keys*/ ctx[2]["lshift"]);
    			add_location(div44, file, 108, 4, 5389);
    			attr_dev(div45, "class", "key svelte-1xqyb7b");
    			set_style(div45, "background-color", /*$keys*/ ctx[2]["z"].color);
    			toggle_class(div45, "show", /*$keys*/ ctx[2]["z"]);
    			add_location(div45, file, 109, 4, 5465);
    			attr_dev(div46, "class", "key svelte-1xqyb7b");
    			set_style(div46, "background-color", /*$keys*/ ctx[2]["x"].color);
    			toggle_class(div46, "show", /*$keys*/ ctx[2]["x"]);
    			add_location(div46, file, 110, 4, 5563);
    			attr_dev(div47, "class", "key svelte-1xqyb7b");
    			set_style(div47, "background-color", /*$keys*/ ctx[2]["c"].color);
    			toggle_class(div47, "show", /*$keys*/ ctx[2]["c"]);
    			add_location(div47, file, 111, 4, 5661);
    			attr_dev(div48, "class", "key svelte-1xqyb7b");
    			set_style(div48, "background-color", /*$keys*/ ctx[2]["v"].color);
    			toggle_class(div48, "show", /*$keys*/ ctx[2]["v"]);
    			add_location(div48, file, 112, 4, 5759);
    			attr_dev(div49, "class", "key svelte-1xqyb7b");
    			set_style(div49, "background-color", /*$keys*/ ctx[2]["b"].color);
    			toggle_class(div49, "show", /*$keys*/ ctx[2]["b"]);
    			add_location(div49, file, 113, 4, 5857);
    			attr_dev(div50, "class", "key svelte-1xqyb7b");
    			set_style(div50, "background-color", /*$keys*/ ctx[2]["n"].color);
    			toggle_class(div50, "show", /*$keys*/ ctx[2]["n"]);
    			add_location(div50, file, 114, 4, 5955);
    			attr_dev(div51, "class", "key svelte-1xqyb7b");
    			set_style(div51, "background-color", /*$keys*/ ctx[2]["m"].color);
    			toggle_class(div51, "show", /*$keys*/ ctx[2]["m"]);
    			add_location(div51, file, 115, 4, 6053);
    			attr_dev(div52, "class", "key svelte-1xqyb7b");
    			set_style(div52, "background-color", /*$keys*/ ctx[2][","].color);
    			toggle_class(div52, "show", /*$keys*/ ctx[2][","]);
    			add_location(div52, file, 116, 4, 6151);
    			attr_dev(div53, "class", "key svelte-1xqyb7b");
    			set_style(div53, "background-color", /*$keys*/ ctx[2]["."].color);
    			toggle_class(div53, "show", /*$keys*/ ctx[2]["."]);
    			add_location(div53, file, 117, 4, 6249);
    			attr_dev(div54, "class", "key svelte-1xqyb7b");
    			set_style(div54, "background-color", /*$keys*/ ctx[2]["/"].color);
    			toggle_class(div54, "show", /*$keys*/ ctx[2]["/"]);
    			add_location(div54, file, 118, 4, 6347);
    			attr_dev(div55, "class", "key svelte-1xqyb7b");
    			set_style(div55, "flex", "2.2");
    			toggle_class(div55, "show", /*$keys*/ ctx[2]["rshift"]);
    			add_location(div55, file, 119, 4, 6445);
    			attr_dev(div56, "class", "row svelte-1xqyb7b");
    			add_location(div56, file, 107, 2, 5367);
    			attr_dev(div57, "class", "key svelte-1xqyb7b");
    			set_style(div57, "background-color", /*$keys*/ ctx[2]["lctrl"].color);
    			set_style(div57, "flex", "1.4");
    			toggle_class(div57, "show", /*$keys*/ ctx[2]["lctrl"]);
    			add_location(div57, file, 122, 4, 6550);
    			attr_dev(div58, "class", "key svelte-1xqyb7b");
    			set_style(div58, "background-color", /*$keys*/ ctx[2]["lopt"].color);
    			set_style(div58, "flex", "1.4");
    			toggle_class(div58, "show", /*$keys*/ ctx[2]["lopt"]);
    			add_location(div58, file, 123, 4, 6666);
    			attr_dev(div59, "class", "key svelte-1xqyb7b");
    			set_style(div59, "background-color", /*$keys*/ ctx[2]["lcmd"].color);
    			set_style(div59, "flex", "1.4");
    			toggle_class(div59, "show", /*$keys*/ ctx[2]["lcmd"]);
    			add_location(div59, file, 124, 4, 6780);
    			attr_dev(div60, "class", "key svelte-1xqyb7b");
    			set_style(div60, "background-color", /*$keys*/ ctx[2]["space"].color);
    			set_style(div60, "flex", "6.8");
    			toggle_class(div60, "show", /*$keys*/ ctx[2]["space"]);
    			add_location(div60, file, 125, 4, 6894);
    			attr_dev(div61, "class", "key svelte-1xqyb7b");
    			set_style(div61, "background-color", /*$keys*/ ctx[2]["rcmd"].color);
    			set_style(div61, "flex", "1.4");
    			toggle_class(div61, "show", /*$keys*/ ctx[2]["rcmd"]);
    			add_location(div61, file, 126, 4, 7005);
    			attr_dev(div62, "class", "key svelte-1xqyb7b");
    			set_style(div62, "background-color", /*$keys*/ ctx[2]["ropt"].color);
    			set_style(div62, "flex", "1.4");
    			toggle_class(div62, "show", /*$keys*/ ctx[2]["ropt"]);
    			add_location(div62, file, 127, 4, 7119);
    			attr_dev(div63, "class", "key svelte-1xqyb7b");
    			set_style(div63, "background-color", /*$keys*/ ctx[2]["rctrl"].color);
    			set_style(div63, "flex", "1.4");
    			toggle_class(div63, "show", /*$keys*/ ctx[2]["rctrl"]);
    			add_location(div63, file, 128, 4, 7233);
    			attr_dev(div64, "class", "row svelte-1xqyb7b");
    			add_location(div64, file, 121, 2, 6528);
    			attr_dev(div65, "class", "container svelte-1xqyb7b");
    			set_style(div65, "max-height", /*height*/ ctx[1] + "px");
    			add_render_callback(() => /*div65_elementresize_handler*/ ctx[5].call(div65));
    			add_location(div65, file, 59, 0, 1156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div65, anchor);
    			append_dev(div65, div14);
    			append_dev(div14, div0);
    			append_dev(div0, t0);
    			append_dev(div14, t1);
    			append_dev(div14, div1);
    			append_dev(div1, t2);
    			append_dev(div14, t3);
    			append_dev(div14, div2);
    			append_dev(div2, t4);
    			append_dev(div14, t5);
    			append_dev(div14, div3);
    			append_dev(div3, t6);
    			append_dev(div14, t7);
    			append_dev(div14, div4);
    			append_dev(div4, t8);
    			append_dev(div14, t9);
    			append_dev(div14, div5);
    			append_dev(div5, t10);
    			append_dev(div14, t11);
    			append_dev(div14, div6);
    			append_dev(div6, t12);
    			append_dev(div14, t13);
    			append_dev(div14, div7);
    			append_dev(div7, t14);
    			append_dev(div14, t15);
    			append_dev(div14, div8);
    			append_dev(div8, t16);
    			append_dev(div14, t17);
    			append_dev(div14, div9);
    			append_dev(div9, t18);
    			append_dev(div14, t19);
    			append_dev(div14, div10);
    			append_dev(div10, t20);
    			append_dev(div14, t21);
    			append_dev(div14, div11);
    			append_dev(div11, t22);
    			append_dev(div14, t23);
    			append_dev(div14, div12);
    			append_dev(div12, t24);
    			append_dev(div14, t25);
    			append_dev(div14, div13);
    			append_dev(div13, t26);
    			append_dev(div65, t27);
    			append_dev(div65, div29);
    			append_dev(div29, div15);
    			append_dev(div29, t28);
    			append_dev(div29, div16);
    			append_dev(div16, t29);
    			append_dev(div29, t30);
    			append_dev(div29, div17);
    			append_dev(div17, t31);
    			append_dev(div29, t32);
    			append_dev(div29, div18);
    			append_dev(div18, t33);
    			append_dev(div29, t34);
    			append_dev(div29, div19);
    			append_dev(div19, t35);
    			append_dev(div29, t36);
    			append_dev(div29, div20);
    			append_dev(div20, t37);
    			append_dev(div29, t38);
    			append_dev(div29, div21);
    			append_dev(div21, t39);
    			append_dev(div29, t40);
    			append_dev(div29, div22);
    			append_dev(div22, t41);
    			append_dev(div29, t42);
    			append_dev(div29, div23);
    			append_dev(div23, t43);
    			append_dev(div29, t44);
    			append_dev(div29, div24);
    			append_dev(div24, t45);
    			append_dev(div29, t46);
    			append_dev(div29, div25);
    			append_dev(div25, t47);
    			append_dev(div29, t48);
    			append_dev(div29, div26);
    			append_dev(div26, t49);
    			append_dev(div29, t50);
    			append_dev(div29, div27);
    			append_dev(div27, t51);
    			append_dev(div29, t52);
    			append_dev(div29, div28);
    			append_dev(div28, t53);
    			append_dev(div65, t54);
    			append_dev(div65, div43);
    			append_dev(div43, div30);
    			append_dev(div43, t55);
    			append_dev(div43, div31);
    			append_dev(div31, t56);
    			append_dev(div43, t57);
    			append_dev(div43, div32);
    			append_dev(div32, t58);
    			append_dev(div43, t59);
    			append_dev(div43, div33);
    			append_dev(div33, t60);
    			append_dev(div43, t61);
    			append_dev(div43, div34);
    			append_dev(div34, t62);
    			append_dev(div43, t63);
    			append_dev(div43, div35);
    			append_dev(div35, t64);
    			append_dev(div43, t65);
    			append_dev(div43, div36);
    			append_dev(div36, t66);
    			append_dev(div43, t67);
    			append_dev(div43, div37);
    			append_dev(div37, t68);
    			append_dev(div43, t69);
    			append_dev(div43, div38);
    			append_dev(div38, t70);
    			append_dev(div43, t71);
    			append_dev(div43, div39);
    			append_dev(div39, t72);
    			append_dev(div43, t73);
    			append_dev(div43, div40);
    			append_dev(div40, t74);
    			append_dev(div43, t75);
    			append_dev(div43, div41);
    			append_dev(div41, t76);
    			append_dev(div43, t77);
    			append_dev(div43, div42);
    			append_dev(div42, t78);
    			append_dev(div65, t79);
    			append_dev(div65, div56);
    			append_dev(div56, div44);
    			append_dev(div56, t81);
    			append_dev(div56, div45);
    			append_dev(div45, t82);
    			append_dev(div56, t83);
    			append_dev(div56, div46);
    			append_dev(div46, t84);
    			append_dev(div56, t85);
    			append_dev(div56, div47);
    			append_dev(div47, t86);
    			append_dev(div56, t87);
    			append_dev(div56, div48);
    			append_dev(div48, t88);
    			append_dev(div56, t89);
    			append_dev(div56, div49);
    			append_dev(div49, t90);
    			append_dev(div56, t91);
    			append_dev(div56, div50);
    			append_dev(div50, t92);
    			append_dev(div56, t93);
    			append_dev(div56, div51);
    			append_dev(div51, t94);
    			append_dev(div56, t95);
    			append_dev(div56, div52);
    			append_dev(div52, t96);
    			append_dev(div56, t97);
    			append_dev(div56, div53);
    			append_dev(div53, t98);
    			append_dev(div56, t99);
    			append_dev(div56, div54);
    			append_dev(div54, t100);
    			append_dev(div56, t101);
    			append_dev(div56, div55);
    			append_dev(div65, t103);
    			append_dev(div65, div64);
    			append_dev(div64, div57);
    			append_dev(div57, t104);
    			append_dev(div64, t105);
    			append_dev(div64, div58);
    			append_dev(div58, t106);
    			append_dev(div64, t107);
    			append_dev(div64, div59);
    			append_dev(div59, t108);
    			append_dev(div64, t109);
    			append_dev(div64, div60);
    			append_dev(div64, t110);
    			append_dev(div64, div61);
    			append_dev(div61, t111);
    			append_dev(div64, t112);
    			append_dev(div64, div62);
    			append_dev(div62, t113);
    			append_dev(div64, t114);
    			append_dev(div64, div63);
    			append_dev(div63, t115);
    			div65_resize_listener = add_resize_listener(div65, /*div65_elementresize_handler*/ ctx[5].bind(div65));
    			insert_dev(target, t116, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div0, "background-color", /*$keys*/ ctx[2]["`"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div0, "show", /*$keys*/ ctx[2]["`"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div1, "background-color", /*$keys*/ ctx[2]["1"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div1, "show", /*$keys*/ ctx[2]["1"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div2, "background-color", /*$keys*/ ctx[2]["2"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div2, "show", /*$keys*/ ctx[2]["2"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div3, "background-color", /*$keys*/ ctx[2]["3"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div3, "show", /*$keys*/ ctx[2]["3"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div4, "background-color", /*$keys*/ ctx[2]["4"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div4, "show", /*$keys*/ ctx[2]["4"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div5, "background-color", /*$keys*/ ctx[2]["5"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div5, "show", /*$keys*/ ctx[2]["5"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div6, "background-color", /*$keys*/ ctx[2]["6"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div6, "show", /*$keys*/ ctx[2]["6"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div7, "background-color", /*$keys*/ ctx[2]["7"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div7, "show", /*$keys*/ ctx[2]["7"]);
    			}

    			if ((!current || dirty & /*$keys*/ 4) && t16_value !== (t16_value = /*$keys*/ ctx[2]["8"].show + "")) set_data_dev(t16, t16_value);

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div8, "background-color", /*$keys*/ ctx[2]["8"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div8, "show", /*$keys*/ ctx[2]["8"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div9, "background-color", /*$keys*/ ctx[2]["9"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div9, "show", /*$keys*/ ctx[2]["9"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div10, "background-color", /*$keys*/ ctx[2]["0"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div10, "show", /*$keys*/ ctx[2]["0"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div11, "background-color", /*$keys*/ ctx[2]["-"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div11, "show", /*$keys*/ ctx[2]["-"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div12, "background-color", /*$keys*/ ctx[2]["="].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div12, "show", /*$keys*/ ctx[2]["="]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div13, "background-color", /*$keys*/ ctx[2]["del"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div13, "show", /*$keys*/ ctx[2]["del"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div15, "background-color", /*$keys*/ ctx[2]["tab"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div15, "show", /*$keys*/ ctx[2]["tab"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div16, "background-color", /*$keys*/ ctx[2]["q"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div16, "show", /*$keys*/ ctx[2]["q"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div17, "background-color", /*$keys*/ ctx[2]["w"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div17, "show", /*$keys*/ ctx[2]["w"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div18, "background-color", /*$keys*/ ctx[2]["e"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div18, "show", /*$keys*/ ctx[2]["e"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div19, "background-color", /*$keys*/ ctx[2]["r"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div19, "show", /*$keys*/ ctx[2]["r"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div20, "background-color", /*$keys*/ ctx[2]["t"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div20, "show", /*$keys*/ ctx[2]["t"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div21, "background-color", /*$keys*/ ctx[2]["y"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div21, "show", /*$keys*/ ctx[2]["y"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div22, "background-color", /*$keys*/ ctx[2]["u"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div22, "show", /*$keys*/ ctx[2]["u"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div23, "background-color", /*$keys*/ ctx[2]["i"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div23, "show", /*$keys*/ ctx[2]["i"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div24, "background-color", /*$keys*/ ctx[2]["o"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div24, "show", /*$keys*/ ctx[2]["o"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div25, "background-color", /*$keys*/ ctx[2]["p"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div25, "show", /*$keys*/ ctx[2]["p"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div26, "background-color", /*$keys*/ ctx[2]["["].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div26, "show", /*$keys*/ ctx[2]["["]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div27, "background-color", /*$keys*/ ctx[2]["]"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div27, "show", /*$keys*/ ctx[2]["]"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div28, "background-color", /*$keys*/ ctx[2]["\\"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div28, "show", /*$keys*/ ctx[2]["'"]);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div30, "show", /*$keys*/ ctx[2]["caps"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div31, "background-color", /*$keys*/ ctx[2]["a"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div31, "show", /*$keys*/ ctx[2]["a"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div32, "background-color", /*$keys*/ ctx[2]["s"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div32, "show", /*$keys*/ ctx[2]["s"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div33, "background-color", /*$keys*/ ctx[2]["d"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div33, "show", /*$keys*/ ctx[2]["d"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div34, "background-color", /*$keys*/ ctx[2]["f"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div34, "show", /*$keys*/ ctx[2]["f"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div35, "background-color", /*$keys*/ ctx[2]["g"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div35, "show", /*$keys*/ ctx[2]["g"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div36, "background-color", /*$keys*/ ctx[2]["h"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div36, "show", /*$keys*/ ctx[2]["h"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div37, "background-color", /*$keys*/ ctx[2]["j"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div37, "show", /*$keys*/ ctx[2]["j"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div38, "background-color", /*$keys*/ ctx[2]["k"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div38, "show", /*$keys*/ ctx[2]["k"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div39, "background-color", /*$keys*/ ctx[2]["l"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div39, "show", /*$keys*/ ctx[2]["l"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div40, "background-color", /*$keys*/ ctx[2][";"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div40, "show", /*$keys*/ ctx[2][";"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div41, "background-color", /*$keys*/ ctx[2]["'"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div41, "show", /*$keys*/ ctx[2]["'"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div42, "background-color", /*$keys*/ ctx[2]["enter"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div42, "show", /*$keys*/ ctx[2]["enter"]);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div44, "show", /*$keys*/ ctx[2]["lshift"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div45, "background-color", /*$keys*/ ctx[2]["z"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div45, "show", /*$keys*/ ctx[2]["z"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div46, "background-color", /*$keys*/ ctx[2]["x"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div46, "show", /*$keys*/ ctx[2]["x"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div47, "background-color", /*$keys*/ ctx[2]["c"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div47, "show", /*$keys*/ ctx[2]["c"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div48, "background-color", /*$keys*/ ctx[2]["v"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div48, "show", /*$keys*/ ctx[2]["v"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div49, "background-color", /*$keys*/ ctx[2]["b"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div49, "show", /*$keys*/ ctx[2]["b"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div50, "background-color", /*$keys*/ ctx[2]["n"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div50, "show", /*$keys*/ ctx[2]["n"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div51, "background-color", /*$keys*/ ctx[2]["m"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div51, "show", /*$keys*/ ctx[2]["m"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div52, "background-color", /*$keys*/ ctx[2][","].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div52, "show", /*$keys*/ ctx[2][","]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div53, "background-color", /*$keys*/ ctx[2]["."].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div53, "show", /*$keys*/ ctx[2]["."]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div54, "background-color", /*$keys*/ ctx[2]["/"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div54, "show", /*$keys*/ ctx[2]["/"]);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div55, "show", /*$keys*/ ctx[2]["rshift"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div57, "background-color", /*$keys*/ ctx[2]["lctrl"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div57, "show", /*$keys*/ ctx[2]["lctrl"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div58, "background-color", /*$keys*/ ctx[2]["lopt"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div58, "show", /*$keys*/ ctx[2]["lopt"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div59, "background-color", /*$keys*/ ctx[2]["lcmd"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div59, "show", /*$keys*/ ctx[2]["lcmd"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div60, "background-color", /*$keys*/ ctx[2]["space"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div60, "show", /*$keys*/ ctx[2]["space"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div61, "background-color", /*$keys*/ ctx[2]["rcmd"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div61, "show", /*$keys*/ ctx[2]["rcmd"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div62, "background-color", /*$keys*/ ctx[2]["ropt"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div62, "show", /*$keys*/ ctx[2]["ropt"]);
    			}

    			if (!current || dirty & /*$keys*/ 4) {
    				set_style(div63, "background-color", /*$keys*/ ctx[2]["rctrl"].color);
    			}

    			if (dirty & /*$keys*/ 4) {
    				toggle_class(div63, "show", /*$keys*/ ctx[2]["rctrl"]);
    			}

    			if (!current || dirty & /*height*/ 2) {
    				set_style(div65, "max-height", /*height*/ ctx[1] + "px");
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div65);
    			div65_resize_listener();
    			if (detaching) detach_dev(t116);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $keys;
    	validate_store(keys, "keys");
    	component_subscribe($$self, keys, $$value => $$invalidate(2, $keys = $$value));
    	let w = 400;

    	onMount(() => {
    		keys.set($keys);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Keyboard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Keyboard", $$slots, ['default']);

    	function div65_elementresize_handler() {
    		w = this.clientWidth;
    		$$invalidate(0, w);
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ w, onMount, keys, height, $keys });

    	$$self.$inject_state = $$props => {
    		if ("w" in $$props) $$invalidate(0, w = $$props.w);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    	};

    	let height;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*w*/ 1) {
    			 $$invalidate(1, height = w * 0.3);
    		}
    	};

    	return [w, height, $keys, $$scope, $$slots, div65_elementresize_handler];
    }

    class Keyboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1xqyb7b-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Keyboard",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var spencerColor = createCommonjsModule(function (module, exports) {
    !function(e){module.exports=e();}(function(){return function u(i,a,c){function f(r,e){if(!a[r]){if(!i[r]){var o="function"==typeof commonjsRequire&&commonjsRequire;if(!e&&o)return o(r,!0);if(d)return d(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var t=a[r]={exports:{}};i[r][0].call(t.exports,function(e){return f(i[r][1][e]||e)},t,t.exports,u,i,a,c);}return a[r].exports}for(var d="function"==typeof commonjsRequire&&commonjsRequire,e=0;e<c.length;e++)f(c[e]);return f}({1:[function(e,r,o){r.exports={blue:"#6699cc",green:"#6accb2",yellow:"#e1e6b3",red:"#cc7066",pink:"#F2C0BB",brown:"#705E5C",orange:"#cc8a66",purple:"#d8b3e6",navy:"#335799",olive:"#7f9c6c",fuscia:"#735873",beige:"#e6d7b3",slate:"#8C8C88",suede:"#9c896c",burnt:"#603a39",sea:"#50617A",sky:"#2D85A8",night:"#303b50",rouge:"#914045",grey:"#838B91",mud:"#C4ABAB",royal:"#275291",cherry:"#cc6966",tulip:"#e6b3bc",rose:"#D68881",fire:"#AB5850",greyblue:"#72697D",greygreen:"#8BA3A2",greypurple:"#978BA3",burn:"#6D5685",slategrey:"#bfb0b3",light:"#a3a5a5",lighter:"#d7d5d2",fudge:"#4d4d4d",lightgrey:"#949a9e",white:"#fbfbfb",dimgrey:"#606c74",softblack:"#463D4F",dark:"#443d3d",black:"#333333"};},{}],2:[function(e,r,o){var n=e("./colors"),t={juno:["blue","mud","navy","slate","pink","burn"],barrow:["rouge","red","orange","burnt","brown","greygreen"],roma:["#8a849a","#b5b0bf","rose","lighter","greygreen","mud"],palmer:["red","navy","olive","pink","suede","sky"],mark:["#848f9a","#9aa4ac","slate","#b0b8bf","mud","grey"],salmon:["sky","sea","fuscia","slate","mud","fudge"],dupont:["green","brown","orange","red","olive","blue"],bloor:["night","navy","beige","rouge","mud","grey"],yukon:["mud","slate","brown","sky","beige","red"],david:["blue","green","yellow","red","pink","light"],neste:["mud","cherry","royal","rouge","greygreen","greypurple"],ken:["red","sky","#c67a53","greygreen","#dfb59f","mud"]};Object.keys(t).forEach(function(e){t[e]=t[e].map(function(e){return n[e]||e});}),r.exports=t;},{"./colors":1}],3:[function(e,r,o){var n=e("./colors"),t=e("./combos"),u={colors:n,list:Object.keys(n).map(function(e){return n[e]}),combos:t};r.exports=u;},{"./colors":1,"./combos":2}]},{},[3])(3)});
    });

    /* src/Key.svelte generated by Svelte v3.24.1 */

    function create_fragment$1(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $keys;
    	validate_store(keys, "keys");
    	component_subscribe($$self, keys, $$value => $$invalidate(4, $keys = $$value));
    	let { key = "" } = $$props;
    	let { fill = "" } = $$props;
    	let { color = fill } = $$props;
    	color = spencerColor.colors[color] || color;
    	let { show = "" } = $$props;

    	if (key) {
    		set_store_value(keys, $keys[key] = { key, show, color }, $keys);
    	}

    	const writable_props = ["key", "fill", "color", "show"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Key> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Key", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("key" in $$props) $$invalidate(1, key = $$props.key);
    		if ("fill" in $$props) $$invalidate(2, fill = $$props.fill);
    		if ("color" in $$props) $$invalidate(0, color = $$props.color);
    		if ("show" in $$props) $$invalidate(3, show = $$props.show);
    	};

    	$$self.$capture_state = () => ({
    		key,
    		fill,
    		color,
    		c: spencerColor,
    		show,
    		onMount,
    		keys,
    		$keys
    	});

    	$$self.$inject_state = $$props => {
    		if ("key" in $$props) $$invalidate(1, key = $$props.key);
    		if ("fill" in $$props) $$invalidate(2, fill = $$props.fill);
    		if ("color" in $$props) $$invalidate(0, color = $$props.color);
    		if ("show" in $$props) $$invalidate(3, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, key, fill, show];
    }

    class Key extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { key: 1, fill: 2, color: 0, show: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Key",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get key() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Demo.svelte generated by Svelte v3.24.1 */
    const file$1 = "Demo.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-qtnmbi-style";
    	style.textContent = ".main.svelte-qtnmbi{margin:4rem;display:flex;flex-direction:column;justify-content:space-around;align-items:center;text-align:center;flex-wrap:wrap;align-self:stretch}.link.svelte-qtnmbi{color:steelblue;text-decoration:none;margin:3rem}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVtby5zdmVsdGUiLCJzb3VyY2VzIjpbIkRlbW8uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IEtleWJvYXJkLCBLZXkgfSBmcm9tICcuL3NyYydcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5tYWluIHtcbiAgICBtYXJnaW46IDRyZW07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBhbGlnbi1zZWxmOiBzdHJldGNoO1xuICB9XG4gIC5saW5rIHtcbiAgICBjb2xvcjogc3RlZWxibHVlO1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBtYXJnaW46IDNyZW07XG4gIH1cbjwvc3R5bGU+XG5cbjxkaXYgY2xhc3M9XCJtYWluXCI+XG4gIDxkaXYgY2xhc3M9XCJmMlwiPlxuICAgIDxhIGNsYXNzPVwibGlua1wiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc3BlbmNlcm1vdW50YWluL3NvbWVob3cta2V5Ym9hcmQvXCI+c29tZWhvdy1rZXlib2FyZDwvYT5cbiAgPC9kaXY+XG4gIDxLZXlib2FyZD5cbiAgICA8S2V5IGtleT1cIjhcIiBmaWxsPVwicmVkXCIgc2hvdz1cIipcIiAvPlxuICA8L0tleWJvYXJkPlxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0UsS0FBSyxjQUFDLENBQUMsQUFDTCxNQUFNLENBQUUsSUFBSSxDQUNaLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLE1BQU0sQ0FDdEIsZUFBZSxDQUFFLFlBQVksQ0FDN0IsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixVQUFVLENBQUUsT0FBTyxBQUNyQixDQUFDLEFBQ0QsS0FBSyxjQUFDLENBQUMsQUFDTCxLQUFLLENBQUUsU0FBUyxDQUNoQixlQUFlLENBQUUsSUFBSSxDQUNyQixNQUFNLENBQUUsSUFBSSxBQUNkLENBQUMifQ== */";
    	append_dev(document.head, style);
    }

    // (27:2) <Keyboard>
    function create_default_slot(ctx) {
    	let key;
    	let current;

    	key = new Key({
    			props: { key: "8", fill: "red", show: "*" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(key.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(key, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(key, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(27:2) <Keyboard>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let a;
    	let t1;
    	let keyboard;
    	let current;

    	keyboard = new Keyboard({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "somehow-keyboard";
    			t1 = space();
    			create_component(keyboard.$$.fragment);
    			attr_dev(a, "class", "link svelte-qtnmbi");
    			attr_dev(a, "href", "https://github.com/spencermountain/somehow-keyboard/");
    			add_location(a, file$1, 24, 4, 410);
    			attr_dev(div0, "class", "f2");
    			add_location(div0, file$1, 23, 2, 389);
    			attr_dev(div1, "class", "main svelte-qtnmbi");
    			add_location(div1, file$1, 22, 0, 368);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(div1, t1);
    			mount_component(keyboard, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const keyboard_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				keyboard_changes.$$scope = { dirty, ctx };
    			}

    			keyboard.$set(keyboard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keyboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keyboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(keyboard);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Demo> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Demo", $$slots, []);
    	$$self.$capture_state = () => ({ Keyboard, Key });
    	return [];
    }

    class Demo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-qtnmbi-style")) add_css$1();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new Demo({
      target: document.body,
    });

    return app;

}());
