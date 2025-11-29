import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ComposablePattern } from '../enums/composable-pattern.enum';
import { generateComposable } from '../generators/composable.generator';
import { ConfigHelper } from '../helpers/config.helper';

interface ComposablePatternChoice extends vscode.QuickPickItem {
  pattern: ComposablePattern;
}

/**
 * Command to create a new Vue composable file
 * Prompts user for composable name and pattern, then creates the file
 */
export async function createComposableCommand(uri?: vscode.Uri): Promise<void> {
  const config = ConfigHelper.getInstance();
  
  try {
    // Determine target directory
    const targetDir = await getTargetDirectory(uri, config);
    if (!targetDir) {
      return;
    }

    // Get composable name from user
    const composableName = await vscode.window.showInputBox({
      prompt: 'Enter composable name (e.g., "counter", "fetch", "mousePosition")',
      placeHolder: 'composableName',
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Composable name is required';
        }
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value.trim().replace(/^use/i, ''))) {
          return 'Composable name must start with a letter and contain only alphanumeric characters';
        }
        return undefined;
      }
    });

    if (!composableName) {
      return; // User cancelled
    }

    // Get composable pattern preference
    const pattern = await selectComposablePattern();
    if (!pattern) {
      return; // User cancelled
    }

    // Get configuration options
    const useTypeScript = config.composables.useTypeScript();

    // Generate composable content
    const content = generateComposable({
      name: composableName.trim(),
      pattern: pattern,
      useGenerics: useTypeScript
    });

    // Determine file name (always starts with 'use')
    const normalizedName = normalizeComposableName(composableName.trim());
    const extension = useTypeScript ? 'ts' : 'js';
    const fileName = `${normalizedName}.${extension}`;
    const filePath = path.join(targetDir, fileName);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      const overwrite = await vscode.window.showWarningMessage(
        `File "${fileName}" already exists. Overwrite?`,
        'Yes',
        'No'
      );
      if (overwrite !== 'Yes') {
        return;
      }
    }

    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, content, 'utf8');

    // Open the file in editor
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);

    vscode.window.showInformationMessage(`Composable "${fileName}" created successfully!`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(`Failed to create composable: ${message}`);
  }
}

/**
 * Normalizes composable name to standard format (useXxx)
 */
function normalizeComposableName(name: string): string {
  // If already starts with 'use', return lowercased version
  if (name.toLowerCase().startsWith('use')) {
    return 'use' + name.slice(3).charAt(0).toUpperCase() + name.slice(4);
  }
  // Add 'use' prefix
  return 'use' + name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Determines the target directory for the composable file
 * Creates 'composables' subdirectory if configured and not already in a composables folder
 */
async function getTargetDirectory(uri: vscode.Uri | undefined, config: ConfigHelper): Promise<string | undefined> {
  let baseDir: string;

  if (uri) {
    // Use provided URI (from context menu)
    const stat = fs.statSync(uri.fsPath);
    baseDir = stat.isDirectory() ? uri.fsPath : path.dirname(uri.fsPath);
  } else {
    // No URI provided, try to use workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('No workspace folder open');
      return undefined;
    }

    // Use first workspace folder's src directory if it exists
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const srcDir = path.join(workspaceRoot, 'src');
    baseDir = fs.existsSync(srcDir) ? srcDir : workspaceRoot;
  }

  // Check if we should create in 'composables' subfolder
  const createInComposablesFolder = config.composables.createInComposablesFolder();

  if (createInComposablesFolder) {
    // Check if already in a composables folder
    const baseName = path.basename(baseDir).toLowerCase();
    if (baseName !== 'composables' && baseName !== 'composable') {
      return path.join(baseDir, 'composables');
    }
  }

  return baseDir;
}

/**
 * Shows Quick Pick for selecting composable pattern
 */
async function selectComposablePattern(): Promise<ComposablePattern | undefined> {
  const choices: ComposablePatternChoice[] = [
    {
      label: '$(symbol-variable) useState',
      description: 'Simple reactive state',
      detail: 'Basic composable that returns a reactive ref with optional initial value',
      pattern: ComposablePattern.useState
    },
    {
      label: '$(cloud-download) useFetch',
      description: 'Async data fetching',
      detail: 'Fetch data with loading and error states, includes refetch capability',
      pattern: ComposablePattern.useFetch
    },
    {
      label: '$(symbol-event) useEventListener',
      description: 'DOM event handling',
      detail: 'Attach event listener on mount, automatically cleanup on unmount',
      pattern: ComposablePattern.useEventListener
    },
    {
      label: '$(file-code) Custom',
      description: 'Empty template',
      detail: 'Basic composable structure for custom logic - state, computed, methods, lifecycle',
      pattern: ComposablePattern.custom
    }
  ];

  const selected = await vscode.window.showQuickPick(choices, {
    placeHolder: 'Select composable pattern',
    title: 'Create Vue Composable'
  });

  return selected?.pattern;
}
