import { createBdd, DataTable } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../utilities/fixtures';
import { Producto } from "../types/Producto";
import { Logger } from '../utilities/Logger';
import { productosEsperados } from '../data/productos.data';

const { Given, When, Then } = createBdd(test);

When(`ingreso al detalle del producto {string}`, async ( {productoPage}, nombreProducto: string) => {
    await productoPage.ingresarDetalleProducto(nombreProducto);
});

When(`agrego productos al carrito desde el catalogo`, async ( {productoPage}, dataTable: DataTable) => {
    const productos = dataTable.raw().map((fila) => fila[0]);

    for(const nombreProductos of productos){
      await productoPage.agregarProducto(nombreProductos);
    }
});

Then("verifico que me rediriga al catalogo de productos al dar clic en el boton back home", async ({page}) => {
  await expect(page).toHaveURL(/.*inventory.html.*/);
});

Then("verifico que el catálogo muestre los productos correctos", async ({productoPage}) => {
  //Se obtienen los productos mostrados en la pagina y los productos esperados que deberian mostrarse
  //Se ordenan por nombre de manera ascendente y se validan los productos reales vs esperados
  const productosReales = await productoPage.obtenerProductosListados();

  const ordenarNombreAsc = (a: Producto, b: Producto) => a.nombre.localeCompare(b.nombre);

  // const ordenar = productosReales.sort((producto1: Producto, producto2: Producto) => producto1.nombre > producto2.nombre ? 1 : -1);
  
  expect([...productosReales].sort(ordenarNombreAsc))
  .toEqual([...productosEsperados].sort(ordenarNombreAsc));

});

Then("debo visualizar los productos listados conforme al filtro aplicado", 
  async ({productoPage, headerPage}) => {
  
    const comparadores: Record<string, (a: Producto, b: Producto) => number> = {
      'Name (A to Z)':       (a, b) => a.nombre.localeCompare(b.nombre),
      'Name (Z to A)':       (a, b) => b.nombre.localeCompare(a.nombre),
      'Price (low to high)': (a, b) => a.precio - b.precio,
      'Price (high to low)': (a, b) => b.precio - a.precio,
    };

    const filtroAplicado = await headerPage.obtenerFiltroSeleccionado();
    const comparador     = comparadores[filtroAplicado];

    if (!comparador) {
      throw new Error(
        `Filtro no reconocido: "${filtroAplicado}". Verifica que coincida exactamente con las claves definidas en "comparadores".`
      );
    }

    const productosReales = await productoPage.obtenerProductosListados();
    const productosEnOrdenCorrecto = [...productosEsperados].sort(comparador);

    expect(productosReales).toEqual(productosEnOrdenCorrecto);
});

Then(`verifico que para un producto ya agregado se muestre el boton remove`, async ( {productoPage}, dataTable) => {
    const productos = dataTable.raw().map((fila: string[]) => fila[0]);
    for(const nombreProductos of productos){
      const boton = productoPage.obtenerBotonProducto(nombreProductos);
      const texto = await boton.innerText();

      if(texto === "Add to cart"){
        await productoPage.agregarProducto(nombreProductos);
      }else {
        await expect(boton).toHaveText("Remove");
      }
    }
});