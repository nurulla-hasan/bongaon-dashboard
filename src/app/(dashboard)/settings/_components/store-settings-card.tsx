"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(2, { error: "Store name must be at least 2 characters." })
    .max(120),
  supportPhone: z.string().trim().max(30),
  whatsappNumber: z.string().trim().max(30),
  supportEmail: z
    .string()
    .trim()
    .refine((val) => val === "" || z.email().safeParse(val).success, {
      error: "Invalid support email address.",
    }),
  storeAddress: z.string().trim().max(300),
  defaultDeliveryCharge: z.number().int().min(0).max(5000),
  freeDeliveryMinOrder: z.number().int().min(0).max(100000),
  estimatedDeliveryDays: z.string().trim().max(50),
  orderAlertEmail: z
    .string()
    .trim()
    .refine((val) => val === "" || z.email().safeParse(val).success, {
      error: "Invalid alert email address.",
    }),
  announcementEnabled: z.boolean(),
  announcementText: z.string().trim().max(300),
  isOrderingEnabled: z.boolean(),
});

export function StoreSettingsCard() {
  const form = useForm({
    defaultValues: {
      storeName: "Bongaon Bazar",
      supportPhone: "01712345678",
      whatsappNumber: "+8801712345678",
      supportEmail: "support@bongaonbajar.com",
      storeAddress: "Bongaon, Jashore, Bangladesh",
      defaultDeliveryCharge: 120,
      freeDeliveryMinOrder: 2000,
      estimatedDeliveryDays: "4-7 Days",
      orderAlertEmail: "orders@bongaonbajar.com",
      announcementEnabled: false,
      announcementText: "",
      isOrderingEnabled: true,
    },
    validators: {
      onSubmit: storeSettingsSchema,
    },
    onSubmit: async () => {
      toast.success("Store settings saved (UI preview)");
    },
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Store & Delivery Settings</CardTitle>
        <CardDescription>
          Configure COD delivery charges, free delivery threshold, contact details, and storefront banner.
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormInput
              form={form}
              name="storeName"
              label="Store Name"
              placeholder="Bongaon Bazar"
            />
            <FormInput
              form={form}
              name="supportPhone"
              label="Support Phone"
              placeholder="01712345678"
            />
            <FormInput
              form={form}
              name="whatsappNumber"
              label="WhatsApp Number"
              placeholder="+8801712345678"
            />
            <FormInput
              form={form}
              name="supportEmail"
              label="Support Email"
              type="email"
              placeholder="support@bongaonbajar.com"
            />
            <FormInput
              form={form}
              name="orderAlertEmail"
              label="Order Alert Email"
              type="email"
              placeholder="orders@bongaonbajar.com"
            />
            <FormInput
              form={form}
              name="estimatedDeliveryDays"
              label="Estimated Delivery"
              placeholder="4-7 Days"
            />
            <FormInput
              form={form}
              name="defaultDeliveryCharge"
              label="Default Delivery Charge (BDT)"
              type="number"
              min={0}
            />
            <FormInput
              form={form}
              name="freeDeliveryMinOrder"
              label="Free Delivery Min Order (BDT)"
              type="number"
              min={0}
              description="Set 0 to disable free delivery threshold."
            />
            <FormInput
              form={form}
              name="storeAddress"
              label="Store Address"
              placeholder="Bongaon, Jashore, Bangladesh"
            />
          </div>

          <FormInput
            form={form}
            name="announcementText"
            label="Announcement Banner Text"
            placeholder="e.g. Free delivery on orders above ৳2,000!"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <form.Field name="announcementEnabled">
              {(field) => (
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                  <div className="space-y-1">
                    <Label htmlFor={field.name} className="cursor-pointer">
                      Show Announcement Banner
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display notice bar at the top of the storefront.
                    </p>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="isOrderingEnabled">
              {(field) => (
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                  <div className="space-y-1">
                    <Label htmlFor={field.name} className="cursor-pointer">
                      Accepting COD Orders
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Pause checkout temporarily when disabled.
                    </p>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">Save Store Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
