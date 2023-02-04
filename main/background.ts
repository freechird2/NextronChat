import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import Store from "electron-store";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 900,
    height: 1000,
    minHeight: 800,
    minWidth: 550,
  });

  mainWindow.setMenu(null);

  if (isProd) {
    await mainWindow.loadURL("app://./login.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/login`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  const store = new Store();
  store.delete("uid");
  store.delete("room");

  app.quit();
});
