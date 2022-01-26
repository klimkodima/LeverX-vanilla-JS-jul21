"use strict";

/**
 * Controller class. Orchestrates the model and view objects. A "glue" between them.
 *
 * @param {View} view view instance.
 * @param {Model} model model instance.
 *
 * @constructor
 */
class Controller {
    constructor(view, model) {
        /**
         * Initialize controller.
         *
         * @public
         */
        this.init = function() {
            let searchStoresField = view.getSearchStoresField();
            let findStoresButton = view.getElem("#findStores");
            let storesList = view.getElem("#storesList");
            let showStoresButton = view.getElem("#showStores");
            let createStoreFormButton = view.getElem("#createStoreForm");
            let newStoreForm = view.getElem("#newStoreForm");
            let deleteStoreButton = view.getElem("#deleteStoreButton");
            let createProductFormButton = view.getElem(
                "#createProductFormButton"
            );
            let newProductForm = view.getElem("#createProductForm");
            let productsTable = view.getElem("#productsTable");
            let findProducts = view.getElem("#findProducts");
            let statusBar = view.getElem("#statusBar");
            let editProductForm = view.getElem("#editProductForm");

            this.updateStoresList();
            editProductForm.addEventListener(
                "submit",
                this._onConfirmEditProduct
            );
            newProductForm.addEventListener("submit", this._onCreateNewProduct);
            storesList.addEventListener("click", this._onRenderStoreDetails);
            searchStoresField.addEventListener(
                "input",
                this._onAdaptButtonsVisibility
            );
            findStoresButton.addEventListener("click", this._onFindStores);
            showStoresButton.addEventListener("click", this._onShowStores);
            createStoreFormButton.addEventListener(
                "click",
                this._onCreateStoreForm
            );
            newStoreForm.addEventListener("submit", this._onCreateNewStore);
            deleteStoreButton.addEventListener("click", this._onDeleteStore);
            createProductFormButton.addEventListener(
                "click",
                this._onCreateProductForm
            );
            productsTable.addEventListener(
                "click",
                this._onClickTableEventHandler
            );
            findProducts.addEventListener("click", this.onSearchProduct);
            statusBar.addEventListener("click", this.onFilterProductsByStatus);
        };

        /**
         *  Filter products by status.
         *
         * @param {Event} e the DOM event object.
         *
         * @public
         */
        this.onFilterProductsByStatus = function(e) {
            targetFilterStatus = view.onToggleFilter(e);
            let Url = model.generateProductsURL(targetFilterStatus);
            model
                .fetchProductsByStatus(+selectedStore.dataset.id, Url)
                .then(function(products) {
                    view.showProducts(products);
                })
                .catch(function(error) {
                    alert(error.message);
                });
        };

        /**
         * Adapt  buttons visibility event handler.
         *
         * @listens input
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onAdaptButtonsVisibility = function(e) {
            if (view.getSearchStoresField().value != 0) {
                view.setStylePropertyElem("#showStores", "none");
            }
            if (view.getSearchStoresField().value == 0) {
                view.setStylePropertyElem("#showStores", "inline-block");
            }
        };

        /**
         * Renderer store details event handler.
         *
         * @listens div  element.
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onRenderStoreDetails = function(e) {
            selectedStore = e.target.closest(".store");
            if (previousStore) {
                previousStore.classList.remove("selected");
            }
            selectedStore.classList.add("selected");
            previousStore = selectedStore;
            model
                .fetchStoreById(+selectedStore.dataset.id)
                .then(function(Store) {
                    view.changeElementClass(
                        "#unselectedWindow",
                        "display-flex",
                        "display-none"
                    );
                    view.changeElementClass(
                        "#storeDetails",
                        "display-flex",
                        "display-flex"
                    );
                    view.showStoreInfo(Store);
                })
                .catch(function(error) {
                    alert(error.message);
                });
            model
                .fetchProductsByStoreId(+selectedStore.dataset.id)
                .then(function(products) {
                    view.showProducts(products);
                    model.setStatus(products);
                })
                .then(function() {
                    let status = model.getStatus();
                    view.showPresenceProducts(status);
                })
                .catch(function(error) {
                    alert(error.message);
                });
            e.preventDefault(+selectedStore.id);
        };

        /**
         * Find store event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onFindStores = function(e) {
            const foundStores = [];
            const text = view.getSearchStoresField().value;
            const elements = storesList.querySelectorAll("li");
            elements.forEach(elem => {
                if (elem.textContent.indexOf(text) != -1) {
                    foundStores.push(elem.closest(".store"));
                }
            });
            view.clearDomElem(storesList);
            foundStores.forEach(elem => {
                storesList.append(elem);
            });
            view.getSearchStoresField().value = "";
            view.setStylePropertyElem("#showStores", "inline-block");
            e.preventDefault();
        };

        /**
         * Show store event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onShowStores = function(e) {
            model
                .fetchStores()
                .then(function(Stores) {
                    view.changeElementClass(
                        "#unselectedWindow",
                        "display-none",
                        "display-flex"
                    );
                    view.changeElementClass(
                        "#storeDetails",
                        "display-flex",
                        "display-none"
                    );
                    view.clearDomElem(storesList);
                    view.fillStoresList(Stores);
                })
                .catch(function(error) {
                    alert(error.message);
                });
            e.preventDefault();
        };

        /**
         * Create new store event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onCreateNewStore = function(e) {
            e.preventDefault();
            if (e.submitter.getAttribute("value") === "cancel") {
                view.hideForm("#newStoreFormContainer");
                newStoreForm.reset();
                view.hideValidationError(newStoreForm);
                return;
            }
            let form = view.validateNewStoreForm(e);
            if (!form.validationError) {
                view.hideForm("#newStoreFormContainer");
                model.postStore(form.store);
                newStoreForm.reset();
                view.clearDomElem(storesList);
                model
                    .fetchStores()
                    .then(function(Stores) {
                        view.fillStoresList(Stores);
                    })
                    .catch(function(error) {
                        alert(error.message);
                    });
            }
        };

        /**
         * Create new product event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onCreateNewProduct = function(e) {
            e.preventDefault();
            if (e.submitter.getAttribute("value") === "Cancel") {
                view.hideForm("#createProductFormContainer");
                view.hideValidationError(view.getElem("#createProductForm"));
                return;
            }
            let form = view.validateProductForm(e);
            form.product.StoreId = +selectedStore.dataset.id;
            if (!form.validationError) {
                model.postProduct(form.product);
                view.hideForm("#createProductFormContainer");
                model
                    .fetchProductsByStoreId(+selectedStore.dataset.id)
                    .then(function(products) {
                        view.showProducts(products);
                        model.setStatus(products);
                    })
                    .then(function() {
                        let status = model.getStatus();
                        view.showPresenceProducts(status);
                    })
                    .catch(function(error) {
                        alert(error.message);
                    });
            }
        };

        /**
         * Update  product event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onConfirmEditProduct = function(e) {
            if (e.submitter.getAttribute("value") === "cancel") {
                view.hideForm("#editProductFormContainer");
                e.preventDefault();
                return;
            }
            let form = view.validateProductForm(e);
            let id = e.target.dataset.id;
            form.product.StoreId = +selectedStore.dataset.id;
            if (!form.validationError) {
                model.updateProduct(form.product, selectedProductId);
                view.hideForm("#editProductFormContainer");
                model
                    .fetchProductsByStoreId(+selectedStore.dataset.id)
                    .then(function(products) {
                        view.showProducts(products);
                        model.setStatus(products);
                    })
                    .then(function() {
                        let status = model.getStatus();
                        view.showPresenceProducts(status);
                    })
                    .catch(function(error) {
                        alert(error.message);
                    });
            }
            e.preventDefault();
        };

        /**
         * Create store form event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onCreateStoreForm = function(e) {
            view.showForm("#newStoreFormContainer");
            e.preventDefault();
        };

        /**
         * Create product form event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onCreateProductForm = function(e) {
            view.showForm("#createProductFormContainer");
            e.preventDefault();
        };

        /**
         * Delete store event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onDeleteStore = function(e) {
            let id = selectedStore.dataset.id;
            let a = confirm("Are you sure you want to delete store?");
            if (a) {
                model.deleteStore(id);
                view.clearDomElem(storesList);
                e.preventDefault();
                model
                    .fetchStores()
                    .then(function(Stores) {
                        view.fillStoresList(Stores);
                    })
                    .catch(function(error) {
                        alert(error.message);
                    });
            }
        };

        /**
         * Table click  event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this._onClickTableEventHandler = function(e) {
            e.preventDefault();
            switch (e.target.dataset.name) {
                case "edit":
                    selectedProductId = e.target.dataset.id;
                    view.showForm("#editProductFormContainer");
                    model
                        .fetchProductById(selectedProductId)
                        .then(function(product) {
                            view.setProductFormValue(editProductForm, product);
                        })
                        .catch(function(error) {
                            alert(error.message);
                        });
                    break;
                case "delete":
                    let a = confirm("Are you sure you want to delete product?");
                    if (a) {
                        model.deleteProduct(e.target.dataset.id);
                        model
                            .fetchProductsByStoreId(+selectedStore.dataset.id)
                            .then(function(products) {
                                view.showProducts(products);
                                model.setStatus(products);
                            })
                            .then(function() {
                                let status = model.getStatus();
                                view.showPresenceProducts(status);
                            })
                            .catch(function(error) {
                                alert(error.message);
                            });
                    }
                    break;
                case "sort":
                    let s;
                    break;
            }
        };

        /**
         * Show store event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this.updateStoresList = function() {
            model
                .fetchStores()
                .then(function(Stores) {
                    view.fillStoresList(Stores);
                })
                .catch(function(error) {
                    alert(error.message);
                });
        };

        /**
         * Search products event handler.
         *
         * @listens button
         *
         * @param {Event} e the DOM event object.
         *
         * @private
         */
        this.onSearchProduct = function(e) {
            const text = view.getElem("#searchProduct").value;
            let Url = model.generateProductsURL(targetFilterStatus, text);
            model
                .fetchProductsByStatus(+selectedStore.dataset.id, Url)
                .then(function(products) {
                    view.showProducts(products);
                })
                .catch(function(error) {
                    alert(error.message);
                });
            e.preventDefault();
        };

        /**
         * The  previously "store" div DOM element.
         *
         * @type {Object} the  previously selected store.
         */
        let previousStore;

        /**
         * The  selected "store" div DOM element.
         *
         * @type {Object} the   selected store.
         */
        let selectedStore;

        /**
         * The  selected product id.
         *
         * @type {number} the   selected product id.
         */
        let selectedProductId;

        /**
         * The  selected filter.
         *
         * @type {string} the   selected filter.
         */
        let targetFilterStatus = "ALL";
    }
}

new Controller(new View(), new Model()).init();
