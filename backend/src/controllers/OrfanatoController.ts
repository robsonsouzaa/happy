import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orfanato from '../models/Orfanato';

export default {
  async index(request: Request, response: Response) {
    const orfanatoRepository = getRepository(Orfanato);

    const orfanatos = await orfanatoRepository.find({
      relations: ['imagens']
    });

    return response.json(orfanatos);
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const orfanatoRepository = getRepository(Orfanato);

    const orfanato = await orfanatoRepository.findOneOrFail(id, {
      relations: ['imagens']
    });

    return response.json(orfanato);
  },

  async create(request: Request, response: Response) {
    const {
      nome,
      latitude,
      longitude,
      sobre,
      instrucoes,
      horario_funcionamento,
      aberto_fim_semana
    } = request.body;
  
    const orfanatoRepository = getRepository(Orfanato);
  
    const listaImagens = request.files as Express.Multer.File[];
    const imagens = listaImagens.map(imagem => {
      return { path: imagem.filename }
    })

    const orfanato = orfanatoRepository.create({
      nome,
      latitude,
      longitude,
      sobre,
      instrucoes,
      horario_funcionamento,
      aberto_fim_semana,
      imagens
    });
  
    await orfanatoRepository.save(orfanato);
  
    return response.status(201).json(orfanato);
  }
}