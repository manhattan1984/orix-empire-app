import Realm from "realm";

export class UseRealm {

    constructor() {


        const ProductSchema = {
            name: "Product",
            properties: {
                _id: "int",
                name: "string",
                stock: "int",
                price: "int",
            },
            primaryKey: "_id",
        };

        Realm.open({
            path: "realm-files/products",
            schema: [ProductSchema],
        }).then((realm) => {
            this.realm = realm
            console.log(this.realm);
        }).catch(error => (
            console.log(error)
        ))


    }

    





    getProducts(name) {

        console.log("begins with", name);


        const products = name ? this.realm.objects("Product").filtered(`name CONTAINS[c] '${name}'`) : [];

        // console.log(products.length);
        const productsJSON = products.map((product) => product.toJSON());
        return productsJSON;
    }

    getProductById(_id) {
        console.log(_id);
        const product = this.realm.objects("Product").filtered(`_id == ${_id}`).toJSON()[0];
        
        return product;

    }

}