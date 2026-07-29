import * as vscode from "vscode";
import { registerGameDataFeatures } from "./features/gameData";

export function activate(context: vscode.ExtensionContext): void {
  registerGameDataFeatures(vscode, context);
}

export function deactivate(): void {}
