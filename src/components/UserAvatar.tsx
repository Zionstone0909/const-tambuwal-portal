import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { readImageAsDataUrl, useUserPhoto } from "@/lib/user-photo";
import { cn } from "@/lib/utils";

type Props = {
  /** Stable identifier for whose photo this is (e.g. matric or staffId). */
  userKey: string;
  /** Initials shown when no photo is uploaded. */
  initials: string;
  /** Tailwind size classes for the avatar (defaults to h-12 w-12). */
  sizeClassName?: string;
  /** Tailwind text size for the initials. */
  textClassName?: string;
  /** Tailwind background classes for the initials fallback. */
  fallbackClassName?: string;
  /** Show the small camera button overlay to change the photo. */
  editable?: boolean;
  className?: string;
};

export function UserAvatar({
  userKey,
  initials,
  sizeClassName = "h-12 w-12",
  textClassName = "text-lg",
  fallbackClassName = "bg-gold text-primary",
  editable = false,
  className,
}: Props) {
  const { photo, setPhoto } = useUserPhoto(userKey);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be smaller than 4 MB.");
      return;
    }
    try {
      const dataUrl = await readImageAsDataUrl(file);
      setPhoto(dataUrl);
      setError(null);
    } catch {
      setError("Could not read that image. Try another file.");
    }
  };

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-display font-extrabold",
          sizeClassName,
          textClassName,
          photo ? "bg-muted" : fallbackClassName,
        )}
      >
        {photo ? (
          <img
            src={photo}
            alt="Profile photo"
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {editable && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground border-2 border-card flex items-center justify-center shadow hover:brightness-110 transition"
            aria-label="Change profile photo"
            title="Change profile photo"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            className="hidden"
          />
          {error && (
            <p className="absolute top-full mt-1 left-0 text-[10px] text-destructive whitespace-nowrap">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
