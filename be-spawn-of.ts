import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, PPP} from './types';
import {RenderContext} from 'trans-render/lib/types';

export class BeSpawnOf extends EventTarget implements Actions{
    async delegateTemplate(pp: PP, mold: PPP): Promise<PPP> {
        const {self, proxy} = pp;
        const deferRendering = self.hasAttribute('defer-rendering');
        //proxy.deferRendering = 
        
        //const rn = self.getRootNode();
        //TODO:
        /**
         * If self is child of tr, tbody, table, ul, ol, etc, then use be-free-ranged.
         * If template has no script children, delegate to be-inclusive
         * For now, always delegate to be-transrendered
         */
        import('be-transrendered/be-transrendered.js');
        import('be-scoped/be-scoped.js');
        (<any>self).beDecorated.transrendered = {
            deferRendering,
        }
        // const host = (<any>rn).host as Element;
        // await customElements.whenDefined(host.localName);
        // const fragment = self.content.cloneNode(true) as DocumentFragment;
        // const {firstElementChild} = fragment;
        // const {localName} = firstElementChild!;
        // if(typeof (<any>host)[`<${localName}>`] !== 'function'){
        //     //[TODO] Plan B
        //     throw 'NI';
        // }
        // await (<any>host)[`<${localName}>`](fragment);
        return mold;
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
            virtualProps: ['template', 'id', 'deferRendering'],
            primaryProp: 'id',
            proxyPropDefaults: {
                
            }
        },
        actions: {
            delegateTemplate: {
                ifAllOf: ['template'],
                returnObjMold: {
                    resolved: true
                }
            }
        },
    },
    complexPropDefaults: {
        controller: BeSpawnOf
    }
});

register(ifWantsToBe, upgrade, tagName);