import * as Yup from 'yup';

const email = Yup.string()
  .required('Email is required')
  .max(254, 'Too long')
  .email('Invalid email');

export const validationSchema = Yup.object({
  email,
});
