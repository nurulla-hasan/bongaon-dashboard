"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
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

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(100, { error: "Name cannot exceed 100 characters." }),
  email: z.email({ error: "Invalid email address." }),
  phone: z.string().trim().max(30),
});

export function ProfileSettingsCard() {
  const form = useForm({
    defaultValues: {
      name: "Super Admin",
      email: "admin@bongaonbajar.com",
      phone: "01700000001",
    },
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async () => {
      toast.success("Profile updated (UI preview)");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>
          Update your display name, contact number, and profile photo.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            id="admin-profile-image"
            label="Profile Photo"
            description="PNG, JPG or WebP (/users/profile-image)"
          />

          <FormInput
            form={form}
            name="name"
            label="Full Name"
            placeholder="Super Admin"
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
          />

          <div className="flex justify-end pt-2">
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
