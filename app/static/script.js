const API_BASE = '/api';

// Variable para almacenar el tamaño actual de la matriz
let currentMatrixSize = 2;

// Función para establecer el tamaño de la matriz
function setMatrixSize(size) {
    currentMatrixSize = size;
    
    // Actualizar botones activos
    document.getElementById('btn-2x2').classList.remove('active');
    document.getElementById('btn-3x3').classList.remove('active');
    document.getElementById('btn-4x4').classList.remove('active');
    
    if (size === 2) document.getElementById('btn-2x2').classList.add('active');
    if (size === 3) document.getElementById('btn-3x3').classList.add('active');
    if (size === 4) document.getElementById('btn-4x4').classList.add('active');
    
    generateMatrixInputs();
}

// Generar inputs de la matriz según el tamaño seleccionado
function generateMatrixInputs() {
    const size = currentMatrixSize;
    const matrixGrid = document.getElementById('matrixGrid');
    
    // Limpiar grid anterior
    matrixGrid.innerHTML = '';
    
    // Configurar grid CSS
    matrixGrid.style.gridTemplateColumns = `repeat(${size}, 75px)`;
    matrixGrid.style.gridTemplateRows = `repeat(${size}, 75px)`;
    
    // Crear inputs para cada celda
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `cell-${i}-${j}`;
            input.value = '0';
            input.min = '0';
            input.max = '25';
            input.step = '1';
            input.inputMode = 'numeric';
            input.pattern = '[0-9]*';
            input.placeholder = '0';
            
            // Auto-validar al cambiar
            input.addEventListener('input', function() {
                // prevenir valores no enteros mientras se escribe
                if (this.value === '' ) return;
                // eliminar decimales y mantener rango
                let v = parseInt(this.value);
                if (isNaN(v)) v = 0;
                if (v > 25) v = 25;
                if (v < 0) v = 0;
                this.value = v;
                validateMatrix();
            });

            // prevenir teclas no numéricas como 'e', '+', '-', '.'
            input.addEventListener('keydown', function(e) {
                if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
                    e.preventDefault();
                }
            });

            // al perder el foco, asegurar valor entero en rango
            input.addEventListener('blur', function() {
                let v = parseInt(this.value);
                if (isNaN(v)) v = 0;
                v = Math.max(0, Math.min(25, Math.floor(v)));
                this.value = v;
            });
            
            matrixGrid.appendChild(input);
        }
    }
    
    // Limpiar validación
    document.getElementById('matrixValidation').innerHTML = '';
}

// Obtener la matriz desde los inputs
function getMatrixFromInputs() {
    const size = currentMatrixSize;
    const matrix = [];
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const cellValue = document.getElementById(`cell-${i}-${j}`).value;
            row.push(parseInt(cellValue) || 0);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Validación local de la matriz antes de enviar al backend
function validateMatrixInputs() {
    const size = currentMatrixSize;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const el = document.getElementById(`cell-${i}-${j}`);
            if (!el) return { valid: false, message: 'Celdas de la matriz incompletas.' };
            const v = parseInt(el.value);
            if (isNaN(v) || v < 0 || v > 25) {
                return { valid: false, message: 'Todos los valores de la matriz deben ser enteros entre 0 y 25.' };
            }
        }
    }
    return { valid: true };
}

// Normalizar texto: quitar diacríticos, convertir a mayúsculas y permitir solo A-Z y espacio
function normalizeTextInput(s) {
    if (!s) return '';
    // remover acentos
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // mayúsculas
    s = s.toUpperCase();
    // permitir solo A-Z y espacios
    s = s.replace(/[^A-Z ]+/g, '');
    return s;
}

function validatePlaintextField() {
    const el = document.getElementById('plaintext');
    const raw = el.value || '';
    const normalized = normalizeTextInput(raw);
    if (raw !== normalized) {
        el.value = normalized;
        // mostrar aviso breve
        const resultDiv = document.getElementById('encryptionResult');
        resultDiv.innerHTML = `<div class="matrix-validation invalid">Se eliminaron caracteres inválidos del texto (se permiten solo letras A–Z y espacios).</div>`;
    } else {
        // limpiar mensajes previos
        const resultDiv = document.getElementById('encryptionResult');
        if (resultDiv.innerHTML && resultDiv.innerText.includes('Se eliminaron caracteres inválidos')) {
            resultDiv.innerHTML = '';
        }
    }
    if (normalized === '') return { valid: false, message: 'El texto no puede quedar vacío tras la normalización.' };
    return { valid: true };
}

function validateCiphertextField() {
    const el = document.getElementById('ciphertext');
    const raw = el.value || '';
    const normalized = normalizeTextInput(raw);
    if (raw !== normalized) {
        el.value = normalized;
        const resultDiv = document.getElementById('decryptionResult');
        resultDiv.innerHTML = `<div class="matrix-validation invalid">Se eliminaron caracteres inválidos del texto cifrado (solo letras A–Z y espacios).</div>`;
    } else {
        const resultDiv = document.getElementById('decryptionResult');
        if (resultDiv.innerHTML && resultDiv.innerText.includes('Se eliminaron caracteres inválidos')) {
            resultDiv.innerHTML = '';
        }
    }
    if (normalized === '') return { valid: false, message: 'El texto cifrado no puede quedar vacío tras la normalización.' };
    return { valid: true };
}

