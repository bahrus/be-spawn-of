import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';

export interface EndUserProps{
    placement: 'fillParent' | 'appendAdjacent'
}

export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLTemplateElement>{
    isC: boolean;
}

export type Proxy = HTMLTemplateElement & VirtualProps;

export interface PP extends VirtualProps{
    proxy: Proxy;
}

export type PPP = Partial<PP>;

export type PPE = [PPP, EventConfigs<Proxy, Actions>];

export interface Actions{
    searchHost(pp: PP, mold: PPP): Promise<PPP>;
}