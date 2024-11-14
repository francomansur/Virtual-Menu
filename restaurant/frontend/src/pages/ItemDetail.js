import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ItemDetails({ addItemToCart }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    // Busca o item específico pelo ID
    fetch(`http://localhost:5000/api/menu/${id}`)
      .then((response) => response.json())
      .then((data) => setItem(data))
      .catch((error) => console.error('Erro ao carregar o item:', error));
  }, [id]);

  const handleAddToCart = () => {
    addItemToCart({ ...item, observacao });
  };

  if (!item) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <p>Preço: R$ {item.price}</p>
      <textarea
        placeholder="Adicione observações..."
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
      />
      <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
    </div>
  );
}

export default ItemDetails;
