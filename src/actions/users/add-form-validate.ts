"use server";

import {
  CreateUserFormErrors,
  CreateUserFormResponseType,
} from "@/types/types";
import { isCorrectFormat } from "@/utils/isCorrectFormat";
import { createUser } from "./create-user";

export const createUserFormValidator = async (
  _prevState: CreateUserFormResponseType,
  formData: FormData
): Promise<CreateUserFormResponseType> => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const cnfrmPassword = formData.get("cnfrmPassword") as string;

  const errors: CreateUserFormErrors = {};

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 5) {
    errors.name = "Name should contain atleast 5 characters";
  }
  if (!email) {
    errors.email = "Email is required!";
  } else if (!isCorrectFormat("email", email)) {
    errors.email = "Enter a valid email!";
  }

  if (!password) {
    errors.password = "Password is required!";
  } else if (!isCorrectFormat("password", password)) {
    errors.password = "Enter a stronger password";
  }

  if (!cnfrmPassword) {
    errors.cnfrmPassword = "Confirm password";
  } else if (cnfrmPassword !== password) {
    errors.cnfrmPassword = "Doest match with password";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false, errorMessage: null };
  }

  const errorMessage = await createUser(name, email, password);

  return { errors: {}, success: true, errorMessage: null };
};
