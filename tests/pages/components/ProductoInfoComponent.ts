// tests/pages/components/ProductoInfoComponent.ts
import { Locator, Page } from "@playwright/test";

export class ProductoInfoComponent {
    readonly nombreProducto: Locator;
    readonly descripcionProducto: Locator;
    readonly precioProducto: Locator;
    readonly agregarProductoButton: Locator;
    readonly removeProductoButton: Locator;

    constructor(page: Page) {
        this.nombreProducto        = page.getByTestId("inventory-item-name");
        this.descripcionProducto   = page.getByTestId("inventory-item-desc");
        this.precioProducto        = page.getByTestId("inventory-item-price");
        this.agregarProductoButton = page.getByRole("button", {name: "Add to cart"});
        this.removeProductoButton  = page.getByRole("button", {name: "Remove"});
    }
}