import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, PPP} from './types';
import {RenderContext} from 'trans-render/lib/types';

export class BeSpawnOf extends EventTarget implements Actions{
    async searchHost(pp: PP, mold: PPP): Promise<PPP> {
        const {self} = pp;
        const rn = self.getRootNode();
        const host = (<any>rn).host as Element;
        await customElements.whenDefined(host.localName);
        const fragment = self.content.cloneNode(true) as DocumentFragment;
        const {firstElementChild} = fragment;
        const {localName} = firstElementChild!;
        if(typeof (<any>host)[`<${localName}>`] !== 'function'){
            //[TODO] Plan B
            throw 'NI';
        }
        await (<any>host)[`<${localName}>`](fragment);
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
            virtualProps: ['isC']
        },
        actions: {
            searchHost: {
                ifAllOf: ['isC'],
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