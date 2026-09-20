import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Logger } from "../utilities/Logger";

export class HeaderPage extends BasePage{
    
    private readonly titulo: Locator;
    private readonly menuHamburguesa: Locator;
    private readonly carrito: Locator;
    private readonly cantidadProductos: Locator;
    private readonly retrocederButton: Locator;
    private readonly contenedorFiltros: Locator;


    constructor(page: Page){
        super(page);
        this.titulo    = page.getByTestId("title");
        this.menuHamburguesa   = page.getByRole("button", {name: "Open Menu"});
        this.carrito           = page.getByTestId("shopping-cart-link");
        this.cantidadProductos = page.getByTestId("shopping-cart-badge");
        this.retrocederButton  = page.getByTestId("back-to-products");
        this.contenedorFiltros = page.getByTestId("product-sort-container");
    }

    async verifyPage(): Promise<void> {
       await this.expectVisible(this.carrito, 'icono de carrito');
    }

    async conseguirTituloCarrito(): Promise<string>{
        return this.getText(this.titulo, "del titulo de la pantalla del carrito")
    }

    async regresarPantallaAnterior(): Promise<void>{
        await this.click(this.retrocederButton, "boton back to products");
    }

    async irCarritoCompras():Promise<void> {
        await this.click(this.carrito, "icono de carrito");
    }

    async obtenerCantidadProductosAgregados(): Promise<string>{
        return this.getText(this.cantidadProductos, "la cantidad de productos en el icono del carrito");
    }

    async seleccionarFiltro(filtro: string): Promise<void> {
        try {
            await this.selectOption(this.contenedorFiltros, filtro, "contenedor de filtros de productos")
        } catch (error) {
            Logger.error(`No existe el filtto: ${filtro}, verificar los filtros existentes`);
            throw error;
        }
    }

    getTitulo(): Locator{
        return this.titulo;
    }

    getCantidad(): Locator{
        return this.cantidadProductos;
    }

    async obtenerFiltroSeleccionado(): Promise<string> {
        return await this.contenedorFiltros.locator('option:checked').innerText();
    }

}