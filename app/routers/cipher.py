from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.hill_cipher import HillCipher

router = APIRouter()
cipher = HillCipher()

class EncryptionRequest(BaseModel):
    plaintext: str
    key_matrix: str

class DecryptionRequest(BaseModel):
    ciphertext: str
    key_matrix: str

class MatrixValidationRequest(BaseModel):
    key_matrix: str

@router.post("/encrypt")
async def encrypt_text(request: EncryptionRequest):
    try:
        key_matrix = cipher.parse_matrix_input(request.key_matrix)
        encrypted_text = cipher.encrypt(request.plaintext, key_matrix)
        return {
            "encrypted_text": encrypted_text,
            "key_matrix": key_matrix
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/decrypt")
async def decrypt_text(request: DecryptionRequest):
    try:
        key_matrix = cipher.parse_matrix_input(request.key_matrix)
        decrypted_text = cipher.decrypt(request.ciphertext, key_matrix)
        return {
            "decrypted_text": decrypted_text,
            "key_matrix": key_matrix
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/validate-matrix")
async def validate_matrix(request: MatrixValidationRequest):
    try:
        key_matrix = cipher.parse_matrix_input(request.key_matrix)
        is_valid = cipher.validate_key_matrix(key_matrix)
        inverse_matrix = None
        if is_valid:
            inverse_matrix = cipher.matrix_mod_inverse(key_matrix)
        return {
            "is_valid": is_valid,
            "inverse_matrix": inverse_matrix
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/example-matrices")
async def get_example_matrices():
    """Proporciona matrices de ejemplo válidas"""
    examples = {
        "2x2": [
            [[3, 3], [2, 5]],
            [[6, 24], [1, 13]],
            [[5, 8], [17, 3]]
        ],
        "3x3": [
            [[17, 17, 5], [21, 18, 21], [2, 2, 19]]
        ]
    }
    return examples
