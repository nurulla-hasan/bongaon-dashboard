"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { useSettings, useUpdateSettings } from "@/services";
import type { HeroBannerSlide } from "@/types";

function createEmptySlide(): HeroBannerSlide {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `slide-${Date.now()}`;

  return {
    id,
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "/products",
    isActive: true,
  };
}

export function HeroBannersCard() {
  const { data: settingsRes, isLoading } = useSettings();
  const settings = settingsRes?.data;
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const [slides, setSlides] = useState<HeroBannerSlide[]>([]);

  useEffect(() => {
    if (settings?.heroBanners) {
      setSlides(settings.heroBanners);
    }
  }, [settings]);

  const handleAddSlide = () => {
    if (slides.length >= 10) {
      toast.error("Maximum 10 promotional banners allowed");
      return;
    }
    setSlides((prev) => [...prev, createEmptySlide()]);
  };

  const handleUpdateSlide = (
    index: number,
    patch: Partial<HeroBannerSlide>,
  ) => {
    setSlides((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    setSlides((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const handleDelete = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const invalid = slides.find((slide) => !slide.imageUrl.trim());
    if (invalid) {
      toast.error("Every slide must have an Image URL");
      return;
    }

    updateSettings(
      { heroBanners: slides },
      {
        onSuccess: () => {
          toast.success("Promotional hero banners updated");
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Failed to update hero banners"));
        },
      },
    );
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Hero Promotional Banners</CardTitle>
          <CardDescription>
            Manage the storefront hero carousel slides (up to 10 slides).
          </CardDescription>
        </div>

        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handleAddSlide}
          disabled={isLoading || slides.length >= 10}
        >
          <Plus className="size-4" />
          Add Slide
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : slides.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
            <ImagePlus className="size-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">
              No promotional slides configured
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add slides to show a promotional slider on the storefront hero.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="space-y-4 rounded-xl border border-border bg-muted/20 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Slide #{index + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 pr-2">
                      <Label
                        htmlFor={`slide-active-${slide.id}`}
                        className="cursor-pointer text-xs"
                      >
                        Active
                      </Label>
                      <Switch
                        id={`slide-active-${slide.id}`}
                        checked={slide.isActive}
                        onCheckedChange={(checked) =>
                          handleUpdateSlide(index, { isActive: checked })
                        }
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Move slide up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Move slide down"
                      disabled={index === slides.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      aria-label="Delete slide"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`slide-image-${slide.id}`}>
                      Image URL *
                    </Label>
                    <Input
                      id={`slide-image-${slide.id}`}
                      placeholder="https://... or /images/hero-village-seamless.png"
                      value={slide.imageUrl}
                      onChange={(e) =>
                        handleUpdateSlide(index, { imageUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`slide-link-${slide.id}`}>
                      Target Link (Optional)
                    </Label>
                    <Input
                      id={`slide-link-${slide.id}`}
                      placeholder="/products?category=gur-honey"
                      value={slide.linkUrl}
                      onChange={(e) =>
                        handleUpdateSlide(index, { linkUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`slide-title-${slide.id}`}>
                      Title (Optional)
                    </Label>
                    <Input
                      id={`slide-title-${slide.id}`}
                      placeholder="Winter Patali Gur Offer"
                      value={slide.title}
                      onChange={(e) =>
                        handleUpdateSlide(index, { title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`slide-subtitle-${slide.id}`}>
                      Subtitle (Optional)
                    </Label>
                    <Input
                      id={`slide-subtitle-${slide.id}`}
                      placeholder="Fresh batch from Jashore"
                      value={slide.subtitle}
                      onChange={(e) =>
                        handleUpdateSlide(index, { subtitle: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            loading={isPending}
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Hero Banners
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
