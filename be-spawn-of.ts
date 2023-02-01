import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';

import {Actions, PP, PPE, VirtualProps, Proxy, PPP} from './types';
import {BeHaving} from 'trans-render/lib/types';
import {EndUserProps as beTransRdrEUP} from 'be-transrendered/types';
import {Meta} from 'be-indefinite/types';

export class BeSpawnOf extends EventTarget implements Actions{
    intro(proxy: Proxy, target: Element): void {
        proxy.id = target.getAttribute('data-spawn-of')!;
    }
    async passTemplate(pp: PP, mold: PPP): Promise<PPP> {
        const {self, template} = pp;
        const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
        import('be-scoped/be-scoped.js');
        import('be-indefinite/be-indefinite.js')
        import('be-transrendered/be-transrendered.js');
        const meta: Meta = {};
        //use be-scoped to create a proxy (PropertyBag) that serves as a host for transforms.
        //but only if has itemscope attribute
        const hasItemScope = self.hasAttribute('itemscope') || self.matches('[be-scoped],[data-be-scoped]');
        if(hasItemScope){
            await doBeHavings(self, [
                {
                    be: 'scoped',
                    waitForResolved: true
                },
            ]);
        }

        //get reactive definitions from be-indefinite
        await doBeHavings(template!, [
            {
                be: 'indefinite',
                having: {
                    meta
                },
                waitForResolved: true,
            },
        ]);
        const {transformIslets} = meta;
        //do transform
        await doBeHavings(self, [            {
            be: 'transrendered', 
            having: {
                template,
                transformIslets,
            } as beTransRdrEUP,
            waitForResolved: true,
        }]);
        return mold;
    }

    findTemplate(pp: PP): PPP {
        const {self, id} = pp;
        return {
            template: (self.getRootNode() as DocumentFragment).getElementById(id!) as HTMLTemplateElement
        }
    }
}

const tagName = 'be-spawn-of';
const ifWantsToBe = 'spawn-of';
const upgrade = '*';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
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