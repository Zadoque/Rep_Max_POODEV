export function emailEhValido(email: string): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return regexEmail.test(email)
}