const returnService = require('../services/return.service');

const getAllReturns = async (req, res, next) => {
  try {
    const returns = await returnService.getAllReturns();

    res.status(200).json({
      success: true,
      message: 'Devoluciones obtenidas correctamente',
      data: returns,
    });
  } catch (error) {
    next(error);
  }
};

const getReturnById = async (req, res, next) => {
  try {
    const returnRecord = await returnService.getReturnById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Devolución obtenida correctamente',
      data: returnRecord,
    });
  } catch (error) {
    next(error);
  }
};

const createReturn = async (req, res, next) => {
  try {
    const returnRecord = await returnService.createReturn(req.body);

    res.status(201).json({
      success: true,
      message: 'Devolución creada correctamente',
      data: returnRecord,
    });
  } catch (error) {
    next(error);
  }
};

const updateReturn = async (req, res, next) => {
  try {
    const returnRecord = await returnService.updateReturn(Number(req.params.id), req.body);

    res.status(200).json({
      success: true,
      message: 'Devolución actualizada correctamente',
      data: returnRecord,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReturn = async (req, res, next) => {
  try {
    await returnService.deleteReturn(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Devolución eliminada correctamente',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReturns,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn,
};
