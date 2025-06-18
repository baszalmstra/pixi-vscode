import * as assert from 'assert';
import * as vscode from 'vscode';
import { PixiTaskCodeLensProvider } from '../../taskCodeLensProvider';

suite('PixiTaskCodeLensProvider Tests', () => {
        test('provideCodeLenses returns a CodeLens for each task', async () => {
                const content = `[tasks]\ntest1 = "echo 1"\ntest2 = { cmd = "echo 2" }\n`;
                const document = await vscode.workspace.openTextDocument({
                        content,
                        language: 'toml'
                });
                const provider = new PixiTaskCodeLensProvider();
                const lenses = await provider.provideCodeLenses(document, new vscode.CancellationTokenSource().token);
                assert.ok(Array.isArray(lenses));
                assert.strictEqual((lenses as vscode.CodeLens[]).length, 2);
                const [first] = lenses as vscode.CodeLens[];
                assert.strictEqual(first.command?.command, 'pixi-vscode.runTask');
                assert.strictEqual(first.command?.arguments?.[1], 'test1');
        });
});
