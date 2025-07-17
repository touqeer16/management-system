import Dexie from 'dexie';

const db = new Dexie('ReactDexie');
db.delete().then(() => {
    console.log("Database successfully deleted");
}).catch((err) => {
    console.error("Could not delete database");
}).finally(() => {
    // Do what should be done next...
});

db.version(db.verno + 1).stores({
    productList: 'PrList',
    product: '',
    productClickable: '',
    loginUser: 'loginkey',
    userLocation: 'locationkey',
    productCategory: 'categorykey',
    serviceTable: 'tablekey',
    serviceStaff: 'staffkey',
    registerDetails: 'registerDetailskey',
    printData: '',
    printPostData: '',
    getRecentTransactions: 'recentTransactionKey'
});

db.open().then(function (db) {
    console.log("Database is at version: " + db.verno);
    db.tables.forEach(function (table) {
        console.log("Found a table with name: " + table.name);
    });
});
// addTable('productList', 'PrList');
// addTable('product', '');
// addTable('productClickable', '');
// addTable('loginUser', 'loginkey');
// addTable('userLocation', 'locationkey');
// addTable('productCategory', 'categorykey');
// addTable('serviceTable', 'tablekey');
// addTable('serviceStaff', 'staffkey');
// addTable('registerDetails', 'registerDetailskey');
// addTable('printData', '');
// addTable('printPostData', '');
// addTable('getRecentTransactions', 'recentTransactionKey');

function addTable(tableName, tableSchema) {
    var currentVersion = db.verno;
    //db.close();
    var newSchema = {};
    newSchema[tableName] = tableSchema;

    // Now use statically opening to add table:
    var upgraderDB = new Dexie('ReactDexie');
    upgraderDB.version(currentVersion + 1).stores(newSchema);
    return upgraderDB.open().then(function () {
        upgraderDB.close();
        return db.open(); // Open the dynamic Dexie again.
    });
}

db.on("versionchange", function () {
    // db.close(); // Allow other page to upgrade schema.
    db.open() // Reopen the db again.
        .then(() => {
            // New table can be accessed from now on.
        }).catch(err => {
            // Failed to open. Log or show!
        });
    return false; // Tell Dexie's default implementation not to run.
});



// db.version(2).stores({
//     LoginUser: 'loginkey'
// });

export default db;