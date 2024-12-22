import { Plugin, MarkdownView, TFile, PluginManifest, ItemView } from 'obsidian';
import CypherLinksPlugin from '../main';
import { VIEW_TYPE_CYPHER_LINKS } from '../constants';

// Mock Obsidian's API
jest.mock('obsidian');

describe('CypherLinks Plugin', () => {
    let plugin: CypherLinksPlugin;
    let mockApp: any;
    let mockWorkspace: any;
    let mockManifest: any;

    beforeEach(() => {
        // Setup mocks
        mockWorkspace = {
            on: jest.fn(),
            getLeavesOfType: jest.fn().mockReturnValue([]),
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
            const mockLeaf = {
                view: {
                    updateWith: jest.fn(),
                },
            };

            mockWorkspace.getActiveViewOfType.mockReturnValue({
                file: mockFile,
            });
            mockWorkspace.getLeavesOfType.mockReturnValue([mockLeaf]);

            plugin.updateViewContent(mockFile);

            expect(mockApp.fileManager.processFrontMatter).toHaveBeenCalledWith(
                mockFile,
                expect.any(Function)
            );
        });
    });
});
