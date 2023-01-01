import Realm from "realm";

const ProductSchema = {
    name: "Product",
    properties: {
        _id: "int",
        name: "string",
        stock: "int",
        price: "int"
    },
    primaryKey: "_id"
}

const realm = await Realm.open({
    path: "realm-files/products",
    schema: [ProductSchema],
});


// Add a couple of Tasks in a single, atomic transaction
let task1, task2;
// realm.write(() => {
//     const task1 = realm.create("Product", {
//         _id: 1,
//         name: "Panadol",
//         price: 200,
//         stock: 12
//     });

//     const task2 = realm.create("Product", {
//         _id: 2,
//         name: "Viagra",
//         price: 1000,
//         stock: 3
//     });
// });
// use task1 and task2
