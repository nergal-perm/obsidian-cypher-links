import {EventRef, Workspace, WorkspaceLeaf} from "obsidian";


interface ObsidianWorkspace {
    on(name: string, callback: (leaf: (WorkspaceLeaf | null)) => any): EventRef;
}

class StubbedWorkspace implements ObsidianWorkspace {
    on(name: string, callback: (leaf: WorkspaceLeaf | null) => any): EventRef {
        return new class implements EventRef {};
    }

}

export class PluginCore {
    private _workspace: ObsidianWorkspace;

    constructor(workspace: ObsidianWorkspace) {
        this._workspace = workspace;
    }

    static create(workspace: Workspace): PluginCore {
        return new PluginCore(workspace);
    }

    static createNull(app: ObsidianWorkspace = new StubbedWorkspace()): PluginCore {
        return new PluginCore(app);
    }

    public onLeafChange(callback: (leaf: WorkspaceLeaf | null) => any) : EventRef {
        return this._workspace.on('active-leaf-change', callback);
    }
}