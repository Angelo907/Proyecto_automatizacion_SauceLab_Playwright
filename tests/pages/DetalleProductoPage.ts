import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductoInfoComponent } from "./components/ProductoInfoComponent";
import { Logger } from "../utilities/Logger";

export class DetalleProductoPage extends BasePage{
    private readonly info: ProductoInfoComponent;

    constructor(page: Page) {
        super(page);
        this.info = new ProductoInfoComponent(page);   
    }

    async verifyPage(): Promise<void> {
        await this.expectVisible(this.info.nombreProducto, 'nombre del producto en detalle');
    }

    getProducto(): Locator{
        return this.info.nombreProducto;
    }

    getDescripcionProducto(): Locator{
        return this.info.descripcionProducto;
    }

    getPrecioProducto(): Locator{
        return this.info.precioProducto;
    }

    getProductoButton(): Locator{
        return this.info.agregarProductoButton;
    }

    async agregarProductoCarrito(){
        try {
            await this.click(this.info.agregarProductoButton, "botón de agregar producto");
        } catch (error) {
            Logger.error("No se encontro el boton para agregar el producto al carrito");
            throw error;
        }
    }
}