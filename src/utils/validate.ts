import * as yup from "yup";

export const SignInSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Email invalidate'),
  password: yup
    .string()
    .required("Password is required"),
});