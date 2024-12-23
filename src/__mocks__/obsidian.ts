import {CypherLinksView} from "view";

export class Plugin {
    app: any;
    manifest: any;

    constructor() {
        this.app = {};
        this.manifest = {};
    }

    registerView(viewType: string, callback: any) {
        return Promise.resolve();
    }

    registerEvent(event: any) {
        return Promise.resolve();
    }

    async onload() {
        return Promise.resolve();
    }

    async loadData() {
        return Promise.resolve();
    }

    async addSettingTab(settingTab: any) {
        return Promise.resolve();
    }

    activateView() {
        return Promise.resolve();
    }
}

export class MarkdownView {
    file: any;

    constructor() {
        this.file = null;
    }
}

export class TFile {
    path: string;

    constructor() {
        this.path = '';
    }
}

export class PluginManifest {
    name: string;

    constructor() {
        this.name = '';
    }
}

export class ItemView {
    private containerEl: any;
    constructor() {
        this.containerEl = {
            children: [],
        }
    }
}

export class PluginSettingTab {
    constructor() {
    }
}

export class WorkspaceLeaf {
    view: CypherLinksView;

    constructor(view: CypherLinksView) {
        this.view = view;
    }
}