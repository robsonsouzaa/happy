import Orfanato from '../models/Orfanato';
import imagem_view from './imagem_view';

export default {
  render(orfanato: Orfanato) {
    return {
      id: orfanato.id,
      nome: orfanato.nome,
      latitude: orfanato.latitude,
      longitude: orfanato.longitude,
      sobre: orfanato.sobre,
      instrucoes: orfanato.instrucoes,
      horario_funcionamento: orfanato.horario_funcionamento,
      aberto_fim_semana: orfanato.aberto_fim_semana,
      imagens: imagem_view.renderMany(orfanato.imagens),
    };
  },

  renderMany(orfanatos: Orfanato[]) {
    return orfanatos.map(orfanato => this.render(orfanato));
  }
}