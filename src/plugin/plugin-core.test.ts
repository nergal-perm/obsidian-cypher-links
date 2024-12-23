import {PluginCore} from "./plugin-core";

describe('Core plugin functionality', () => {
   it('should be able to instantiate the plugin', () => {
       let actual = PluginCore.createNull();
       expect(actual).not.toBeNull();
   });

   it('should register a leaf change event', () => {
       let actual = PluginCore.createNull();
       let leafChange = actual.onLeafChange(() => {});
       expect(leafChange).not.toBeNull();
   });
});