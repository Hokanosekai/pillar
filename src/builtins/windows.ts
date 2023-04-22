export const Windows = `
import Process
import Keyboard

const Windows = {
  powershell: fn(cmd) {
    Keyboard.press(Keys.Gui, Keys.R)
    Process.wait(500)
    Process.write("powershell " + cmd)
    Process.wait(500)
    Keyboard.press(Keys.Enter)
  },
  cmd: fn(cmd) {
    Keyboard.press(Keys.Gui, Keys.R)
    Process.wait(500)
    Process.write("cmd /c " + cmd)
    Process.wait(500)
    Keyboard.press(Keys.Enter)
  },
  explorer: fn(path) {
    Keyboard.press(Keys.Gui, Keys.R)
    Process.wait(500)
    Process.write("explorer " + path)
    Process.wait(500)
    Keyboard.press(Keys.Enter)
  },
  open: fn(path) {
    Keyboard.press(Keys.Gui, Keys.R)
    Process.wait(500)
    Process.write(path)
    Process.wait(500)
    Keyboard.press(Keys.Enter)
  },
  shutdown: fn() {
    Windows.powershell("shutdown /s /t 0")
  },
  restart: fn() {
    Windows.powershell("shutdown /r /t 0")
  },
  lock: fn() {
    Windows.powershell("rundll32.exe user32.dll,LockWorkStation")
  },
  sleep: fn() {
    Windows.powershell("rundll32.exe powrprof.dll,SetSuspendState 0,1,0")
  },
  hibernate: fn() {
    Windows.powershell("rundll32.exe powrprof.dll,SetSuspendState Hibernate")
  },
  logoff: fn() {
    Windows.powershell("shutdown /l /t 0")
  },
  volumeSet: fn(volume) {
    Windows.powershell("Set-Volume -Device Audio -Volume " + volume)
  },
  openApp: fn(app) {
    Windows.powershell("Start-Process " + app)
  },
}
`;