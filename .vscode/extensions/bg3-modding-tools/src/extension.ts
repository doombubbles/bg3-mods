import * as vscode from "vscode";
import { registerGameDataFeatures } from "./features/gameData";
import { registerTemplateValueFeatures } from "./features/templateValues";

export function activate(context: vscode.ExtensionContext): void {
  registerGameDataFeatures(vscode, context);
  registerTemplateValueFeatures(vscode, context);
}

export function deactivate(): void {}
