import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cliente } from './clientes.model';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { HttpError } from 'src/common/exceptions/http-error';

interface ValidateParams {
  id?: number;
  data?: CreateClienteDto;
  isCreate?: boolean;
  isUpdate?: boolean;
  isGet?: boolean;
  isDelete?: boolean;
}

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente)
    private clienteModel: typeof Cliente,
  ) { }

  async findAll() {
    return this.clienteModel.findAll();
  }

  async findOne(id: number) {
    const cliente = await this.validateData({ id, isGet: true });

    return cliente;
  }

  async create(data: CreateClienteDto) {
    await this.validateData({ data, isCreate: true });

    return this.clienteModel.create(data);
  }

  async update(id: number, data: CreateClienteDto) {
    const cliente = await this.validateData({ id, data, isUpdate: true });

    return cliente?.update(data);
  }

  async delete(id: number) {
    const cliente = await this.validateData({ id, isDelete: true });

    return cliente?.destroy();
  }

  private async validateData({ id, data, isCreate, isUpdate, isGet, isDelete }: ValidateParams) {
    try {
      if (isCreate) {
        if (!data?.nome || !data?.email) {
          throw new HttpError('Nome e email são obrigatórios para criação de cliente.', HttpStatus.BAD_REQUEST);
        }

        const emailExists = await this.clienteModel.findOne({ where: { email: data?.email } });
        if (emailExists) {
          throw new HttpError('Email já cadastrado para outro cliente.', HttpStatus.BAD_REQUEST);
        }

        const nomeExists = await this.clienteModel.findOne({ where: { nome: data?.nome } });
        if (nomeExists) {
          throw new HttpError('Nome já cadastrado para outro cliente.', HttpStatus.BAD_REQUEST);
        }
      }

      if (isUpdate) {
        if (!id) {
          throw new HttpError('ID do cliente é obrigatório para atualização.', HttpStatus.BAD_REQUEST);
        }
        if (!data?.nome && !data?.email) {
          throw new HttpError('Pelo menos um campo (nome ou email) deve ser fornecido para atualização de cliente.', HttpStatus.BAD_REQUEST);
        }

        const cliente = await this.clienteModel.findOne({ where: { id } });
        if (!cliente) {
          throw new HttpError('Cliente não encontrado para atualização.', HttpStatus.NOT_FOUND);
        }

        if (data?.email) {
          const emailExists = await this.clienteModel.findOne({ where: { email: data?.email, id: { $ne: id } } });
          if (emailExists) {
            throw new HttpError('Email já cadastrado para outro cliente.', HttpStatus.BAD_REQUEST);
          }
        }

        if (data?.nome) {
          const nomeExists = await this.clienteModel.findOne({ where: { nome: data?.nome, id: { $ne: id } } });
          if (nomeExists) {
            throw new HttpError('Nome já cadastrado para outro cliente.', HttpStatus.BAD_REQUEST);
          }
        }

        return cliente;
      }

      if (isGet || isDelete) {
        if (!id) {
          throw new HttpError('ID do cliente é obrigatório para consulta ou exclusão.', HttpStatus.BAD_REQUEST);
        }

        const cliente = await this.clienteModel.findOne({where: { id } });
        if (!cliente) {
          throw new HttpError('Cliente não encontrado.', HttpStatus.NOT_FOUND);
        }

        return cliente;
      }


    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError('Erro interno do servidor, contate o suporte.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
