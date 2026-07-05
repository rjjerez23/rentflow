const customerService = require('../services/customer.service');

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();

    res.status(200).json({
      success: true,
      message: 'Clientes obtenidos correctamente',
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Cliente obtenido correctamente',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);

    res.status(201).json({
      success: true,
      message: 'Cliente creado correctamente',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(Number(req.params.id), req.body);

    res.status(200).json({
      success: true,
      message: 'Cliente actualizado correctamente',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.deactivateCustomer(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Cliente desactivado correctamente',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
