"use strict";

/**
 * Model class. Knows everything about API endpoint and data structure. Can format/map data to any structure.
 * @constructor
 */
class Model {
    constructor() {
        /**
         * Fetch the stores object.
         *
         * @returns {Promise} the promise object will be resolved once the stores object gets loaded.
         *
         * @public
         */
        this.fetchStores = async function() {
            const storesData = await this.fetchData(_storesURLTemplate);
            _currentStore = storesData;
            return storesData;
        };

        /**
         * Fetch the store object by storeId.
         *
         * @param {number} storeId the order id.
         *
         * @returns {Promise} the promise object will be resolved once the Store object gets loaded.
         *
         * @public
         */
        this.fetchStoreById = async function(storeId) {
            const storeData = await this.fetchData(
                _storesURLTemplateById.replace("{STORE_ID}", storeId)
            );
            _currentStore = storeData;
            return storeData;
        };

        /**
         * Fetch the products object by  store id.
         *
         * @param {number} storeId the order id.
         *
         * @returns {Promise} the promise object will be resolved  Products array  gets loaded.
         *
         * @public
         */
        this.fetchProductsByStoreId = async function(storeId) {
            const storeData = await this.fetchData(
                _productsURLTemplateByStoreId.replace("{STORE_ID}", storeId)
            );
            let _storeProducts = storeData;
            return storeData;
        };

        /**
         * Fetch the products object by  product id.
         *
         * @param {number} productId the product id.
         *
         * @returns {Promise} the promise object will be resolved  Product object  gets loaded.
         *
         * @public
         */
        this.fetchProductById = async function(productId) {
            const product = await this.fetchData(
                `http://localhost:3000/api/Products/ + ${productId}`
            );
            let _storeProducts = product;
            return product;
        };

        /**
         * Fetch the store object by products status.
         *
         * @param {number} storeId the store id.
         * @param {string} URL selected URL.
         *
         * @returns {Promise} the promise object will be resolved  Product object  gets loaded.
         *
         * @public
         */
        this.fetchProductsByStatus = async function(storeId, URL) {
            const products = await this.fetchData(
                `http://localhost:3000/api/Stores/${storeId}` + URL
            );
            let _storeProducts = products;
            return products;
        };

        /**
         * Fetch the store object by products status and search word.
         *
         * @param {number} storeId the product id.
         * @param {string} URL the search products URL.
         *
         * @returns {Promise} the promise object will be resolved  Product object  gets loaded.
         *
         * @public
         */
        this.fetchProductsByStatusAndSearchWord = async function(storeId, URL) {
            const products = await this.fetchData(
                `http://localhost:3000/api/Stores//${storeId}` + URL
            );
            let _storeProducts = products;
            return products;
        };

        /**
         * Common method which "promisifies" the XHR calls.
         *
         * @param {string} url the URL address to fetch.
         *
         * @return {Promise} the promise object will be resolved once XHR gets loaded/failed.
         *
         * @public
         */
        this.fetchData = function(url) {
            return new Promise(function(resolve, reject) {
                var req = new XMLHttpRequest();
                req.open("GET", url, true);

                // listen to load event
                req.addEventListener("load", function() {
                    if (req.status < 400) {
                        resolve(JSON.parse(req.responseText));
                    } else {
                        reject(new Error("Request failed: " + req.statusText));
                    }
                });

                // listen to error event
                req.addEventListener("error", function() {
                    reject(new Error("Network error"));
                });
                req.send();
            });
        };

        /**
         * Method determines the availability of goods in the store.
         *
         * @return {Object} the object availability of goods in the store.
         *
         * @public
         */
        this.getStatus = function() {
            return Status;
        };

        /**
         * Object of the availability of goods in the store.
         * @constant
         * @type {Object}
         *
         * @private
         */
        let Status = {};

        var _apiPrefix = "http://localhost:3000/api";

        /**
         * URL template for getting the stores from local server.
         * @type {string}
         *
         * @example _storesURLTemplate/Stores;
         *
         * @private
         */
        var _storesURLTemplate = _apiPrefix + "/Stores";

        /**
         * URL template for patching the store to local server.
         * @type {string}
         *
         * @example _storesURLTemplate.replace("{Stores}", Id);
         *
         * @private
         */
        var _storesURLTemplateById = _apiPrefix + "/Stores/{STORE_ID}";

        /**
         * URL template for getting the store products from local server by  store id.
         * @type {string}
         *
         * @example _storesURLTemplate.replace("{Stores}", Id)/rel_Products;
         *
         * @private
         */
        var _productsURLTemplateByStoreId =
            _apiPrefix + "/Stores/{STORE_ID}/rel_Products";

        /**
         * The link to the currently selected order object.
         * @type {Object}
         * @private
         */
        var _currentStore = null;

        /**
         * Method set the availability of goods in the store.
         *
         * @param {Object} products products in the store.
         *
         * @private
         */
        this.setStatus = function(products) {
            Status.allProducts = products.length;
            Status.inStockProducts = 0;
            Status.storageProducts = 0;
            Status.outStockProducts = 0;
            products.forEach(el => {
                switch (el.Status) {
                    case "OK":
                        Status.inStockProducts++;
                        break;
                    case "STORAGE":
                        Status.storageProducts++;
                        break;
                    default:
                        Status.outStockProducts++;
                        break;
                }
            });
        };

        /**
         * Method create the  new store.
         *
         * @param {Object} Store the new store.
         *
         * @return {Promise} the promise created store.
         * @public
         */
        this.postStore = function(Store) {
            return new Promise(function(resolve, reject) {
                const req = new XMLHttpRequest();
                req.open("POST", "http://localhost:3000/api/Stores", true);
                req.setRequestHeader("Content-Type", "application/json");
                // listen to load event
                req.addEventListener("load", function() {
                    if (req.status < 400) {
                        resolve(JSON.parse(req.responseText));
                    } else {
                        reject(new Error("Request failed: " + req.statusText));
                    }
                });
                req.send(JSON.stringify(Store));
            });
        };

        /**
         * Method delete the   store.
         *
         * @param {number} id  the store id.
         *
         * @return {Promise} the promise deleted store.
         * @public
         */
        this.deleteStore = function(id) {
            return new Promise(function(resolve, reject) {
                const req = new XMLHttpRequest();
                req.open(
                    "DELETE",
                    "http://localhost:3000/api/Stores/" + id,
                    true
                );
                // listen to load event
                req.addEventListener("load", function() {
                    if (req.status < 400) {
                        alert("Store was successfully removed!");
                    } else {
                        reject(new Error("Request failed: " + req.statusText));
                    }
                });
                req.send();
            });
        };

        /**
         * Method create the  new product.
         *
         * @param {Object} product the new product.
         *
         * @return {Promise} the promise created product.
         * @public
         */
        this.postProduct = function(product) {
            return new Promise(function(resolve, reject) {
                const req = new XMLHttpRequest();
                req.open("POST", "http://localhost:3000/api/Products", true);
                req.setRequestHeader("Content-Type", "application/json");
                // listen to load event
                req.addEventListener("load", function() {
                    if (req.status < 400) {
                        alert("Product was successfully created!");
                    } else {
                        reject(new Error("Request failed: " + req.statusText));
                    }
                });
                req.send(JSON.stringify(product));
            });
        };

        /**
         * Method delete the   store.
         *
         * @param {number} id  the store id.
         *
         * @return {Promise} the promise deleted product by id.
         * @public
         */
        this.deleteProduct = function(id) {
            return new Promise(function(resolve, reject) {
                const req = new XMLHttpRequest();
                req.open(
                    "DELETE",
                    "http://localhost:3000/api/Products/" + id,
                    true
                );
                // listen to load event
                req.addEventListener("load", function() {
                    if (req.status < 400) {
                        alert("Product was successfully removed!");
                    } else {
                        reject(new Error("Request failed: " + req.statusText));
                    }
                });
                req.send();
            });
        };

        /**
         * Method update the  product.
         *
         * @param {Object} product the  product.
         * @param {number} id the  product id.
         *
         * @return {Promise} the promise updated product by id.
         * @public
         */
        this.updateProduct = function(product, id) {
            return new Promise(function(resolve, reject) {
                const req = new XMLHttpRequest();
                req.open(
                    "PUT",
                    "http://localhost:3000/api/Products/" + id,
                    true
                );
                req.setRequestHeader("Content-Type", "application/json");
                // listen to load event
                req.addEventListener("load", function() {
                    if (req.status < 400) {
                        alert("Product was successfully updated!");
                    } else {
                        reject(new Error("Request failed: " + req.statusText));
                    }
                });
                req.send(JSON.stringify(product));
            });
        };

        /**
         * Object with filters for searching in rest API.
         * @type {Object}
         *
         * @example {key, "value"};
         *
         * @private
         */
        this._apiValue = {
            Filter: "filter[where][Status]=",
            Name: "filter[where][or][1][Name][regexp]=",
            Price: "&filter[where][or][2][Price][like]=",
            Specs: "&filter[where][or][3][Specs][regexp]=",
            SupplierInfo: "&filter[where][or][4][SupplierInfo][regexp]=",
            MadeIn: "&filter[where][or][5][MadeIn][regexp]=",
            ProductionCompanyName:
                "&filter[where][or][6][ProductionCompanyName][regexp]=",
            Rating: "&filter[where][or][7][Rating][like]="
        };

        /**
         * Generates URL for search.
         *
         * @param {ENUM} status status search word.
         * @param {string} searchWord search word.
         *
         * @returns {string} product URL.
         *
         * @public
         */
        this.generateProductsURL = function(status, searchWord) {
            let productsURL = null;

            if (status === "ALL" && !searchWord) {
                productsURL = "/rel_Products";
            }
            if (status === "ALL" && searchWord) {
                productsURL =
                    "/rel_Products?" +
                    `&${this._apiValue.Name}${searchWord}` +
                    `${this._apiValue.Price}${searchWord}` +
                    `${this._apiValue.Specs}${searchWord}` +
                    `${this._apiValue.SupplierInfo}${searchWord}` +
                    `${this._apiValue.MadeIn}${searchWord}` +
                    `${this._apiValue.ProductionCompanyName}${searchWord}` +
                    `${this._apiValue.Rating}${searchWord}`;
            }
            if (status !== "ALL" && !searchWord) {
                productsURL = `"/rel_Products?" +
                    ${this._apiValue.Filter}${status}`;
            }
            if (status !== "ALL" && searchWord) {
                productsURL =
                    "/rel_Products?" +
                    `${this._apiValue.Filter}${status}` +
                    `&${this._apiValue.Name}${searchWord}` +
                    `${this._apiValue.Price}${searchWord}` +
                    `${this._apiValue.Specs}${searchWord}` +
                    `${this._apiValue.SupplierInfo}${searchWord}` +
                    `${this._apiValue.MadeIn}${searchWord}` +
                    `${this._apiValue.ProductionCompanyName}${searchWord}` +
                    `${this._apiValue.Rating}${searchWord}`;
            }
            return productsURL;
        };
    }
}
