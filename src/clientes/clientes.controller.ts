import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { Cliente } from './clientes.model';
import { ResponseHandler } from 'src/common/handlers/response.handler';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  async findAll() {
    const clientes = await this.clientesService.findAll();
    return ResponseHandler.success("Clientes encontrados com sucesso", {clientes});
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const cliente = await this.clientesService.findOne(id);
    return ResponseHandler.success("Cliente encontrado com sucesso", {cliente});
  }

  @Post()
  async create(@Body() dto: CreateClienteDto) {
    await this.clientesService.create(dto);
    return ResponseHandler.success("Cliente criado com sucesso");
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CreateClienteDto) {
    await this.clientesService.update(id, dto);
    return ResponseHandler.success("Cliente atualizado com sucesso");
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.clientesService.delete(id);
    return ResponseHandler.success("Cliente deletado com sucesso");
  }
}
