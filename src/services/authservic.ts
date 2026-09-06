/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "./api";

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (data: any) => {
  return api.post("/auth/local/register", {
    username: data.username,
    email: data.email,
    password: data.password,
  });
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (data: any) => {
  return api.post("/auth/local", {
    identifier: data.identifier,
    password: data.password,
  });
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (email: string) => {
  return api.post("/auth/forgot-password", {
    email,
  });
};

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (
  code: string,
  password: string,
  passwordConfirmation: string
) => {
  return api.post("/auth/reset-password", {
    code,
    password,
    passwordConfirmation,
  });
};