import numpy as np
from typing import List, Tuple
import re

class HillCipher:
    def __init__(self):
        self.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        self.mod = 26
    
    def text_to_numbers(self, text: str) -> List[int]:
        """Convierte texto a números (A=0, B=1, ..., Z=25)"""
        text = text.upper().replace(" ", "")
        numbers = []
        for char in text:
            if char in self.alphabet:
                numbers.append(self.alphabet.index(char))
        return numbers
    
    def numbers_to_text(self, numbers: List[int]) -> str:
        """Convierte números a texto"""
        text = ""
        for num in numbers:
            if 0 <= num < len(self.alphabet):
                text += self.alphabet[num]
        return text
    
    def validate_key_matrix(self, matrix: List[List[int]]) -> bool:
        """Valida que la matriz clave sea invertible módulo 26"""
        try:
            matrix_np = np.array(matrix)
            det = int(np.round(np.linalg.det(matrix_np)))
            det_mod = det % self.mod
            return self.gcd(det_mod, self.mod) == 1
        except:
            return False
    
    def gcd(self, a: int, b: int) -> int:
        """Calcula el máximo común divisor"""
        while b:
            a, b = b, a % b
        return a
    
    def mod_inverse(self, a: int, m: int) -> int:
        """Calcula el inverso modular de a módulo m"""
        for x in range(1, m):
            if (a * x) % m == 1:
                return x
        raise ValueError(f"No existe inverso modular para {a} módulo {m}")
    
    def matrix_mod_inverse(self, matrix: List[List[int]]) -> List[List[int]]:
        """Calcula la inversa de la matriz módulo 26"""
        matrix_np = np.array(matrix)
        det = int(np.round(np.linalg.det(matrix_np)))
        det_mod = det % self.mod
        
        if self.gcd(det_mod, self.mod) != 1:
            raise ValueError("La matriz no es invertible módulo 26")
        
        det_inv = self.mod_inverse(det_mod, self.mod)
        
        if len(matrix) == 2:
            adj = np.array([[matrix[1][1], -matrix[0][1]],
                           [-matrix[1][0], matrix[0][0]]])
        else:
            adj = np.linalg.inv(matrix_np) * det
            adj = np.round(adj).astype(int)
        
        inverse = (adj * det_inv) % self.mod
        return inverse.tolist()
    
    def encrypt(self, plaintext: str, key_matrix: List[List[int]]) -> str:
        """Encripta el texto usando el cifrado de Hill"""
        if not self.validate_key_matrix(key_matrix):
            raise ValueError("La matriz clave no es válida")
        
        numbers = self.text_to_numbers(plaintext)
        n = len(key_matrix)
        
        while len(numbers) % n != 0:
            numbers.append(23)
        
        encrypted_numbers = []
        matrix_np = np.array(key_matrix)
        
        for i in range(0, len(numbers), n):
            vector = np.array(numbers[i:i+n])
            encrypted_vector = np.dot(matrix_np, vector) % self.mod
            encrypted_numbers.extend(encrypted_vector.tolist())
        
        return self.numbers_to_text(encrypted_numbers)
    
    def decrypt(self, ciphertext: str, key_matrix: List[List[int]]) -> str:
        """Desencripta el texto usando el cifrado de Hill"""
        if not self.validate_key_matrix(key_matrix):
            raise ValueError("La matriz clave no es válida")
        
        inverse_matrix = self.matrix_mod_inverse(key_matrix)
        numbers = self.text_to_numbers(ciphertext)
        n = len(key_matrix)
        
        decrypted_numbers = []
        matrix_np = np.array(inverse_matrix)
        
        for i in range(0, len(numbers), n):
            vector = np.array(numbers[i:i+n])
            decrypted_vector = np.dot(matrix_np, vector) % self.mod
            decrypted_numbers.extend(decrypted_vector.tolist())
        
        return self.numbers_to_text(decrypted_numbers)
    
    def parse_matrix_input(self, matrix_str: str) -> List[List[int]]:
        """Convierte string de matriz a lista de listas de enteros"""
        try:
            rows = matrix_str.strip().split(';')
            matrix = []
            for row in rows:
                elements = [int(x.strip()) for x in row.split(',')]
                matrix.append(elements)
            return matrix
        except:
            raise ValueError("Formato de matriz inválido. Use: 'a,b;c,d' para 2x2")
