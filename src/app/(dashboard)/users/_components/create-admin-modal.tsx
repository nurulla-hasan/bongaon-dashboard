"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";

const createAdminSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Invalid email address." }),
  password: z.string().min(8, { error: "Password must be at least 8 characters." }),
  phone: z.string().trim(),
});

interface CreateAdminModalProps {
  actionTrigger?: ReactNode;
}

export function CreateAdminModal({ actionTrigger }: CreateAdminModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validators: {
      onSubmit: createAdminSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success(`Admin "${value.name}" created (UI preview)`);
      setOpen(false);
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
        />

        <FormInput
          form={form}
          name="email"
          label="Email Address"
          type="email"
          placeholder="admin@bongaonbajar.com"
        />

        <FormInput
          form={form}
          name="phone"
          label="Phone Number (Optional)"
          placeholder="01712345678"
        />

        <FormInput
          form={form}
          name="password"
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Create Admin</Button>
        </div>
      </form>
    </Modal>
  );
}
