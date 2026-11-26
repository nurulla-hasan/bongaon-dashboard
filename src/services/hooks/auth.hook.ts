"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  resendResetOtp,
  resetPassword,
  updateMe,
  verifyResetOtp,
} from "../api/auth.api";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResendResetOtp() {
  return useMutation({
    mutationFn: resendResetOtp,
  });
}

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: verifyResetOtp,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
