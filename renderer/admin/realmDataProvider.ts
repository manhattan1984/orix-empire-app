import { convertLegacyDataProvider, fetchUtils } from "react-admin";
import { stringify } from "query-string";
import { ipcRenderer } from "electron";

type GetListQuery = {
  resource: string;
  params: {};
};

export default {
  getList: (resource, params) => {
    console.log("data provider params", params);

    const request = { resource, params };

    const response = ipcRenderer.invoke("get-all-products", request);

    response.then((values) => {
      console.log(values);
    });

    return response;
  },

  getOne: (resource, params) => {
    return Promise<any>;
  },

  getMany: (resource, params) => {
    return Promise<any>;
  },

  getManyReference: (resource, params) => {},

  create: (resource, params) => {
    const request = { resource, params };

    const response = ipcRenderer.invoke("create-product", request);
    return response;
  },

  update: (resource, params) => {
    const request = { resource, params };

    const response = ipcRenderer.invoke("update-product", request);

    return response;
  },

  updateMany: (resource, params) => {},

  delete: (resource, params) => {},

  deleteMany: (resource, params) => {},
};
