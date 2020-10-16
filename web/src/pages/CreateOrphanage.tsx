import React, { FormEvent, useState, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import '../styles/pages/create-orphanage.css';



export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition ] = useState({ latitude: 0, longitude: 0 });

  const [nome, setNome] = useState('');
  const [sobre, setSobre] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [horario_funcionamento, setHorarioFuncionamento] = useState('');
  const [aberto_fim_semana, setAbertoFimSemana] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    const { latitude, longitude } =  position;

    const data = new FormData();

    data.append('nome', nome);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('sobre', sobre);
    data.append('instrucoes', instrucoes);
    data.append('horario_funcionamento', horario_funcionamento);
    data.append('aberto_fim_semana', String(aberto_fim_semana));
    
    images.forEach(image => {
      data.append('imagem', image);
    })

    await api.post('orfanatos', data);

    alert('Cadastro realizado com sucesso');

    history.push('/app');
  }

  return (
    <div id="page-create-orphanage">

      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-15.5935394,-56.1038611]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude !== 0 && (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[
                    position.latitude,
                    position.longitude
                  ]} 
                />
              )
                }
    
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={nome} 
                onChange={event => setNome(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="name" 
                maxLength={300} 
                value={sobre} 
                onChange={event => setSobre(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                { previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={nome}/>
                  )
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImage} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={instrucoes} 
                onChange={event => setInstrucoes(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
                id="opening_hours"
                value={horario_funcionamento} 
                onChange={event => setHorarioFuncionamento(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={aberto_fim_semana ? 'active' : '' }
                  onClick={() => setAbertoFimSemana(true)}
                  >
                    Sim
                  </button>
                <button 
                  type="button"
                  className={!aberto_fim_semana ? 'active' : '' }
                  onClick={() => setAbertoFimSemana(false)}
                  >
                    Não
                    </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
