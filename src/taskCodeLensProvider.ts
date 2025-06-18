import * as vscode from "vscode";

export class PixiTaskCodeLensProvider implements vscode.CodeLensProvider {
	public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
		if (!document.fileName.endsWith("pixi.toml")) {
			return [];
		}
		const lenses: vscode.CodeLens[] = [];
		let inTasks = false;
		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i);
			const text = line.text.trim();
			if (text.startsWith("[tasks]")) {
			    inTasks = true;
			    continue;
			}
			if (inTasks && text.startsWith("[")) {
			    break;
			}
			if (!inTasks) {
			    continue;
			}
			if (text === "" || text.startsWith("#")) {
			    continue;
			}
			const match = /^([A-Za-z0-9_-]+)\s*=/.exec(text);
			if (match) {
			    const taskName = match[1];
			    const range = new vscode.Range(i, 0, i, line.text.length);
			    const cmd: vscode.Command = {
			        title: `Run ${taskName}`,
			        command: "pixi-vscode.runTask",
			        arguments: [document.uri, taskName]
			    };
			    lenses.push(new vscode.CodeLens(range, cmd));
			}
		}
		return lenses;
	}
}
