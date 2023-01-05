import * as React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import realmDataProvider from "./realmDataProvider";
// import jsonServerProvider from "ra-data-json-server";
import { ProductCreate, ProductEdit, ProductList } from "./product";

const App = () => (
  <Admin dataProvider={realmDataProvider}>
    <Resource
      name="Product"
      list={ProductList}
      edit={ProductEdit}
      create={ProductCreate}
    />
  </Admin>
);

export default App;
