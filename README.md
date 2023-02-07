# be-spawn-of [WIP]

be-spawn of fills an apparent gap in web development that is centered around web components.

Out-of-the-box web components come in ~~three~~ two varieties:

1.  ~~[Extensions of built-ins.](https://github.com/WebKit/standards-positions/issues/97)~~
2.  Custom elements that don't use Shadow DOM
3.  Custom elements that use Shadow DOM

But custom elements still imply a certain amount of formality -- they shine in their universality -- their ability to be used anywhere HTML works, including multiple frameworks.  There's an implied contract that goes along with them, including a custom element manifest.

And until scoped custom registries becomes a thing, the names of such custom elements become global in the page session.

But when one looks at how a typical developer uses a framework like React, we see components being used far more casually, for tiny, microscopic sections of HTML that just need a way to represent very local state,  but with access to more global state as well, and semantically declaring what the contents represent.  No need for attribute support, encapsulated styles, form participation, etc.

The ability to extend JavaScript with "virtual" components that can be used to represent repeated content, without a wrapper element, is another nicety these frameworks bring to the table.

Which leads us to consider the scenario where the section of HTML is part of a built-in element, like tables or lists, where wrapping such components inside a custom element tag would run into issues beyond undesired HTML clutter.

be-spawn-of attempts to fill in this gap, in a way that can also evolve into a full-blown web component as requirements gels, the complexity grows, and the universality of the functionality reaches a critical point that warrants a contractual type commitment.

An analogy of what be-spawn-of provides is blocks of code within a method or class, with access to the outside scope(s).  It smells a lot like Angular 1, but hopefully with some lessons learned.

## Example 1:

We use this code-pen

```JavaScript
const UserStatusButton: React.FC<IUserStatusButton> = (props: IUserStatusButton) => {  
    const { userStatus, setUserStatusTo } = React.useContext(AppContext);

    const handleOnClick = (): void => {
        setUserStatusTo(props.userStatus);
    }

    return(   
        <button   
        id={props.id} 
        className="user-status-button clear-button" 
        disabled={userStatus === props.userStatus}
        type="button" 
        onClick={handleOnClick}
        >      
        <i className={props.icon} />
        </button>
    )
}
...
<UserStatusButton 
    icon="fa-solid fa-arrow-right-from-arc" 
    id="sign-out-button" 
    userStatus={UserStatus.LoggedOut}
/>
```

be-spawn-of equivalent, version 1:

```html
<template id=user-status-button>
    <button type=button class="user-status-button clear-button">
        <i></i>
    </button>
    <script data-settings='{
        "hydrate":[
            {"on": "click", "of": "button", "do":[
                {"set": "userStatus", "of": "host.ref", "from": "$.scope.userStatus"},
            ]}
        ],
        "transform": {
            "buttonE": [{"disabled": "eq", "id": "id"}],
            "iE": [{"className": "icon"}]
        }
    }'>
        export const eq = ({userStatus, cnt}, {host}) => host.ref.userStatus === userStatus;
    </script>
</template>
...
<user-status-button href=#user-status-button be-scoped='{
    "icon":  "fa-solid fa-arrow-right-from-arc",
    "id": "sign-out-button",
    "userStatus": "Logging In"
}'></user-status-button>
```

Now, what's not so great about both the React and the be-spawn-of example above, is both require JavaScript to display anything.  React requires a server-side framework to bypass this concern.  be-spawn-of can do the same thing in a far more light way:


```html
<template id=user-status-button>
    <script data-settings='{
        "hydrate":[
            {"on": "click", "of": "button", "do":[
                {"set": "userStatus", "of": "host.ref", "from": "$.scope.userStatus"},
            ]}
        ],
        "transform": {
            "buttonE": [{"disabled": "eq", "id": "id"}],
            "iE": [{"className": "icon"}]
        }
    }'>
        export const eq = ({userStatus, cnt}, {host}) => host.ref.userStatus === userStatus;
    </script>
</template>
...
<user-status-button href=#user-status-button be-scoped='{
    "userStatus": "Logging In",
    "defer-rendering": true,
    "#derived":{
        "icon": ["iconI", "className"],
        "id": ["buttonE", "id"]
    }
}'>
    <button id=sign-out-button type=button class="user-status-button clear-button">
        <i itemprop=icon class="fa-solid fa-arrow-right-from-arc"></i>
    </button>
</user-status-button>
```



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



