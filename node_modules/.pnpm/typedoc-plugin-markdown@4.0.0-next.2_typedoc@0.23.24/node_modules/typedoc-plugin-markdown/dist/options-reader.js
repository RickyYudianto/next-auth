"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownPluginOptionsReader = void 0;
class MarkdownPluginOptionsReader {
    constructor(options) {
        this.priority = 900;
        this.name = 'custom-options';
        this.options = options;
    }
    read(container) {
        if (this.options) {
            Object.entries(this.options).forEach(([key, value]) => {
                container.setValue(key, value);
            });
        }
    }
}
exports.MarkdownPluginOptionsReader = MarkdownPluginOptionsReader;
