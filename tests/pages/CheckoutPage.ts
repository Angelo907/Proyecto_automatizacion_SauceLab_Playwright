import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Logger } from "../utilities/Logger";
import { ProductoInfoComponent } from "./components/ProductoInfoComponent";

export class CheckoutPage extends BasePage{
   
    private readonly nameInput: Locator;
    private readonly apellidoInput: Locator;
    private readonly codigoPostalInput: Locator;
    private readonly continuarButton: Locator;
    private readonly info: ProductoInfoComponent;
    private readonly informacionPago: Locator;
    private readonly informacionEntrega: Locator;
    private readonly listaPrecios: Locator;
    private readonly precioTotal: Locator;
    private readonly subtotalLabel: Locator;
    private readonly taxLabel: Locator;
    private readonly terminarButton: Locator;
    private readonly mensajeCompraFinalizada: Locator;
    private readonly irHomeButton: Locator;

    constructor(page: Page){
        super(page);
        this.nameInput            = page.getByRole("textbox", {name: "First Name"});
        this.apellidoInput        = page.getByRole("textbox", {name: "Last Name"});
        this.codigoPostalInput    = page.getByRole("textbox", {name: "Zip/Postal Code"});
        this.continuarButton      = page.getByRole("button", {name: "Continue"});
        this.info                 = new ProductoInfoComponent(page);
        this.informacionPago      = page.getByText("Payment Information:");
        this.informacionEntrega   = page.getByText("Shipping Information:");
        this.listaPrecios         = page.getByText("Price Total");
        this.precioTotal          = page.getByTestId("total-label");
        this.subtotalLabel        = page.getByTestId("subtotal-label");
        this.taxLabel             = page.getByTestId("tax-label");
        this.terminarButton       = page.getByRole("button", {name: "Finish"});   
        this.mensajeCompraFinalizada = page.getByRole("heading", {name: "Thank you for your order!"});  
        this.irHomeButton            = page.getByRole("button", {name: "Back Home"});
    }

     async verifyPage(): Promise<void> {
        await this.expectVisible(this.nameInput, 'input name del form de checkout');
        await this.expectVisible(this.apellidoInput, 'input apellido del form de checkout');
        await this.expectVisible(this.codigoPostalInput, 'input codigo postal del form de checkout');
        await this.expectVisible(this.continuarButton, 'boton de continuar del form de checkout');
    }

    async completarFormularioCheckout(nombre: string, apellido: string, codigoPostal: string): Promise<void>{
        await this.fill(this.nameInput, nombre, 'nombre en checkout');
        await this.fill(this.apellidoInput, apellido, 'apellido en checkout');
        await this.fill(this.codigoPostalInput, codigoPostal, 'código postal en checkout');
        await this.click(this.continuarButton, 'botón continuar en checkout');  
    }

    async clicTerminarCompra(): Promise<void>{
        this.click(this.terminarButton, "boton de finalizar compra");
    }

    async regresarHome(): Promise<void>{
        this.click(this.irHomeButton, "boton de ir al home")
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

    getInformacionPago(): Locator{
        return this.informacionPago;
    }

    getInformacionEntrega(): Locator{
        return this.informacionEntrega;
    }

    getListaPrecios(): Locator{
        return this.listaPrecios;
    }

    getPrecioTotal(): Locator{
        return this.precioTotal;
    }

    getSubtotal(): Locator {
    return this.subtotalLabel;
    }

    getImpuestos(): Locator {
        return this.taxLabel;
    }

    getMensajeConfirmacionPedido(): Locator{
        return this.mensajeCompraFinalizada;
    }
}