"use strict";

/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
class View {
    constructor() {
        /**
         * ID of the "search" input DOM element.
         * @constant
         * @type {string}
         */
        const STORES_SEARCH_FIELD = "storesSearchField";

        /**
    -    * ID of the "storeList" div DOM element'
    -    * @constant
    -    * @type {string}
    -    */
        const STORES_LIST = "storesList";

        /**
         * Returns the element by id.
         *
         * @param {string} id id  the  DOM element.
         * @returns {HTMLElement} the  DOM element.
         *
         * @public
         */
        this.getElem = function(id) {
            return document.querySelector(id);
        };

        /**
         *Change class attribute the  DOM element .
         * @param {string} id id  the  DOM element.
         * @param {string} oldClass  old class the DOM Element.
         * @param {string} newClass new class the DOM Element.
         *
         * @public
         */
        this.changeElementClass = function name(id, oldClass, newClass) {
            let elem = this.getElem(id);
            elem.classList.remove(oldClass);
            elem.classList.add(newClass);
        };

        /**
         * Fill the data into stores list.
         *
         * @param {Object[]} stores the stores data object.
         *
         * @public
         */
        this.fillStoresList = function(stores) {
            let storesList = document.querySelector("#" + STORES_LIST);
            stores.forEach(element => {
                let item = this.createStoreItem(element);
                storesList.append(item);
            });
            return;
        };

        /**
         * Show form.
         *
         *@param {string}   id  the form  DOM element.
         *
         * @public
         */
        this.showForm = function(id) {
            this.changeElementClass(id, "display-none", "display-flex");
        };

        /**
         * Hide form .
         *
         *@param {string} id  the form  DOM element.
         *
         * @public
         */
        this.hideForm = function(id) {
            this.changeElementClass(id, "display-flex", "display-none");
        };

        /**
         * Hide validation Error .
         *
         *@param {form} form the DOM element object.
         *
         * @public
         */
        this.hideValidationError = function(form) {
            let errorMassages = form.querySelectorAll("span");
            errorMassages.forEach(el => {
                el.style.visibility = "hidden";
            });
        };

        /**
         * Validate create new store  form .
         *
         *@param {Event} e the DOM event object.
         *@return {Object} store new  store object.
         *
         * @public
         */
        this.validateNewStoreForm = function(e) {
            let form = e.target;
            let validationError = false;
            let errorMassages = e.target.querySelectorAll("span");

            if (form.Name.value === "") {
                errorMassages[0].style.visibility = "visible";
                form[0].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[0].style.visibility = "hidden";
                form[0].classList.remove("error-border");
            }
            if (form.Email.value === "") {
                errorMassages[1].style.visibility = "visible";
                form[1].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[1].style.visibility = "hidden";
                form[1].classList.remove("error-border");
            }
            if (form.Address.value === "") {
                errorMassages[3].style.visibility = "visible";
                form[3].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[3].style.visibility = "hidden";
                form[3].classList.remove("error-border");
            }
            if (form.FlorArea.value - 1 < 1000) {
                errorMassages[5].style.visibility = "visible";
                form[5].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[5].style.visibility = "hidden";
                form[5].classList.remove("error-border");
            }
            let store = {
                Name: form.Name.value,
                Email: form.Email.value,
                PhoneNumber: form.PhoneNumber.value,
                Address: form.Address.value,
                Established: form.Established.value,
                FloorArea: +form.FlorArea.value
            };
            return {
                store: store,
                validationError: validationError
            };
        };

        /**
         * Validate create new product  form .
         *
         *@param {Event} e the DOM event object.
         *
         *@return {Object} new  product object.
        @return {boolean} validation error.
         *
         * @public
         */
        this.validateProductForm = function(e) {
            document.forms.register.noValidate = true;
            let form = e.target;
            let validationError = false;
            let errorMassages = e.target.querySelectorAll("span");
            if (form.Name.value === "") {
                errorMassages[0].style.visibility = "visible";
                form[0].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[0].style.visibility = "hidden";
                form[0].classList.remove("error-border");
            }
            if (form.Price.value === "") {
                errorMassages[1].style.visibility = "visible";
                form[1].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[1].style.visibility = "hidden";
                form[1].classList.remove("error-border");
            }
            if (form.Specs.value === "") {
                errorMassages[2].style.visibility = "visible";
                form[2].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[2].style.visibility = "hidden";
                form[2].classList.remove("error-border");
            }
            if (form.Rating.value > 5 && form.Rating.value < 1) {
                errorMassages[3].style.visibility = "visible";
                form[3].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[3].style.visibility = "hidden";
                form[3].classList.remove("error-border");
            }
            if (form.SupplierInfo.value === "") {
                errorMassages[4].style.visibility = "visible";
                form[4].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[4].style.visibility = "hidden";
                form[4].classList.remove("error-border");
            }
            if (form.Country.value === "") {
                errorMassages[5].style.visibility = "visible";
                form[5].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[5].style.visibility = "hidden";
                form[5].classList.remove("error-border");
            }
            if (form.Company.value === "") {
                errorMassages[6].style.visibility = "visible";
                form[6].classList.add("error-border");
                validationError = true;
            } else {
                errorMassages[6].style.visibility = "hidden";
                form[6].classList.remove("error-border");
            }
            let a = form.Status.options[form.Status.selectedIndex].innerText;
            console.log(a);
            let product = {
                Name: form.Name.value,
                Price: +form.Price.value,
                Specs: form.Specs.value,
                Rating: +form.Rating.value,
                SupplierInfo: form.SupplierInfo.value,
                MadeIn: form.Country.value,
                ProductionCompanyName: form.Company.value,
                Status: form.Status.options[form.Status.selectedIndex].innerText
            };
            return {
                product: product,
                validationError: validationError
            };
        };

        /**
         * Show stock  store products.
         *
         * @param {Object} stock the total number of products on the storage.
         *
         *
         * @public
         */
        this.showPresenceProducts = function(stock) {
            const totalCount = document.querySelector("#totalCount");
            const inStockCount = document.querySelector("#inStockCount");
            const storageCount = document.querySelector("#storageCount");
            const outStockCount = document.querySelector("#outStockCount");
            totalCount.innerText = stock.allProducts;
            inStockCount.innerText = stock.inStockProducts;
            storageCount.innerText = stock.storageProducts;
            outStockCount.innerText = stock.outStockProducts;
        };

        /**
         *Show store products .
         * @param {Object} products the  selected store.
         *
         * @public
         */
        this.showProducts = function(products) {
            let body = [];
            while (productsInfo.rows[0]) {
                productsInfo.deleteRow(0);
            }
            products.forEach(el => {
                let rating = [];
                for (let i = 0; i < 5; i++) {
                    if (el.Rating > 0) {
                        rating.push('<i class="far fa-star yellow-icons"></i>');
                    } else {
                        rating.push('<i class="far fa-star"></i>');
                    }
                    el.Rating--;
                }
                body.push(`
    <tr data-id="${el.id}">
        <td class="product-name">${el.Name} </td>
        <th class= "product-price">${el.Price}</th>
        <td class= "currency">USD</td>
        <td class= "specs" title="${el.Specs}">${el.Specs}</td>
        <td class= "supplier-info" title="${el.SupplierInfo}">${el.SupplierInfo}
        </td>
        <td class= "country" >${el.MadeIn}</td>
        <td class= "name" >${el.ProductionCompanyName}</td>
        <td class= "rating">${rating.join("")}</th>
        <td class= "edit-delete">>
            <i class="fas fa-edit" data-name="edit" data-id="${el.id}"></i>
            <i class="far fa-times-circle" data-name="delete" data-id="${
                el.id
            }"></i>
        </td>
    </tr>`);
            });
            productsInfo.innerHTML = body.join("");
        };

        /**
         * Show the info about selected store.
         *
         * @param {Object} store the  selected store.
         *
         * @public
         */
        this.showStoreInfo = function(store) {
            const Email = document.querySelector("#email");
            const Phone = document.querySelector("#phone");
            const Address = document.querySelector("#address");
            const Established = document.querySelector("#establishmentDate");
            const FloorArea = document.querySelector("#floorAreaInfo");
            let newDate = new Date(store.Established);
            let options = { month: "short", day: "numeric", year: "numeric" };
            Email.innerText = store.Email;
            Phone.innerText = store.PhoneNumber.replace(/\./gi, "-").substr(
                0,
                11
            );
            Address.innerText = store.Address;
            Established.innerText = new Intl.DateTimeFormat(
                "en-En",
                options
            ).format(newDate);
            FloorArea.innerText = store.FloorArea;
        };

        /**
         * Change the info about selected store.
         *
         * @param {Object} e event event when clicking on element.
         *
         *
         * @public
         */
        this.setStateButtons = function(e) {
            if (e.target.className === "checked") {
                e.target.classList.remove("checked");
            } else {
                e.target.classList.add("checked");
            }
        };

        /**
         * Returns the  store search  DOM element  .
         *
         * @returns {HTMLButtonElement} the input element.
         *
         * @public
         */
        this.getSearchStoresField = function() {
            return document.querySelector("#" + STORES_SEARCH_FIELD);
        };

        /**
         * Returns the  store list  DOM element  .
         *
         * @returns {HTMLButtonElement} the div element.
         *
         * @public
         */
        this.getStoresList = function() {
            return document.querySelector("#" + STORES_LIST);
        };

        /**
         *Set style attribute the  DOM element .
         * @param {string} id id  the  DOM element.
         * @param {string} property  property the style attribute.
         *
         * @public
         */
        this.setStylePropertyElem = function name(id, property) {
            let elem = this.getElem(id);
            elem.style.display = property;
        };

        /**
         * Helper for creating the  DOM element .
         * @param {string} teg the name of the  DOM element.
         * @param {string} className the  class name of the style attribute.
         *
         * @return {View} the div DOM element.
         *
         * @private
         */
        this.createElem = function(teg, className) {
            let elem = document.createElement(teg);
            elem.setAttribute("class", className);

            return elem;
        };

        /**
         * Helper for creating the  DOM element .
         * @param {View} elem the div DOM element.
         *
         * @return {View} the div DOM element.
         *
         * @private
         */
        this.createStoreItem = function(elem) {
            let storeItem = this.createElem("div", "store");
            let leftColumn = this.createElem("ul", "left");
            let name = this.createElem("li", "name bold");
            let address = this.createElem("li", "address");
            let rightColumn = this.createElem("ul", "right");
            let floorArea = this.createElem("li", "floor-area bold");
            let square = this.createElem("span", "square");

            name.textContent = elem.Name;
            address.textContent = elem.Address;
            floorArea.textContent = elem.FloorArea;
            storeItem.dataset.id = elem.id;
            square.textContent = "sq.m";

            leftColumn.append(name, address);
            rightColumn.append(floorArea, square);
            storeItem.append(leftColumn, rightColumn);

            return storeItem;
        };

        /**
         * Change  filterStatus and toggle buttons.
         *
         * @param {Event} e the DOM event object.
         *
         * @return {Number} the status DOM element.
         * @public
         */
        this.onToggleFilter = function(e) {
            let targetFilter = e.target.closest("li");
            let targetFilterStatus = targetFilter.dataset.filter;
            let items = this.getElem("#statusBar").querySelectorAll("li");
            items.forEach(item => {
                item.firstChild.classList.remove("filter-check");
            });
            targetFilter.firstChild.classList.add("filter-check");
            e.preventDefault();
            return targetFilterStatus;
        };

        /**
         * Set value edit product form.
         *
         * @param {object} form the DOM edit form object.
         * @param {object} product the  edited form object.
         *
         * @public
         */
        this.setProductFormValue = function(form, product) {
            form.Name.value = product.Name;
            form.Price.value = product.Price;
            form.Specs.value = product.Specs;
            form.Rating.value = product.Rating;
            form.SupplierInfo.value = product.SupplierInfo;
            form.Country.value = product.MadeIn;
            form.Company.value = product.ProductionCompanyName;
            form.Status.options[form.Status.selectedIndex].innerText =
                product.Status;
        };

        /**
         * Clear DOM element.
         *
         * @param {object} elem the DOM element object.
         * @public
         */
        this.clearDomElem = function(elem) {
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        };
    }
}
