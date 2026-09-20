import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductoInfoComponent } from "./components/ProductoInfoComponent";

export class CarritoPage extends BasePage{
    
    private readonly info: ProductoInfoComponent;
    private readonly qty: Locator;
    private readonly descripcionCarrito: Locator;
    private readonly checkoutButton: Locator;


    constructor(page: Page){
        super(page);
        this.info               = new ProductoInfoComponent(page);
        this.qty                = page.getByTestId("cart-quantity-label");
        this.descripcionCarrito = page.getByTestId("cart-desc-label");
        this.checkoutButton     = page.getByRole("button", {name: "Checkout"});

    }

    async verifyPage(): Promise<void> {
        await this.expectVisible(this.qty, 'qty de la pantalla del carrito');
        await this.expectVisible(this.descripcionCarrito, 'descripcion de la pantalla del carrito');
        await this.expectVisible(this.info.nombreProducto, 'nombre del producto el carrito');
        await this.expectVisible(this.info.descripcionProducto, 'descripcion del producto en el carrito');
        await this.expectVisible(this.info.precioProducto, 'precio del producto en el carrito');
        await this.expectVisible(this.info.removeProductoButton, 'buton remover el producto del carrito');
    }

    async hacerClickCheckout(): Promise<void>{
        this.checkoutButton.click();
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
        return this.info.removeProductoButton;
    }
}