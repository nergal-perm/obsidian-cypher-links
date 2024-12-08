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

    async onload() {
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
    constructor() {
    }
}