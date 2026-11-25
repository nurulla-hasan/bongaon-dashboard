"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { Eye, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContactStatus, MockContactMessage } from "@/data/mock-dashboard";
import { formatDate } from "@/lib/utils";

const CONTACT_STATUS_OPTIONS: { label: string; value: ContactStatus }[] = [
  { label: "New", value: "NEW" },
  { label: "Read", value: "READ" },
  { label: "Replied", value: "REPLIED" },
  { label: "Archived", value: "ARCHIVED" },
];

const replySchema = z.object({
  subject: z.string().trim().max(150),
  replyMessage: z
    .string()
    .trim()
    .min(2, { error: "Reply message must be at least 2 characters." })
    .max(3000, { error: "Reply message cannot exceed 3000 characters." }),
});

interface ContactDetailsModalProps {
  contact: MockContactMessage;
  actionTrigger?: ReactNode;
}

export function ContactDetailsModal({
  contact,
  actionTrigger,
}: ContactDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ContactStatus>(contact.status);

  const form = useForm({
    defaultValues: {
      subject: contact.subject ? `Re: ${contact.subject}` : "Re: Your Inquiry",
      replyMessage: contact.adminReply ?? "",
    },
    validators: {
      onSubmit: replySchema,
    },
    onSubmit: async () => {
      toast.success(`Reply sent to ${contact.email || contact.name} (UI preview)`);
      setOpen(false);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setStatus(contact.status);
      form.reset({
        subject: contact.subject ? `Re: ${contact.subject}` : "Re: Your Inquiry",
        replyMessage: contact.adminReply ?? "",
      });
    }
    setOpen(nextOpen);
  };

  const handleStatusUpdate = () => {
    toast.success(`Inquiry status updated to ${status} (UI preview)`);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      actionTrigger={
        actionTrigger ?? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`View inquiry from ${contact.name}`}
          >
            <Eye className="size-4" />
          </Button>
        )
      }
      title={contact.subject || "Customer Inquiry"}
      description={`From ${contact.name} • Received ${formatDate(contact.createdAt)}`}
      size="lg"
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">{contact.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="size-3.5" />
                {contact.phone}
              </span>
              {contact.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {contact.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Message
          </p>
          <p className="rounded-xl border border-border p-4 text-sm leading-6 text-foreground">
            {contact.message}
          </p>
        </div>

        <div className="space-y-2 rounded-xl border border-border p-4">
          <Label htmlFor={`contact-status-${contact.id}`}>Status</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={status}
              onValueChange={(value) => {
                if (value) setStatus(value as ContactStatus);
              }}
            >
              <SelectTrigger
                id={`contact-status-${contact.id}`}
                className="w-full cursor-pointer sm:flex-1"
              >
                <SelectValue>
                  {(val) =>
                    CONTACT_STATUS_OPTIONS.find((option) => option.value === val)
                      ?.label ?? String(val ?? "")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CONTACT_STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="button" variant="outline" onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </div>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 rounded-xl border border-border p-4"
        >
          <FormInput
            form={form}
            name="subject"
            label="Reply Subject"
            placeholder="Re: Your inquiry"
          />

          <FormInput
            form={form}
            name="replyMessage"
            label={
              contact.email
                ? `Email Reply to ${contact.email}`
                : "Admin Reply Note"
            }
            type="textarea"
            placeholder="Write your reply to the customer..."
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="submit" disabled={!contact.email}>
              <Send className="size-4" />
              Send Email Reply
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
