import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

import Realm from "realm";
import { UseRealm } from "./useRealm";
// import { getProductById, getProducts, UseRealm } from "./useRealm";

require("@electron/remote/main").initialize();

// const { app } = require("@electron/remote");

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const RealmDb = new UseRealm();

ipcMain.on("show-products", async (event, arg) => {
  console.log("show", arg);

  const products = RealmDb.getProducts(arg);
  console.log("produc", products);

  event.sender.send("products-ready", products);
});

ipcMain.handle("get-product-by-id", async (event, arg) => {
  console.log("_id", arg);
  const product = RealmDb.getProductById(arg);

  console.log("productor", product);

  return product;
});

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // require("@electron/remote/main").enable(mainWindow.webContents);

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
