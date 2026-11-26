"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { useSettings, useUpdateSettings } from "@/services";
import type { StoreSetting } from "@/types";
import { storeSettingsSchema } from "@/validations";

function StoreSettingsForm({ settings }: { settings?: StoreSetting }) {
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const form = useForm({
    defaultValues: {
      storeName: settings?.storeName ?? "Bongaon Bazar",
      supportPhone: settings?.supportPhone ?? "",
      whatsappNumber: settings?.whatsappNumber ?? "",
      supportEmail: settings?.supportEmail ?? "",
      storeAddress: settings?.storeAddress ?? "",
      defaultDeliveryCharge: settings?.defaultDeliveryCharge ?? 120,
      freeDeliveryMinOrder: settings?.freeDeliveryMinOrder ?? 0,
      estimatedDeliveryDays: settings?.estimatedDeliveryDays ?? "4-7 Days",
      orderAlertEmail: settings?.orderAlertEmail ?? "",
      announcementEnabled: settings?.announcementEnabled ?? false,
      announcementText: settings?.announcementText ?? "",
      isOrderingEnabled: settings?.isOrderingEnabled ?? true,
    },
    validators: {
      onChange: storeSettingsSchema,
    },
    onSubmit: ({ value }) => {
      updateSettings(value, {
        onSuccess: () => {
          toast.success("Store settings saved");
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Failed to update store settings"));
        },
      });
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormInput
          form={form}
          name="storeName"
          label="Store Name"
          placeholder="Bongaon Bazar"
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="supportPhone"
          label="Support Phone"
          placeholder="01712345678"
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="whatsappNumber"
          label="WhatsApp Number"
          placeholder="+8801712345678"
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="supportEmail"
          label="Support Email"
          type="email"
          placeholder="support@bongaonbajar.com"
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="orderAlertEmail"
          label="Order Alert Email"
          type="email"
          placeholder="orders@bongaonbajar.com"
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="estimatedDeliveryDays"
          label="Estimated Delivery"
          placeholder="4-7 Days"
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="defaultDeliveryCharge"
          label="Default Delivery Charge (BDT)"
          type="number"
          min={0}
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="freeDeliveryMinOrder"
          label="Free Delivery Min Order (BDT)"
          type="number"
          min={0}
          description="Set 0 to disable free delivery threshold."
          disabled={isPending}
        />
        <FormInput
          form={form}
          name="storeAddress"
          label="Store Address"
          placeholder="Bongaon, Jashore, Bangladesh"
          disabled={isPending}
        />
      </div>

      <FormInput
        form={form}
        name="announcementText"
        label="Announcement Banner Text"
        placeholder="e.g. Free delivery on orders above ৳2,000!"
        disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
            </div>
          )}
        </form.Field>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isPending} loadingText="Saving...">
          Save Store Settings
        </Button>
      </div>
    </form>
  );
}

export function StoreSettingsCard() {
  const { data: settingsRes, isLoading } = useSettings();
  const settings = settingsRes?.data;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Store & Delivery Settings</CardTitle>
        <CardDescription>
          Configure COD delivery charges, free delivery threshold, contact
          details, and storefront banner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        ) : (
          <StoreSettingsForm
            key={settings?.updatedAt ?? "default"}
            settings={settings}
          />
        )}
      </CardContent>
    </Card>
  );
}
