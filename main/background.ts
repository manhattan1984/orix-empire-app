import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { Order } from "../types";
import { createWindow } from "./helpers";
import { UseRealm } from "./useRealm";
require("@electron/remote/main").initialize();

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const RealmDb = new UseRealm();

ipcMain.on("show-products", async (event, arg) => {
  const products = RealmDb.getProducts(arg);

  event.sender.send("products-ready", products);
});

ipcMain.handle("get-product-by-id", async (event, arg) => {
  const product = RealmDb.getProductById(arg);

  return product;
});

ipcMain.handle("get-orders", async (event, arg) => {

  const orders = RealmDb.getOrders(arg);

  console.log("filtered orders", orders);

  return orders;
});

ipcMain.handle("add-order", async (event, order: Order) => {
  RealmDb.addOrder(order);
  return;
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
