import * as vscode from 'vscode';
import { PiniaStoreType } from '../enums/pinia-store-type.enum';
import { ConfigHelper } from '../helpers/config.helper';
import { getTargetDirectory } from '../helpers/target-directory.helper';
import { PiniaStoreService, piniaStoreService } from '../services/pinia-store.service';

interface StoreTypeChoice extends vscode.QuickPickItem {
  type: PiniaStoreType;
}

/**
 * Command to create a new Pinia store file
 * Prompts user for store name and type, then creates the file
 */
export async function createPiniaStoreCommand(
  uri?: vscode.Uri,
  service: PiniaStoreService = piniaStoreService
): Promise<void> {
  const config = ConfigHelper.getInstance();
  
  try {
    // Get target directory options from service
    const targetDirOptions = service.getTargetDirectoryOptions();
    
    // Determine target directory using shared helper
    const targetDir = await getTargetDirectory(uri, targetDirOptions);
    if (!targetDir) {
      return;
    }

    // Get store name from user
    const storeName = await vscode.window.showInputBox({
      prompt: 'Enter store name (e.g., "user", "cart", "auth")',
      placeHolder: 'storeName',
      validateInput: (value) => service.validateName(value)
    });

    if (!storeName) {
      return; // User cancelled
    }

    // Get store type preference
    const storeType = await selectStoreType(config);
    if (!storeType) {
      return; // User cancelled
    }

    // Create store using service
    const result = await service.create({
      name: storeName,
      storeType,
      targetDirectory: targetDir,
    });

    // Handle file already exists
    if (!result.success && result.fileExisted) {
      const overwrite = await vscode.window.showWarningMessage(
        `File "${result.fileName}" already exists. Overwrite?`,
        'Yes',
        'No'
      );
      if (overwrite === 'Yes') {
        const retryResult = await service.create({
          name: storeName,
          storeType,
          targetDirectory: targetDir,
          overwriteExisting: true,
        });
        if (retryResult.success && retryResult.filePath) {
          await openCreatedFile(retryResult.filePath, retryResult.fileName!);
        } else {
          vscode.window.showErrorMessage(`Failed to create Pinia store: ${retryResult.error}`);
        }
      }
      return;
    }

    // Handle other errors
    if (!result.success) {
      vscode.window.showErrorMessage(`Failed to create Pinia store: ${result.error}`);
      return;
    }

    // Open the created file
    await openCreatedFile(result.filePath!, result.fileName!);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(`Failed to create Pinia store: ${message}`);
  }
}

/**
 * Opens the created file in the editor
 */
async function openCreatedFile(filePath: string, fileName: string): Promise<void> {
  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);
  vscode.window.showInformationMessage(`Pinia store "${fileName}" created successfully!`);
}

/**
 * Shows Quick Pick for selecting store type
 * @internal Exported for testing
 */
export async function selectStoreType(config: ConfigHelper): Promise<PiniaStoreType | undefined> {
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
