"""Gera um GIF curto por exercício a partir dos 3 desenhos do catálogo."""

from pathlib import Path

from PIL import Image, ImageFilter


def ancorar_base(imagem: Image.Image) -> Image.Image:
    caixa = imagem.getchannel("A").getbbox()
    if caixa is None:
        return imagem.copy()

    esquerda, topo, direita, base = caixa
    centro_x = (esquerda + direita) / 2
    deslocamento = (round(imagem.width / 2 - centro_x), round(imagem.height - 12 - base))
    resultado = Image.new("RGBA", imagem.size)
    resultado.alpha_composite(imagem, dest=deslocamento)
    return resultado


def aplicar_fundo(imagem: Image.Image) -> Image.Image:
    fundo = Image.new("RGBA", imagem.size, "#0f172a")
    fundo.alpha_composite(imagem)
    return fundo.convert("RGB")


def suavizar_traco(imagem: Image.Image, numero: int) -> Image.Image:
    if numero != 2:
        return imagem

    alpha = imagem.getchannel("A").filter(ImageFilter.MinFilter(3))
    resultado = imagem.copy()
    resultado.putalpha(alpha)
    return resultado


def gerar_gif(pasta: Path, nome: str, duracao: int) -> None:
    fontes = [
        aplicar_fundo(suavizar_traco(ancorar_base(Image.open(pasta / f"frame-{numero}.png").convert("RGBA")), numero))
        for numero in (1, 2, 3)
    ]
    frames = [fontes[0], fontes[1], fontes[2], fontes[1], fontes[0]]
    frames[0].save(
        pasta / nome,
        save_all=True,
        append_images=frames[1:],
        duration=duracao,
        loop=0,
        disposal=2,
        optimize=True,
    )


def main() -> None:
    raiz = Path(__file__).resolve().parents[1] / "front-end" / "public" / "exercises"
    pastas = sorted(pasta for pasta in raiz.iterdir() if pasta.is_dir())
    demonstracao = raiz.parent / "frame-2-suavizado.png"
    imagem_demo = suavizar_traco(
        ancorar_base(Image.open(pastas[0] / "frame-2.png").convert("RGBA")),
        2,
    )
    imagem_demo.save(demonstracao, optimize=True)
    for pasta in pastas:
        gerar_gif(pasta, "animation-slow.gif", 300)
        gerar_gif(pasta, "animation.gif", 240)
        gerar_gif(pasta, "animation-fast.gif", 120)
    print(f"{len(pastas)} exercícios convertidos para GIF.")


if __name__ == "__main__":
    main()
