Feature: Producto

    Background: precondiciones
        Given que ingreso a la página de login
        Given ingreso con el usuario válido
        Given debería ver la página principal

    @detalle_producto
    Scenario Outline: Ingresar detalle de producto
        Given observo y verifico que estoy en el catalogo de productos
        When ingreso al detalle del producto "<producto>"
        Then debo observar el titulo de producto, descripcion, precio y boton de agregar
        And debo poder regresar al catalogo al dar clic en back to products

        Examples:
            | producto            |
            | Sauce Labs Backpack |


    @Productos_listados
    Scenario: Validación de productos listados
        When observo y verifico que estoy en el catalogo de productos
        Then verifico que el catálogo muestre los productos correctos

    @Productos_listados_filtros
    Scenario Outline: Validación de listado de productos por filtro
        Given observo y verifico que estoy en el catalogo de productos
        When selecciono el filtro que deseo "<filtro>"
        Then debo visualizar los productos listados conforme al filtro aplicado

        Examples:
            | filtro              |
            | Name (A to Z)       |
            | Name (Z to A)       |
            | Price (low to high) |
            | Price (high to low) |

    @Producto_agregado
    Scenario: Validación de que si el producto ya se agrego al carrito se muestre el boton remove
        Given observo y verifico que estoy en el catalogo de productos
        When agrego productos al carrito desde el catalogo
            | Sauce Labs Backpack   |
            | Sauce Labs Bike Light |
        Then debo obversar que se refleje la cantidad "2" en el carrito
        And verifico que para un producto ya agregado se muestre el boton remove
            | Sauce Labs Backpack     |
            | Sauce Labs Bike Light   |
            | Sauce Labs Bolt T-Shirt |
