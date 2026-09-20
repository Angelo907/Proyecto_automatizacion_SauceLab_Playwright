import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductoInfoComponent } from "./components/ProductoInfoComponent";
import { Logger } from "../utilities/Logger";
import { Producto } from "../types/Producto";
import { parsePrice } from "../utilities/priceUtils";

export class ProductoPage extends BasePage{
    
    private readonly contenedorItem: Locator;
    private readonly info: ProductoInfoComponent;

    constructor(page: Page){
        super(page);
        this.contenedorItem     = page.getByTestId("inventory-item"); 
        this.info               = new ProductoInfoComponent(page);
    }

    async verifyPage(): Promise<void> {
        await this.expectVisible(this.contenedorItem.first(), 'catálogo de productos');
    }

     async ingresarDetalleProducto(producto: string): Promise<void>{
        const detalleProducto = this.contenedorItem.filter({ hasText: producto });
        try {
            await this.click(detalleProducto.getByTestId("item-4-img-link"), `producto: ${producto}`);
        } catch (error) {
            Logger.error(
            `No se pudo ingresar al detalle del producto "${producto}". ` +
            `Verifica que el nombre exista EXACTAMENTE así en el catálogo ` 
        );
        throw error;
        }
    }


    //Se obtienen los productos mostrados en el catalogo
    async obtenerProductosListados(): Promise<Producto[]> {
        Logger.info("Obteniendo el listado de productos mostrados en la pagina de catalogos")
        const items = await this.contenedorItem.all();
        const productos: Producto[] = [];

        for(const item of items){
            const nombre      = await item.getByTestId("inventory-item-name").innerText();
            const descripcion = await item.getByTestId("inventory-item-desc").innerText();
            const precioTexto = await item.getByTestId("inventory-item-price").innerText();

            productos.push({
                nombre,
                descripcion,
                precio: parsePrice(precioTexto)
            });
        }

        return productos;
    }

    async agregarProducto(nombreProducto: string): Promise<void>{
        const producto = this.contenedorItem.filter({ hasText: nombreProducto, has: this.info.agregarProductoButton });
        try {
            await this.click(producto.getByText("Add to cart"), `agregar producto: ${nombreProducto}`);
        } catch (error) {
            Logger.error(
            `No se pudo agregar producto "${nombreProducto}" al carrito. ` +
            `Verifica que el nombre exista EXACTAMENTE así en el catálogo ` 
        );
        throw error;
        }
    }

    obtenerBotonProducto(nombreProducto: string): Locator {
        const producto = this.contenedorItem.filter({ hasText: nombreProducto });
        return producto.getByRole('button', { name: /Add to cart|Remove/ });
    }
}