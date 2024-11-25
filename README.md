# Cifrador Hill --- Proyecto Colaborativo

El **Cifrado de Hill** es un método poligráfico por bloques que utiliza
matrices y álgebra lineal para transformar texto plano en texto cifrado.
Fue creado por Lester S. Hill en 1929 y se basa en operaciones
modulares.\
Esta aplicación incluye una interfaz web moderna, validación en tiempo
real y una API REST.

## Funcionalidades

### 🔐 Cifrado y Descifrado

-   Encriptar mensajes
-   Desencriptar mensajes cifrados
-   Relleno automático con `X` para completar bloques

### Validación y Matemática

-   Validación de matrices clave
-   Cálculo de matrices inversas módulo 26
-   Matrices de ejemplo integradas

### Interfaz Web

-   Diseño responsivo
-   Gradientes y animaciones ligeras

### API REST

-   Endpoints para encriptar, desencriptar, validar matrices y obtener
    ejemplos

## Tecnologías Utilizadas

### Backend

-   FastAPI
-   Python 3.8+
-   NumPy
-   Uvicorn
-   Pydantic

### Frontend

-   HTML5
-   CSS3
-   JavaScript (Vanilla)
-   Jinja2

## Requisitos Previos

-   Python 3.8 o superior
-   pip
-   Navegador moderno

## Instalación

### 1. Clonar el repositorio

``` bash
git clone https://github.com/tu-usuario/cifrado-hill-colaborativo.git
cd cifrado-hill-colaborativo
```

### 2. Crear entorno virtual

#### Linux/Mac

``` bash
python3 -m venv venv
source venv/bin/activate
```

#### Windows

``` bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias

``` bash
pip install -r requirements.txt
```

### 4. Ejecutar la aplicación

``` bash
python -m app.main
```

### 5. Abrir en el navegador

    http://localhost:8000

## Uso

### Formato de Matrices

#### Matriz 2×2

    a,b;c,d
    Ejemplo: 3,3;2,5

#### Matriz 3×3

    a,b,c;d,e,f;g,h,i
    Ejemplo: 17,17,5;21,18,21;2,2,19

## Ejemplo Práctico

1.  Matriz: `3,3;2,5`
2.  Texto: `HELLO`
3.  Cifrado: `HGPPE`
4.  Descifrado: `HELLOX`

### Matrices de ejemplo

-   2×2 → `3,3;2,5`
-   2×2 → `6,24;1,13`
-   3×3 → `17,17,5;21,18,21;2,2,19`

## API Endpoints

### Encriptar texto

**POST** `/api/encrypt`

``` json
{
  "plaintext": "HELLO",
  "key_matrix": "3,3;2,5"
}
```

### Desencriptar texto

**POST** `/api/decrypt`

``` json
{
  "ciphertext": "HGPPE",
  "key_matrix": "3,3;2,5"
}
```

### Validar matriz

**POST** `/api/validate-matrix`

``` json
{
  "key_matrix": "3,3;2,5"
}
```

## Teoría del Cifrado de Hill

1.  Conversión de letras a números (A=0,...,Z=25)
2.  Agrupación del texto en bloques del tamaño de la matriz
3.  Multiplicación por la matriz clave
4.  Módulo 26
5.  Conversión de números a texto

### Requisitos de la matriz

-   Cuadrada
-   Determinante coprimo con 26
-   Existencia de inversa módulo 26

## Estructura del Proyecto

    cifrado-hill-colaborativo/
    ├── app/
    │   ├── main.py
    │   ├── models/
    │   │   └── hill_cipher.py
    │   ├── routers/
    │   │   └── cipher.py
    │   ├── static/
    │   │   ├── script.js
    │   │   └── style.css
    │   └── templates/
    │       └── index.html
    ├── requirements.txt
    ├── README.md
    └── .gitignore

## Equipo de Desarrollo (Grupo E)

-   Veruzka Katriana Guapacha
-   Oscar David Cadavid Ramirez
-   Juan Esteban Lozano
-   Ashly Alexandra Hernandez
-   Samuel Tabares

## Algoritmos Implementados

### Validación

``` python
def validate_key_matrix(matrix):
    det = determinante(matrix) % 26
    return gcd(det, 26) == 1
```

### Inversa modular

``` python
def matrix_mod_inverse(matrix):
    det = determinante(matrix) % 26
    det_inv = inverso_modular(det, 26)
    adj = matriz_adjunta(matrix)
    return (adj * det_inv) % 26
```

### Encriptación

``` python
def encrypt(plaintext, key_matrix):
    numeros = texto_a_numeros(plaintext)
    bloques = dividir_en_bloques(numeros, tamaño_matriz)
    cifrado = []
    for bloque in bloques:
        resultado = (key_matrix * bloque) % 26
        cifrado.append(resultado)
    return numeros_a_texto(cifrado)
```

## Solución de Problemas

### La matriz no es válida

-   Determinante no coprimo con 26

### Caracteres extraños al desencriptar

-   Son caracteres de relleno `X`

## Referencias

-   Wikipedia: Cifrado de Hill
-   FastAPI Docs
-   NumPy Docs
-   Criptografía y Álgebra Lineal
