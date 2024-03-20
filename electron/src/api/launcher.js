import { LauncherService } from '~/electron/src/lib/LauncherService'
import { RANDOMIZER_BASE_PATH, SEEDS_PATH } from '~/electron/src/lib/Constants'
import path from 'path'
import { FileDownloadService } from '~/electron/src/lib/FileDownloadService'
import { shell } from 'electron'
import { getWindow } from '@/background'
import { spawn } from 'child_process'

export default {
  addExceptionForWindowsDefender() {
    spawn(
      `Start-Process powershell -ArgumentList "if (Add-MpPreference -ExclusionPath '${RANDOMIZER_BASE_PATH}') { echo 'Done, you can close this window' } else { echo 'Could not add an exception for Windows Defender. If you are using an Antivirus other than Windows Defender, you have to add an exception manually if it blocks the Randomizer.' }; sleep 100000" -Verb RunAs`,
      {
        shell: 'powershell.exe',
      },
    ).unref()
  },

  getOpenedSeedPath() {
    return LauncherService.getOpenedSeedPath()
  },

  async getNewGameSeedSource() {
    return await LauncherService.getNewGameSeedSource()
  },

  async setNewGameSeedSource(event, seedPath) {
    await LauncherService.setNewGameSeedSource(seedPath)
  },

  async isRandomizerRunning() {
    return await LauncherService.isRandomizerRunning()
  },

  async launch(event, seedPath = null) {
    try {
      await LauncherService.launch(seedPath)
    } catch (e) {
      console.log('Failed to launch:', e)
      event.sender.send('main.error', e)
    }
  },

  async downloadSeedFromUrl(event, { url, fileName, setToCurrent = true, showInExplorer = false }) {
    return await FileDownloadService.downloadSeedFromUrl(url, fileName, setToCurrent, showInExplorer)
  },

  async downloadSeedsFromUrl(event, { seeds, showInExplorer = false }) {
    await FileDownloadService.downloadSeedsFromUrl(seeds, showInExplorer)
  },

  openRandomizerDirectory() {
    shell.openPath(path.resolve(process.cwd(), RANDOMIZER_BASE_PATH))
  },

  openSeedsDirectory() {
    shell.openPath(path.resolve(process.cwd(), SEEDS_PATH))
  },

  openUrl(event, { url }) {
    shell.openExternal(url)
  },

  focusMainWindow() {
    getWindow().focus()
  },
}
