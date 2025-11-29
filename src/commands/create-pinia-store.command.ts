import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { PiniaStoreType } from '../enums/pinia-store-type.enum';
import { generatePiniaStore } from '../generators/pinia-store.generator';
import { ConfigHelper } from '../helpers/config.helper';

interface StoreTypeChoice extends vscode.QuickPickItem {
  type: PiniaStoreType;
}

/**
 * Command to create a new Pinia store file
 * Prompts user for store name and type, then creates the file
 */
export async function createPiniaStoreCommand(uri?: vscode.Uri): Promise<void> {
  const config = ConfigHelper.getInstance();
  
  try {
    // Determine target directory
    const targetDir = await getTargetDirectory(uri, config);
    if (!targetDir) {
      return;
    }

    // Get store name from user
    const storeName = await vscode.window.showInputBox({
      prompt: 'Enter store name (e.g., "user", "cart", "auth")',
      placeHolder: 'storeName',
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Store name is required';
        }
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value.trim())) {
          return 'Store name must start with a letter and contain only alphanumeric characters';
        }
        return undefined;
      }
    });

    if (!storeName) {
      return; // User cancelled
    }

    // Get store type preference
    const storeType = await selectStoreType(config);
    if (!storeType) {
      return; // User cancelled
    }

    // Get configuration options
    const includeExamples = config.pinia.includeExamples();

    // Generate store content
    const content = generatePiniaStore({
      name: storeName.trim(),
      type: storeType,
      includeExampleState: includeExamples,
      includeExampleGetter: includeExamples,
      includeExampleAction: includeExamples
    });

    // Determine file path
    const fileName = `${storeName.trim().toLowerCase()}.store.ts`;
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

    vscode.window.showInformationMessage(`Pinia store "${fileName}" created successfully!`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(`Failed to create Pinia store: ${message}`);
  }
}

/**
 * Determines the target directory for the store file
 * Creates 'stores' subdirectory if configured and not already in a stores folder
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

  // Check if we should create in 'stores' subfolder
  const createInStoresFolder = config.pinia.createInStoresFolder();

  if (createInStoresFolder) {
    // Check if already in a stores folder
    const baseName = path.basename(baseDir).toLowerCase();
    if (baseName !== 'stores' && baseName !== 'store') {
      return path.join(baseDir, 'stores');
    }
  }

  return baseDir;
}

/**
 * Shows Quick Pick for selecting store type
 */
async function selectStoreType(config: ConfigHelper): Promise<PiniaStoreType | undefined> {
  const defaultType = config.pinia.defaultStoreType();

  const choices: StoreTypeChoice[] = [
    {
      label: '$(symbol-function) Setup Store',
      description: 'Composition API style (recommended)',
      detail: 'Uses ref(), computed(), and functions - more flexible and TypeScript friendly',
      type: PiniaStoreType.setup
    },
    {
      label: '$(symbol-class) Options Store',
      description: 'Options API style',
      detail: 'Uses state, getters, actions objects - familiar if coming from Vuex',
      type: PiniaStoreType.options
    }
  ];

  // Sort to put default first
  if (defaultType === 'options') {
    choices.reverse();
  }

  const selected = await vscode.window.showQuickPick(choices, {
    placeHolder: 'Select Pinia store type',
    title: 'Create Pinia Store'
  });

  return selected?.type;
}
