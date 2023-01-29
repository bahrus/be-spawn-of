import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeSpawnOf extends EventTarget {
    async searchHost(pp, mold) {
        return mold;
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
            virtualProps: ['isC']
        },
        actions: {
            searchHost: {
                ifAllOf: ['isC'],
                returnObjMold: {
                    resolved: true
                }
            }
        }
    },
    complexPropDefaults: {
        controller: BeSpawnOf
    }
});
register(ifWantsToBe, upgrade, tagName);
