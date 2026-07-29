import type * as vscode from "vscode";
import {
  ValueNode,
  ValueSourceFile,
  valueTreeFromYamlFiles
} from "./model";

export const YAML_FILES_PATTERN = "**/*.yaml";
export const YAML_EXCLUDE_PATTERN =
  "**/{.git,.vscode,bin,build,node_modules,output,temp,Wiki}/**";

interface IndexedYamlFile extends ValueSourceFile {
  uri: vscode.Uri;
}

function normalizedRelativePath(
  vscodeApi: typeof vscode,
  uri: vscode.Uri
): string {
  return vscodeApi.workspace.asRelativePath(uri).replaceAll("\\", "/");
}

function directoryName(path: string): string {
  const separator = path.lastIndexOf("/");
  return separator < 0 ? "" : path.slice(0, separator);
}

function isWithin(path: string, directory: string): boolean {
  return directory === "" || path === directory || path.startsWith(`${directory}/`);
}

function projectRootFor(
  documentPath: string,
  files: readonly IndexedYamlFile[]
): string | undefined {
  const markerRoots = files
    .filter((file) => {
      const filename = file.relativePath.split("/").at(-1)?.toLowerCase();
      return filename === "values.yaml" || filename === "version.yaml";
    })
    .map((file) => directoryName(file.relativePath))
    .filter((root) => isWithin(documentPath, root))
    .sort((a, b) => b.length - a.length);

  return markerRoots[0];
}

export class TemplateValueIndex {
  private readonly files = new Map<string, IndexedYamlFile>();
  readonly ready: Promise<void>;

  constructor(private readonly vscodeApi: typeof vscode) {
    this.ready = this.loadWorkspace();
  }

  private async loadWorkspace(): Promise<void> {
    const uris = await this.vscodeApi.workspace.findFiles(
      YAML_FILES_PATTERN,
      YAML_EXCLUDE_PATTERN
    );
    await Promise.all(uris.map((uri) => this.loadUri(uri)));
  }

  async loadUri(uri: vscode.Uri): Promise<void> {
    const bytes = await this.vscodeApi.workspace.fs.readFile(uri);
    this.setText(uri, Buffer.from(bytes).toString("utf8"));
  }

  setText(uri: vscode.Uri, text: string): void {
    this.files.set(uri.toString(), {
      uri,
      relativePath: normalizedRelativePath(this.vscodeApi, uri),
      text
    });
  }

  removeUri(uri: vscode.Uri): void {
    this.files.delete(uri.toString());
  }

  treeFor(documentUri: vscode.Uri): ValueNode | undefined {
    const documentPath = normalizedRelativePath(this.vscodeApi, documentUri);
    const files = [...this.files.values()];
    const projectRoot = projectRootFor(documentPath, files);
    if (projectRoot === undefined) {
      return undefined;
    }

    return valueTreeFromYamlFiles(
      files.filter((file) => isWithin(file.relativePath, projectRoot))
    );
  }
}
