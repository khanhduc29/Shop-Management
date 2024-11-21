import * as Yup from "yup";

const email = Yup.string()
  .required("Email is required")
  .max(254, "Too long")
  .email("Invalid email");

const password = Yup.string()
  .required("Password is required")
  .matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\wｧ-ﾝﾞﾟ!"#$%&'()*+,–\-./:;<=>?@[\]^_`{|}]{8,32}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase and one number"
  );

export const schema = Yup.object({
  email,
  password,
});

export const initFormValue = {
  email: "",
  password: "",
};
