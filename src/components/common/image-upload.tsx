"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  id: string;
  label: string;
  description?: string;
  multiple?: boolean;
  maxFiles?: number;
  initialUrls?: string[];
  className?: string;
}

export function ImageUpload({
  id,
  label,
  description,
  multiple = false,
  maxFiles = 5,
  initialUrls = [],
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(initialUrls);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const nextUrls = files.map((file) => URL.createObjectURL(file));

    if (multiple) {
      setPreviews((prev) => [...prev, ...nextUrls].slice(0, maxFiles));
    } else {
      setPreviews(nextUrls.slice(0, 1));
    }

    event.target.value = "";
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const canAddMore = multiple ? previews.length < maxFiles : previews.length === 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {multiple && (
          <span className="text-xs text-muted-foreground">
            {previews.length}/{maxFiles} images
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="sr-only"
      />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative size-20 overflow-hidden rounded-xl border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${label} preview ${index + 1}`}
                className="size-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemove(index)}
                aria-label={`Remove ${label} ${index + 1}`}
                className="absolute top-1 right-1 size-6 rounded-full"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ImagePlus className="size-4" />
          </span>
          <span className="text-sm font-medium text-foreground">
            {multiple ? "Upload images" : "Upload image"}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </button>
      )}
    </div>
  );
}
