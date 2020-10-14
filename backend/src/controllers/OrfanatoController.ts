import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orfanato from '../models/Orfanato';
import orfanato_view from '../views/orfanato_view';
import * as Yup from 'yup';

export default {
  async index(request: Request, response: Response) {
    const orfanatoRepository = getRepository(Orfanato);

    const orfanatos = await orfanatoRepository.find({
      relations: ['imagens']
    });

    return response.json(orfanato_view.renderMany(orfanatos));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const orfanatoRepository = getRepository(Orfanato);

    const orfanato = await orfanatoRepository.findOneOrFail(id, {
      relations: ['imagens']
    });

    return response.json(orfanato_view.render(orfanato));
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

    const data = {
      nome,
      latitude,
      longitude,
      sobre,
      instrucoes,
      horario_funcionamento,
      aberto_fim_semana,
      imagens
    };

    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      sobre: Yup.string().required().max(300),
      instrucoes: Yup.string().required(),
      horario_funcionamento: Yup.string().required(),
      aberto_fim_semana: Yup.boolean().required(),
      imagens: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        })
      )
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const orfanato = orfanatoRepository.create(data);
  
    await orfanatoRepository.save(orfanato);
  
    return response.status(201).json(orfanato);
  }
}