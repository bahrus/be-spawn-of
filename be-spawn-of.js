import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeSpawnOf extends EventTarget {
    intro(proxy, target) {
        proxy.id = target.getAttribute('data-spawn-of');
    }
    async passTemplate(pp, mold) {
        const { self, template } = pp;
        const { doBeHavings } = await import('trans-render/lib/doBeHavings.js');
        import('be-scoped/be-scoped.js');
        import('be-indefinite/be-indefinite.js');
        import('be-transrendered/be-transrendered.js');
        const meta = {};
        //use be-scoped to create a proxy (PropertyBag) that serves as a host for transforms.
        //but only if has itemscope attribute
        const hasItemScope = self.hasAttribute('itemscope');
        if (hasItemScope) {
            await doBeHavings(self, [
                {
                    be: 'scoped',
                    waitForResolved: true
                },
            ]);
        }
        //get reactive definitions from be-indefinite
        await doBeHavings(template, [
            {
                be: 'indefinite',
                having: {
                    meta
                },
                waitForResolved: true,
            },
        ]);
        const { transformIslets } = meta;
        //do transform
        await doBeHavings(self, [{
                be: 'transrendered',
                having: {
                    template,
                    transformIslets,
                },
                waitForResolved: true,
            }]);
        return mold;
    }
    findTemplate(pp) {
        const { self, id } = pp;
        return {
            template: self.getRootNode().getElementById(id)
        };
    }
}
const tagName = 'be-spawn-of';
const ifWantsToBe = 'spawn-of';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            virtualProps: ['template', 'id'],
            primaryProp: 'id',
            intro: 'intro',
        },
        actions: {
            passTemplate: {
                ifAllOf: ['template'],
                returnObjMold: {
                    resolved: true
                }
            },
            findTemplate: {
                ifAllOf: ['id'],
                ifNoneOf: ['template']
            }
        },
    },
    complexPropDefaults: {
        controller: BeSpawnOf
    }
});
register(ifWantsToBe, upgrade, tagName);
