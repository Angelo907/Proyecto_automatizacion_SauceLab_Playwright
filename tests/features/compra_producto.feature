Feature: Realizar compra de producto

    Background: precondiciones
        Given que ingreso a la página de login
        Given ingreso con el usuario válido
        Given debería ver la página principal
        Given observo y verifico que estoy en el catalogo de productos
        Given ingreso al detalle del producto "Sauce Labs Backpack"
        Given debo observar el titulo de producto, descripcion, precio y boton de agregar
        Given hago clic en el boton add to cart
        Given verifico que se muestre el carrito con la cantidad "1" de productos añadidos
        Given verifico que al dar clic en el icono de carrito me redirija a la pagina del carrito


    @compra_producto
    Scenario Outline: Finalizar compra de producto exitosa
        Given hago clic en el boton de checkout
        When completo el formulario de checkout con mi nombre "<nombre>", apellido "<apellido>" y postal "<postal>"
        Then verifico que se muestre el resumen de mi compra
        And verifico que el precio total sea igual al precio del producto + impuestos
        And verfico que al finalizar la compra se muestre el mensaje de confirmacion de pedido "<mensaje>"
        And verifico que me rediriga al catalogo de productos al dar clic en el boton back home

        Examples:
            | nombre | apellido | postal | mensaje                   |
            | angelo | santana  | 001    | Thank you for your order! |
