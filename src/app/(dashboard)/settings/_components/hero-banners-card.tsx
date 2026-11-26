"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
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
import {
  useSettings,
  useUpdateSettings,
  useUploadHeroBannerImage,
} from "@/services";
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

function HeroBannersForm({
  initialSlides,
}: {
  initialSlides: HeroBannerSlide[];
}) {
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();
  const { mutate: uploadBannerImage, isPending: isUploading } =
    useUploadHeroBannerImage();

  const [slides, setSlides] = useState<HeroBannerSlide[]>(() => initialSlides);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSubmitting || isUpdating || isUploading;

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
    const target = slides[index];
    if (target) {
      setPendingFiles((prev) => {
        if (!(target.id in prev)) return prev;
        const next = { ...prev };
        delete next[target.id];
        return next;
      });
    }
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSlideFilesChange = (slideId: string, files: File[]) => {
    const file = files[0];
    setPendingFiles((prev) => {
      if (!file) {
        if (!(slideId in prev)) return prev;
        const next = { ...prev };
        delete next[slideId];
        return next;
      }
      return { ...prev, [slideId]: file };
    });
  };

  const handleSave = () => {
    const invalid = slides.find(
      (slide) => !slide.imageUrl.trim() && !pendingFiles[slide.id],
    );
    if (invalid) {
      toast.error("Every slide must have a banner image");
      return;
    }

    setIsSubmitting(true);
    const nextSlides = slides.map((slide) => ({ ...slide }));

    const saveUpdatedSlides = () => {
      updateSettings(
        { heroBanners: nextSlides },
        {
          onSuccess: () => {
            setPendingFiles({});
            setIsSubmitting(false);
            toast.success("Promotional hero banners updated");
          },
          onError: (err) => {
            setIsSubmitting(false);
            toast.error(getErrorMessage(err, "Failed to update hero banners"));
          },
        },
      );
    };

    const uploadSlideAt = (index: number) => {
      if (index >= nextSlides.length) {
        saveUpdatedSlides();
        return;
      }

      const file = pendingFiles[nextSlides[index].id];
      if (!file) {
        uploadSlideAt(index + 1);
        return;
      }

      uploadBannerImage(file, {
        onSuccess: (res) => {
          nextSlides[index] = {
            ...nextSlides[index],
            imageUrl: res.data.imageUrl,
            imagePublicId: res.data.imagePublicId,
          };
          uploadSlideAt(index + 1);
        },
        onError: (err) => {
          setIsSubmitting(false);
          toast.error(
            getErrorMessage(
              err,
              `Failed to upload image for Slide #${index + 1}`,
            ),
          );
        },
      });
    };

    uploadSlideAt(0);
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
          disabled={isBusy || slides.length >= 10}
        >
          <Plus className="size-4" />
          Add Slide
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {slides.length === 0 ? (
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
                        disabled={isBusy}
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
                      disabled={isBusy || index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Move slide down"
                      disabled={isBusy || index === slides.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      aria-label="Delete slide"
                      disabled={isBusy}
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <ImageUpload
                  key={slide.id}
                  id={`slide-image-${slide.id}`}
                  label="Banner Image *"
                  description="Recommended: 1200 × 960 px (5:4) or 1200 × 900 px (4:3) • PNG, JPG or WebP"
                  initialUrls={slide.imageUrl ? [slide.imageUrl] : []}
                  disabled={isBusy}
                  onFilesChange={(files) =>
                    handleSlideFilesChange(slide.id, files)
                  }
                  onRemoveInitialUrl={() =>
                    handleUpdateSlide(index, {
                      imageUrl: "",
                      imagePublicId: undefined,
                    })
                  }
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`slide-link-${slide.id}`}>
                      Target Link (Optional)
                    </Label>
                    <Input
                      id={`slide-link-${slide.id}`}
                      placeholder="/products?category=gur-honey"
                      disabled={isBusy}
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
                      disabled={isBusy}
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
                      disabled={isBusy}
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
            loading={isBusy}
            loadingText="Saving..."
            onClick={handleSave}
          >
            Save Hero Banners
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function HeroBannersCard() {
  const { data: settingsRes, isLoading } = useSettings();
  const settings = settingsRes?.data;

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Hero Promotional Banners</CardTitle>
            <CardDescription>
              Manage the storefront hero carousel slides (up to 10 slides).
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="default" disabled>
            <Plus className="size-4" />
            Add Slide
          </Button>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <HeroBannersForm
      key={settings?.updatedAt ?? "default"}
      initialSlides={settings?.heroBanners ?? []}
    />
  );
}