// Convertir matriz a formato string para la API
function matrixToString(matrix) {
    return matrix.map(row => row.join(',')).join(';');
}

// Cargar matriz desde array a los inputs
function loadMatrixToInputs(matrix) {
    const size = matrix.length;
    
    // Cambiar el tamaño
    setMatrixSize(size);
    
    // Llenar los valores
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            if (cell && matrix[i] && matrix[i][j] !== undefined) {
                cell.value = matrix[i][j];
            }
        }
    }
}

async function validateMatrix() {
    const matrix = getMatrixFromInputs();
    const matrixStr = matrixToString(matrix);
    const validationDiv = document.getElementById('matrixValidation');
    
    try {
        const response = await fetch(`${API_BASE}/validate-matrix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key_matrix: matrixStr })
        });
        
        const result = await response.json();
        
        if (result.is_valid) {
            validationDiv.innerHTML = `
                <div class="matrix-validation valid">
                    <strong>✓ Matriz válida</strong>
                    <br>Matriz inversa: ${JSON.stringify(result.inverse_matrix)}
                </div>
            `;
        } else {
            validationDiv.innerHTML = `
                <div class="matrix-validation invalid">
                    <strong>✗ Matriz inválida</strong>
                    <br>La matriz no es invertible módulo 26
                </div>
            `;
        }
    } catch (error) {
        validationDiv.innerHTML = `
            <div class="matrix-validation invalid">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

async function encrypt() {
    const resultDiv = document.getElementById('encryptionResult');

    // Validar y normalizar texto
    const txtValidation = validatePlaintextField();
    if (!txtValidation.valid) {
        resultDiv.innerHTML = `<div class="matrix-validation invalid">${txtValidation.message || 'Texto inválido.'}</div>`;
        return;
    }

    // Validar matriz localmente
    const matrixValidation = validateMatrixInputs();
    if (!matrixValidation.valid) {
        resultDiv.innerHTML = `<div class="matrix-validation invalid">${matrixValidation.message}</div>`;
        return;
    }

    const plaintext = document.getElementById('plaintext').value;
    const matrix = getMatrixFromInputs();
    const matrixStr = matrixToString(matrix);

    try {
        const response = await fetch(`${API_BASE}/encrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plaintext: plaintext,
                key_matrix: matrixStr
            })
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <div class="matrix-validation valid">
                    <strong>Texto encriptado:</strong> ${result.encrypted_text}
                    <br><strong>Matriz usada:</strong> ${JSON.stringify(result.key_matrix)}
                </div>
            `;
            // Actualizar el campo de texto cifrado
            document.getElementById('ciphertext').value = result.encrypted_text;
        } else {
            resultDiv.innerHTML = `<div class="matrix-validation invalid">Error: ${result.detail}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="matrix-validation invalid">Error: ${error.message}</div>`;
    }
}
 
async function decrypt() {
    const resultDiv = document.getElementById('decryptionResult');

    // Validar y normalizar texto cifrado
    const txtValidation = validateCiphertextField();
    if (!txtValidation.valid) {
        resultDiv.innerHTML = `<div class="matrix-validation invalid">${txtValidation.message || 'Texto inválido.'}</div>`;
        return;
    }

    // Validar matriz localmente
    const matrixValidation = validateMatrixInputs();
    if (!matrixValidation.valid) {
        resultDiv.innerHTML = `<div class="matrix-validation invalid">${matrixValidation.message}</div>`;
        return;
    }

    const ciphertext = document.getElementById('ciphertext').value;
    const matrix = getMatrixFromInputs();
    const matrixStr = matrixToString(matrix);

    try {
        const response = await fetch(`${API_BASE}/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ciphertext: ciphertext,
                key_matrix: matrixStr
            })
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <div class="matrix-validation valid">
                    <strong>Texto desencriptado:</strong> ${result.decrypted_text}
                    <br><strong>Matriz usada:</strong> ${JSON.stringify(result.key_matrix)}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="matrix-validation invalid">Error: ${result.detail}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="matrix-validation invalid">Error: ${error.message}</div>`;
    }
}

function loadExample(type) {
    const examples = {
        '2x2_1': [[3, 3], [2, 5]],
        '2x2_2': [[6, 24], [1, 13]],
        '3x3_1': [[17, 17, 5], [21, 18, 21], [2, 2, 19]]
    };
    
    loadMatrixToInputs(examples[type]);
    validateMatrix();
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Establecer tamaño inicial (2x2)
    setMatrixSize(2);
    // Cargar matriz ejemplo por defecto
    loadMatrixToInputs([[3, 3], [2, 5]]);
    validateMatrix();

    // Añadir sanitización en tiempo real a los campos de texto
    const pt = document.getElementById('plaintext');
    const ct = document.getElementById('ciphertext');
    if (pt) pt.addEventListener('input', validatePlaintextField);
    if (ct) ct.addEventListener('input', validateCiphertextField);
});