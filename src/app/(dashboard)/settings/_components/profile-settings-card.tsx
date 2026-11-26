"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { FormInput } from "@/components/common/form-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { useMe, useUpdateMe, useUploadProfileImage } from "@/services";
import type { AuthUser } from "@/types";
import { profileSchema } from "@/validations";

function ProfileSettingsForm({ user }: { user?: AuthUser }) {
  const { mutate: updateProfile, isPending } = useUpdateMe();
  const { mutate: uploadAvatar, isPending: isUploading } =
    useUploadProfileImage();

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
    validators: {
      onChange: profileSchema,
    },
    onSubmit: ({ value }) => {
      updateProfile(
        {
          name: value.name.trim(),
          phone: value.phone.trim(),
        },
        {
          onSuccess: () => {
            toast.success("Profile updated");
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to update profile"));
          },
        },
      );
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <ImageUpload
        key={user?.imageUrl ?? "no-avatar"}
        id="admin-profile-image"
        label="Profile Photo"
        description={
          isUploading
            ? "Uploading profile photo..."
            : "PNG, JPG or WebP (/users/profile-image)"
        }
        initialUrls={user?.imageUrl ? [user.imageUrl] : []}
        disabled={isUploading}
        onFilesChange={(files) => {
          const file = files[0];
          if (!file) return;
          uploadAvatar(file, {
            onSuccess: () => {
              toast.success("Profile photo updated");
            },
            onError: (err) => {
              toast.error(getErrorMessage(err, "Failed to upload photo"));
            },
          });
        }}
      />

      <FormInput
        form={form}
        name="name"
        label="Full Name"
        placeholder="Super Admin"
        disabled={isPending}
      />

      <FormInput
        form={form}
        name="email"
        label="Email Address"
        type="email"
        disabled
        description="Admin email cannot be changed here."
      />

      <FormInput
        form={form}
        name="phone"
        label="Phone Number"
        placeholder="01700000001"
        disabled={isPending}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isPending} loadingText="Updating...">
          Update Profile
        </Button>
      </div>
    </form>
  );
}

export function ProfileSettingsCard() {
  const { data: meRes, isLoading } = useMe();
  const user = meRes?.data?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>
          Update your display name, contact number, and profile photo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        ) : (
          <ProfileSettingsForm key={user?.id ?? "guest"} user={user} />
        )}
      </CardContent>
    </Card>
  );
}
