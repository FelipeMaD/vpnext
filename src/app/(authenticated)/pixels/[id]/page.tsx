"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react"; // Novo import para resolver `params`
import api from "../../../../utils/axios";

interface Pixel {
  id: number;
  titulo: string;
  descricao: string;
  upload: string;
  created_at: string;
}

export default function PixelDetail({ params }: { params: Promise<{ id: string }> }) {
  const [pixel, setPixel] = useState<Pixel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  const resolvedParams = use(params); // Resolve o `params` usando o hook `use`

  useEffect(() => {
    const pixelId = resolvedParams?.id;

    if (!pixelId) {
      console.error("ID não fornecido na URL.");
      router.push("/pixels");
      return;
    }

    const fetchPixel = async () => {
      try {
        const response = await api.get(`/pixels/${pixelId}/`);
        setPixel(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do pixel:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPixel();
  }, [resolvedParams, router]);

  if (loading) return <p>Carregando...</p>;

  if (error || !pixel)
    return <p>Erro: Pixel não encontrado ou houve um problema ao carregar os dados.</p>;

  return (
    <div>
      <h1>Detalhes do Pixel</h1>
      <h2>{pixel.titulo}</h2>
      <p>{pixel.descricao}</p>
      {pixel.upload && (
        <div>
          <a href={pixel.upload} download>
            Baixar Upload
          </a>
        </div>
      )}
      <small>Criado em: {new Date(pixel.created_at).toLocaleDateString()}</small>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => router.push(`/pixels/${resolvedParams.id}/edit`)}>Editar</button>
        <button
          onClick={async () => {
            if (confirm("Você tem certeza que deseja deletar este pixel?")) {
              try {
                await api.delete(`/pixels/${resolvedParams.id}/`);
                alert("Pixel deletado com sucesso!");
                router.push("/pixels");
              } catch (err) {
                console.error("Erro ao deletar o pixel:", err);
                alert("Erro ao deletar o pixel.");
              }
            }
          }}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
