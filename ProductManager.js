class ProductManager {
    constructor() {
        this.products = [];
        this.path = "";
    }

    setPath(path) {
        this.path = path;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: this.products.length + 1,
            path: this.path,
        };

        this.products.push(newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    updateProductById(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields
            };
            return true;
        }

        return false;
    }

    deleteProductById(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            return true;
        }

        return false;
    }
}

let pm = new ProductManager();
pm.setPath("/products");

pm.addProduct("BMW", "M330 / Año= 2020 / Color = Gris plata / Km = 42320km", "$12.000.000,00", "", "B002", "1");
pm.addProduct("Cadilac", "CT5 / Año= 2022 / Color = Negro / Km = 12045km", "$18.000.000,00", "", "C001", "2");
pm.addProduct("Dodge", "Charger / Año= 2014 / Color = Blanco / Km = 87320km", "$10.000.000,00", "", "D023", "3");
pm.addProduct("GMC", "Sierra / Año= 2023 / Color = Azul / Km = 23371km", "$24.000.000,00", "", "G005", "4");

console.log("Todos los productos:", pm.getProducts());

const productIdToFind = 4;

const foundProduct = pm.getProductById(productIdToFind);

if (foundProduct) {
    console.log("Producto encontrado por ID:", foundProduct);
    const updatedFields = {
        price: "$28.000.000,00",
        stock: "5"
    };
    
    if (pm.updateProductById(productIdToFind, updatedFields)) {
        console.log("Producto actualizado:", pm.getProductById(productIdToFind));
    } else {
        console.log("Producto no encontrado para actualizar:", productIdToFind);
    }

    if (pm.deleteProductById(productIdToFind)) {
        console.log("Producto eliminado con éxito.");
    } else {
        console.log("Producto no encontrado para eliminar:", productIdToFind);
    }

    console.log("Productos restantes:", pm.getProducts());
} else {
    console.log("Producto no encontrado por ID:", productIdToFind);
}
