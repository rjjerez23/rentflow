const express = require('express');
const customerRoutes = require('./customer.routes');
const healthRoutes = require('./health.routes');
const rentalRoutes = require('./rental.routes');
const reservationRoutes = require('./reservation.routes');
const returnRoutes = require('./return.routes');
const userRoutes = require('./user.routes');
const vehicleRoutes = require('./vehicle.routes');

const router = express.Router();

router.use('/customers', customerRoutes);
router.use('/health', healthRoutes);
router.use('/rentals', rentalRoutes);
router.use('/reservations', reservationRoutes);
router.use('/returns', returnRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);

module.exports = router;
