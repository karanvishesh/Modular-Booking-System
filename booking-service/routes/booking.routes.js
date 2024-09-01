import { Router } from 'express';
import {
  bookEntity,
  getAllBookableEntities,
  getAvailableEntities,
  cancelBooking,
  getBookingDetails,
  updateBooking
} from '../controllers/booking.controller.js';
import { verifyJWT, verifydbAccess } from '../middlewares/auth.middleware.js';
import { checkPredefinedEntities } from '../middlewares/checkPredefinedEntities.js';

const bookingRouter = Router();

bookingRouter.use(verifydbAccess);
bookingRouter.use(verifyJWT);
bookingRouter.use(checkPredefinedEntities);

bookingRouter.route('/book').post(bookEntity);    
bookingRouter.route('/entities').get(getAllBookableEntities)
bookingRouter.route('/entities/available').get(getAvailableEntities);
bookingRouter.route('/:id/cancel').post(cancelBooking); 
bookingRouter.route('/:id').get(getBookingDetails); 
bookingRouter.route('/:id').patch(updateBooking);
export default bookingRouter;
