import * as vscode from 'vscode';
import { ComposablePattern } from '../enums/composable-pattern.enum';
import { getTargetDirectory } from '../helpers/target-directory.helper';
import { ComposableService, composableService } from '../services/composable.service';

interface ComposablePatternChoice extends vscode.QuickPickItem {
  pattern: ComposablePattern;
}

/**
 * Command to create a new Vue composable file
 * Prompts user for composable name and pattern, then creates the file
 */
export async function createComposableCommand(
  uri?: vscode.Uri,
  service: ComposableService = composableService
): Promise<void> {
  try {
    // Get target directory options from service
    const targetDirOptions = service.getTargetDirectoryOptions();
    
    // Determine target directory using shared helper
    const targetDir = await getTargetDirectory(uri, targetDirOptions);
    if (!targetDir) {
      return;
    }

    // Get composable name from user
    const composableName = await vscode.window.showInputBox({
      prompt: 'Enter composable name (e.g., "counter", "fetch", "mousePosition")',
      placeHolder: 'composableName',
      validateInput: (value) => service.validateName(value)
    });

    if (!composableName) {
      return; // User cancelled
    }

    // Get composable pattern preference
    const pattern = await selectComposablePattern();
    if (!pattern) {
      return; // User cancelled
    }

    // Create composable using service
    const result = await service.create({
      name: composableName,
      pattern,
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
          name: composableName,
          pattern,
          targetDirectory: targetDir,
          overwriteExisting: true,
        });
        if (retryResult.success && retryResult.filePath) {
          await openCreatedFile(retryResult.filePath, retryResult.fileName!);
        } else {
          vscode.window.showErrorMessage(`Failed to create composable: ${retryResult.error}`);
        }
      }
      return;
    }

    // Handle other errors
    if (!result.success) {
      vscode.window.showErrorMessage(`Failed to create composable: ${result.error}`);
      return;
    }

    // Open the created file
    await openCreatedFile(result.filePath!, result.fileName!);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(`Failed to create composable: ${message}`);
  }
}

/**
 * Opens the created file in the editor
 */
async function openCreatedFile(filePath: string, fileName: string): Promise<void> {
  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);
  vscode.window.showInformationMessage(`Composable "${fileName}" created successfully!`);
}

/**
 * Shows Quick Pick for selecting composable pattern
 * @internal Exported for testing
 */
export async function selectComposablePattern(): Promise<ComposablePattern | undefined> {
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
