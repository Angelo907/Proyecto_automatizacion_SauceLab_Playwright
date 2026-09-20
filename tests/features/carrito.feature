Feature: Carrito de compras

    Background: precondiciones
        Given que ingreso a la página de login
        Given ingreso con el usuario válido
        Given debería ver la página principal
        Given observo y verifico que estoy en el catalogo de productos
        Given ingreso al detalle del producto "Sauce Labs Backpack"

    @agregar_producto_detalle @Regression @Smoke
    Scenario Outline: Agregar producto al carrito
        Given debo observar el titulo de producto, descripcion, precio y boton de agregar
        When hago clic en el boton add to cart
        Then verifico que se muestre el carrito con la cantidad "<cantidad>" de productos añadidos
        And verifico que al dar clic en el icono de carrito me redirija a la pagina del carrito

        Examples:
            | cantidad |
            | 2        |