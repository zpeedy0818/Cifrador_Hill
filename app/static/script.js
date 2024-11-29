const API_BASE = '/api';

async function validateMatrix() {
    const matrixInput = document.getElementById('keyMatrix').value;
    const validationDiv = document.getElementById('matrixValidation');
    
    try {
        const response = await fetch(`${API_BASE}/validate-matrix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key_matrix: matrixInput })
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
    const plaintext = document.getElementById('plaintext').value;
    const keyMatrix = document.getElementById('keyMatrix').value;
    const resultDiv = document.getElementById('encryptionResult');
    
    if (!plaintext || !keyMatrix) {
        resultDiv.innerHTML = '<div class="matrix-validation invalid">Por favor, completa todos los campos</div>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/encrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plaintext: plaintext,
                key_matrix: keyMatrix
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
            document.getElementById('ciphertext').value = result.encrypted_text;
        } else {
            resultDiv.innerHTML = `<div class="matrix-validation invalid">Error: ${result.detail}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="matrix-validation invalid">Error: ${error.message}</div>`;
    }
}

async function decrypt() {
    const ciphertext = document.getElementById('ciphertext').value;
    const keyMatrix = document.getElementById('keyMatrix').value;
    const resultDiv = document.getElementById('decryptionResult');
    
    if (!ciphertext || !keyMatrix) {
        resultDiv.innerHTML = '<div class="matrix-validation invalid">Por favor, completa todos los campos</div>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ciphertext: ciphertext,
                key_matrix: keyMatrix
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
        '2x2_1': '3,3;2,5',
        '2x2_2': '6,24;1,13',
        '3x3_1': '17,17,5;21,18,21;2,2,19'
    };
    
    document.getElementById('keyMatrix').value = examples[type];
    validateMatrix();
}

document.addEventListener('DOMContentLoaded', function() {
    validateMatrix();
});
