Feature: Inicio de sesión

    Background: precondiciones
        Given que ingreso a la página de login

    @Regression @Smoke
    Scenario: Iniciar sesión con credenciales válidas
        When ingreso con el usuario válido
        Then debería ver la página principal

    @Regression @Smoke
    Scenario Outline: Iniciar sesión con credenciales inválidas
        When ingreso el correo "<usuario>" y la contraseña "<password>"
        Then debería visualizar el mensaje de error "<mensaje>"

        Examples:
            | usuario         | password     | mensaje                                                                   |
            | angelo          | santana      | Epic sadface: Username and password do not match any user in this service |
            | locked_out_user | secret_sauce | Epic sadface: Sorry, this user has been locked out.                       |