import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header-unified';
import EventoInfo from '../../components/evento-info/EventoInfo';
import UsuariosInscritos from '../../components/usuarios-inscritos/UsuariosInscritos';
import Comentarios from '../../components/comentarios/Comentarios'; 
import './DetalhesEvento.css';

const DetalhesEvento = () => {
  const [evento, setEvento] = useState({
    titulo: 'Trilha da Cachoeira',
    data: '2025-10-15',
    endereco: 'Parque Nacional da Serra do Mar',
    horaInicio: '08:00',
    limiteInscritos: 15,
    descricao: 'Uma trilha desbravadora que desafia seus limites e revela paisagens incríveis.',
    imagem: '/src/assets/cachoeiralago.jpg'
  });

  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: 'Ana Clara' },
    { id: 2, nome: 'Roberto' },
    { id: 3, nome: 'Julia' },
    { id: 4, nome: 'João Pedro' },
    { id: 5, nome: 'Rebeca' }
  ]);

  const handleEventoChange = (campo, valor) => {
    setEvento(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSalvarEvento = () => {
    // Implementar lógica de salvamento
    console.log('Salvando evento:', evento);
  };

  const handleAprovarUsuario = (userId) => {
    // Implementar lógica de aprovação
    console.log('Aprovando usuário:', userId);
  };

  const handleNegarUsuario = (userId) => {
    // Implementar lógica de negação
    console.log('Negando usuário:', userId);
  };

  return (
    <div className="detalhes-evento-container">
      <Header />
      <div className="detalhes-evento-content">
        <EventoInfo
          evento={evento}
          onChange={handleEventoChange}
          onSalvar={handleSalvarEvento}
          editavel={true}
        />
        
        <UsuariosInscritos
          usuarios={usuarios}
          onAprovar={handleAprovarUsuario}
          onNegar={handleNegarUsuario}
        />
        
        <Comentarios 
          comentariosIniciais={[
            { nome: "Guilherme", texto: "Gostei muito dessa trilha me ajudou bastante a superar meu medo de altura" },
            { nome: "Rebeca", texto: "Fiquei com bastante medo no início mas no final deu para aproveitar muito" }
          ]}
          onEnviarComentario={async (comentario) => {
            // Implementar lógica de salvamento do comentário
            console.log('Enviando comentário:', comentario);
          }}
        />
      </div>
    </div>
  );
};

export default DetalhesEvento;