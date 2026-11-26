"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error";
import { useCreateAdmin } from "@/services";
import { createAdminSchema } from "@/validations";

interface CreateAdminModalProps {
  actionTrigger?: ReactNode;
}

export function CreateAdminModal({ actionTrigger }: CreateAdminModalProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createAdmin, isPending } = useCreateAdmin();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validators: {
      onChange: createAdminSchema,
    },
    onSubmit: ({ value }) => {
      createAdmin(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
          phone: value.phone.trim() || null,
        },
        {
          onSuccess: () => {
            toast.success(`Admin "${value.name.trim()}" created successfully`);
            setOpen(false);
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to create admin"));
          },
        },
      );
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: "",
      email: "",
      password: "",
      phone: "",
    });
  }, [open, form]);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      actionTrigger={
        actionTrigger ?? (
          <Button>
            <UserPlus className="size-4" />
            Add Admin
          </Button>
        )
      }
      title="Create Admin Account"
      description="Add a new administrator for Bongaon Bazar dashboard."
      size="default"
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FormInput
          form={form}
          name="name"
          label="Full Name"
          placeholder="e.g. Rahim Uddin"
          disabled={isPending}
        />

        <FormInput
          form={form}
          name="email"
          label="Email Address"
          type="email"
          placeholder="admin@bongaonbajar.com"
          disabled={isPending}
        />

        <FormInput
          form={form}
          name="phone"
          label="Phone Number (Optional)"
          placeholder="01712345678"
          disabled={isPending}
        />

        <FormInput
          form={form}
          name="password"
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          disabled={isPending}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isPending} loadingText="Creating...">
            Create Admin
          </Button>
        </div>
      </form>
    </Modal>
  );
}
