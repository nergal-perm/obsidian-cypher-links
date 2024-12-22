import { Plugin, MarkdownView, TFile, PluginManifest, ItemView, WorkspaceLeaf } from 'obsidian';
import CypherLinksPlugin from '../main';
import { VIEW_TYPE_CYPHER_LINKS } from '../constants';
import { CypherNode } from '../cypher-node';
import { CypherLinksView } from '../view';

// Mock Obsidian's API
jest.mock('obsidian');

describe('CypherLinks Plugin', () => {
    let plugin: CypherLinksPlugin;
    let mockApp: any;
    let mockWorkspace: any;
    let mockManifest: any;
    let mockLeaf: WorkspaceLeaf;
    let mockView: CypherLinksView;

    beforeEach(() => {
        // Setup mocks
        mockView = new CypherLinksView(mockLeaf, plugin);

        mockLeaf = { view: mockView } as unknown as WorkspaceLeaf;

        mockView.containerEl = {
            children: [
                {},
                {
                    empty: jest.fn(),
                    createEl: jest.fn().mockReturnValue({}),
                },
            ],
        } as any;

        mockWorkspace = {
            on: jest.fn(),
            getLeavesOfType: jest.fn().mockReturnValue([mockLeaf]),
            getRightLeaf: jest.fn(),
            revealLeaf: jest.fn(),
            getActiveViewOfType: jest.fn(),
        };

        mockApp = {
            workspace: mockWorkspace,
            fileManager: {
                processFrontMatter: jest.fn(),
            },
            vault: {
                getMarkdownFiles: jest.fn().mockReturnValue([]),
                on: jest.fn(),
            }
        };

        plugin = new CypherLinksPlugin(mockApp, mockManifest);
        // @ts-ignore - Mocking private property
        plugin.app = mockApp;
    });

    describe('onload', () => {
        it('should register view and activate it', async () => {
            const registerViewSpy = jest.spyOn(plugin, 'registerView');
            const activateViewSpy = jest.spyOn(plugin, 'activateView');

            await plugin.onload();

            expect(registerViewSpy).toHaveBeenCalledWith(
                VIEW_TYPE_CYPHER_LINKS,
                expect.any(Function)
            );
            expect(activateViewSpy).toHaveBeenCalled();
        });
    });

    describe('updateViewContent', () => {
        it('should process frontmatter when active view exists', () => {
            const mockFile = new TFile();
            mockFile.path = 'test.md';

            mockWorkspace.getActiveViewOfType.mockReturnValue({
                file: mockFile,
            });

            plugin.nodes.push(new CypherNode(
                { links: ['test'] },
                mockFile
            ));

            plugin.updateViewContent(mockFile);

            expect(mockApp.fileManager.processFrontMatter).toHaveBeenCalledWith(
                mockFile,
                expect.any(Function)
            );
        });
    });
});
