import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';

import {Actions, PP, PPE, VirtualProps, Proxy, PPP} from './types';
import {BeHaving} from 'trans-render/lib/types';
import {EndUserProps as beTransRdrEUP} from 'be-transrendered/types';
import {Meta} from 'be-indefinite/types';

export class BeSpawnOf extends EventTarget implements Actions{
    intro(proxy: Proxy, target: Element): void {
        proxy.id = target.getAttribute('data-spawn-of')!;
        target.removeAttribute('data-spawn-of');

    }
    async passTemplate(pp: PP, mold: PPP): Promise<PPP> {
        const {self, template} = pp;
        if(self.childElementCount > 0){
            const {content} = template!;
            const nodes = Array.from(self.childNodes);
            for(const node of nodes){
                content.appendChild(node);
            }
        }
        const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
        import('be-scoped/be-scoped.js');
        import('be-indefinite/be-indefinite.js')
        import('be-transrendered/be-transrendered.js');
        
        //use be-scoped to create a proxy (PropertyBag) that serves as a host for transforms.
        //but only if has itemscope attribute
        const isBeScoped = self.matches('[be-scoped],[data-be-scoped]');
        if(isBeScoped){
            await doBeHavings(self, [
                {
                    be: 'scoped',
                    waitForResolved: true
                },
            ]);
        }else if(self.matches('[is-scoped],[data-is-scoped') && !self.hasAttribute('itemscope')){
            debugger;
        }

        //get reactive definitions from be-indefinite
        let meta = (<any>template!)?.beDecorated?.indefinite?.meta as Meta;
        if(meta === undefined){
            await doBeHavings(template!, [
                {
                    be: 'indefinite',
                    waitForResolved: true,
                },
            ]);
        }
        meta = (<any>template!)?.beDecorated?.indefinite?.meta;
        const {transformIslets} = meta;
        const clonedTransformIslets = transformIslets?.map(x => ({...x}));
        await doBeHavings(self, [{
            be: 'transrendered', 
            having: {
                template,
                transformIslets: clonedTransformIslets,
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