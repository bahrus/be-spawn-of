# be-spawn-of

## Plan A:  spawn of host

Suppose a custom element, aka *host*, has a method with the following name: \<my-virtual-element>

Yes, it is possible to create a class containing methods with such weird names.  For example:

```TypeScript
class MyClass extends HTMLElement{
    ['<my-virtual-element/>'](ctx: RenderContext){
        //knock yourself out
        const {target} = ctx;
        target.appendChild(document.body);
    }
    ['<be-my-guest/>'](ctx: RenderContext){
        const {target} = ctx;
        this.appendChild(target.cloneNode(true));
    }
}
```

Now contained in the cloned template used by the custom element, either ideally while stamping it, or, less ideally, post SSR'ing and/or appending to the ShadowRoot) we find this markup:

```html
<div>
<template be-spawn-of>
    <my-virtual-element>
        <div>hello</div>
    </my-virtual-element>
</template>
</div>
```

What this does:

Since the root element contained within the template has a matching method name from the host, the content of the my-virtual-element element is passed to the method.

The method can do whatever it wants.  The expectation, though, is that the contents of the my-virtual-element tag will be filled or replaced with something during the first call, and capable of being updated with subsequent calls.

## Plan B:  no matching method found in host

Search for a template within the shadowroot / cloned template with id=my-virtual-element

If such a template is found, see if it is actually a reference to some common template via be-referential.

Once the source-of-truth template is found with matching id, see if that template has some dynamic logic defined via:  be-ideating

If so, pass the my-virtual-element to some TBD API method call.



