import { Options, OptionsReader } from 'typedoc';
import { TypedocPluginMarkdownOptions } from './models';
export declare class MarkdownPluginOptionsReader implements OptionsReader {
    priority: number;
    options: Partial<TypedocPluginMarkdownOptions>;
    name: string;
    constructor(options: Partial<TypedocPluginMarkdownOptions>);
    read(container: Options): void;
}
