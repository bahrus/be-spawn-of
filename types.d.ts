import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';
import { init } from '../be-decorated/init';

export interface EndUserProps{
    //placement: 'fillParent' | 'appendAdjacent'
    template?: HTMLTemplateElement;
    id?: string;
}

export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLTemplateElement>{
    //isC: boolean;
    //deferRendering?: boolean;
}

export type Proxy = HTMLTemplateElement & VirtualProps;

export interface PP extends VirtualProps{
    proxy: Proxy;
}

export type PPP = Partial<PP>;

export type PPE = [PPP, EventConfigs<Proxy, Actions>];

export interface Actions{
    intro(proxy: Proxy, target: Element): void;
    findTemplate(pp: PP): PPP;
    passTemplate(pp: PP, mold: PPP): Promise<PPP>;
}