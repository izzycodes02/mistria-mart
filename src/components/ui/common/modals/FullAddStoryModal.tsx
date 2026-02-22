"use client";

import confetti from "canvas-confetti";
import { LoaderCircle } from "lucide-react";
import { getUser } from "@/hooks/getUser";
import { getStories } from "@/hooks/getStories";
import ModalWrapper from "./ModalWrapper";
import { useEffect, useRef, useState } from "react";
import SelectInput from "@ui/smallUI/inputs/SelectInput";
import { Option } from "../../smallUI/inputs/MultiSelectInput";
import CounterInput from "../../smallUI/inputs/CounterInput";
import ComboxInput from "../../smallUI/inputs/ComboboxInput";
import DatePickerInput from "../../smallUI/inputs/DatePickerInput";
import MultiSelectInput from "../../smallUI/inputs/MultiSelectInput";
import TextInput from "@/components/ui/smallUI/inputs/TextInput";
import ImageInput from "@/components/ui/smallUI/inputs/ImageInput";

import { uploadImageToBucket } from "@/hooks/uploadImageToBucket";
import { supabase } from "@/utils/supabase/client";

type ModalProps = {
  onClose: () => void;
};

export default function FullStoryAddModal({ onClose }: ModalProps) {
  const [mode, setMode] = useState<"form" | "success">("form");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const { user } = getUser();

  const {
    fullAddStory,
    loading,
    error: storyError,
    clearError,
    titleExists,
  } = getStories(user);

  // form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("");
  const [storyLink, setStoryLink] = useState("");
  const [storyType, setStoryType] = useState("");
  const [readingStatus, setReadingStatus] = useState("Currently Reading");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);

  // errors
  const [titleError, setTitleError] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // focus the first CTA when success appears (accessibility polish)
  const successPrimaryRef = useRef<HTMLButtonElement | null>(null);

  // focus the first interactive element in the current step (accessibility)
  const stepContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (mode === "success") {
      successPrimaryRef.current?.focus();

      confetti({
        particleCount: 120,
        spread: 40,
        origin: { y: 0.5 },
        ticks: 150,
      });
    }
  }, [mode]);

  const readingStatusOptions = [
    "Currently Reading",
    "Completed",
    "On Hold",
    "Dropped",
    "Plan to Read",
  ];

  const platformOptions = [
    { id: 1, label: "AO3", value: "ao3" },
    { id: 2, label: "Mangadex", value: "mangadex" },
    { id: 3, label: "Webtoons", value: "webtoons" },
    { id: 4, label: "Wattpad", value: "wattpad" },
  ];

  const storyTypeOptions = [
    { id: 1, label: "Fanfiction", value: "fanfiction" },
    { id: 2, label: "Manhwa", value: "manhwa" },
    { id: 3, label: "Manga", value: "manga" },
    { id: 4, label: "Manhua", value: "manhua" },
    { id: 5, label: "Webcomic", value: "webcomic" },
    { id: 6, label: "Webnovel", value: "webnovel" },
  ];

  const tagsOptions = [
    { id: 1, label: "Fantasy", value: "fantasy" },
    { id: 2, label: "Shoujo", value: "shoujo" },
    { id: 3, label: "Enemies to Lovers", value: "enemies-to-lovers" },
    { id: 4, label: "Slow Burn", value: "slow-burn" },
    { id: 5, label: "Romance", value: "romance" },
    { id: 6, label: "Action", value: "action" },
    { id: 7, label: "Adventure", value: "adventure" },
    { id: 8, label: "Slice of Life", value: "slice-of-life" },
    { id: 9, label: "Mystery", value: "mystery" },
    { id: 10, label: "Thriller", value: "thriller" },
    { id: 11, label: "Horror", value: "horror" },
    { id: 12, label: "Sci-Fi", value: "sci-fi" },
    { id: 13, label: "Post-Apocalyptic", value: "post-apocalyptic" },
    { id: 14, label: "Comedy", value: "comedy" },
    { id: 15, label: "Drama", value: "drama" },
    { id: 16, label: "Supernatural", value: "supernatural" },
    { id: 17, label: "Coming of Age", value: "coming-of-age" },
    { id: 18, label: "Historical", value: "historical" },
    { id: 19, label: "Cyberpunk", value: "cyberpunk" },
    { id: 20, label: "Time Travel", value: "time-travel" },
    { id: 21, label: "Tragedy", value: "tragedy" },
    { id: 22, label: "Found Family", value: "found-family" },
    { id: 23, label: "Redemption Arc", value: "redemption-arc" },
    { id: 24, label: "Dark Fantasy", value: "dark-fantasy" },
  ];

  const isValidDate = (val: string) => {
    // If empty, it's valid (optional field)
    if (!val) return true;

    // Check if it's a complete date format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(val)) return false;

    // Further validation: ensure actual valid calendar date
    const [y, m, d] = val.split("-").map(Number);

    // Basic range validation
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;

    // More precise validation
    const dateObj = new Date(y, m - 1, d);
    return (
      dateObj.getFullYear() === y &&
      dateObj.getMonth() === m - 1 &&
      dateObj.getDate() === d
    );
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) {
      setTitleError(null);
    }
    if (submitError || storyError) {
      setSubmitError(null);
      clearError?.();
    }
  };

  const handleCoverImageChange = (file: File | null) => {
    setCoverImage(file);
    if (coverImageError) {
      setCoverImageError(null);
    }
  };

  const handleCoverImageError = (error: string | null) => {
    setCoverImageError(error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitError(null);
    setTitleError(null);
    clearError?.();

    if (!user) {
      setSubmitError("You need to be logged in to add a story.");
      return;
    }

    if (step === 1) {
      if (title.trim().length === 0) {
        setTitleError("At least give the story a name... ㅠㅠ");
        return;
      }

      if (coverImage) {
        const MAX_FILE_SIZE = 3 * 1024 * 1024;
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/jpg",
        ];

        if (coverImage.size > MAX_FILE_SIZE) {
          setCoverImageError("Image must be smaller than 3MB");
          return;
        }

        if (!validTypes.includes(coverImage.type)) {
          setCoverImageError("Please select a JPG, PNG, or WebP image");
          return;
        }
      }

      const alreadyExists = await titleExists(title.trim());
      if (alreadyExists) {
        setTitleError("This title already exists in your library!");
        return;
      }

      setTitleError(null);
      setCoverImageError(null);
      setStep(2);
      return;
    }

    if (step === 2) {
      if (date && !isValidDate(date)) {
        setDateError("Please enter a full valid date");
        return;
      } else {
        setDateError(null);
      }

      setStep(3);
      return;
    }

    if (step === 3) {
      // --- NEW: upload to Supabase Storage via uploadImageToBucket ---
      let coverImagePath: string | undefined;

      if (coverImage) {
        try {
          const { path } = await uploadImageToBucket(supabase, {
            file: coverImage,
            userId: user.id,
            type: "story_cover",
          });

          coverImagePath = path;
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to upload cover image.";
          setSubmitError(message);
          return;
        }
      }

      const startedDate = date && isValidDate(date) ? new Date(date) : null;

      let finalCurrentChapter = currentChapter;
      if (readingStatus === "Plan to Read") {
        finalCurrentChapter = null;
      }

      const { data, error } = await fullAddStory({
        title: title.trim(),
        status: readingStatus,
        current_chap: finalCurrentChapter,
        url: storyLink,
        started_date: startedDate,
        platform,
        type: storyType,
        tags: selectedTags.map((tag) => tag.value),
        cover_image: coverImagePath,
      });

      if (error || !data) {
        setSubmitError(error ?? "Something went wrong adding your story.");
        return;
      }

      setMode("success");
    }
  };

  // Prevent accidental form submission on "Enter"
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const focusedElement = document.activeElement as HTMLElement;

      // Allow "Enter" to work if focused on any button
      if (focusedElement.tagName === "BUTTON") {
        return;
      }

      // Otherwise, prevent default submission
      e.preventDefault();
    }
  };

  const renderStep1 = () => {
    return (
      <section
        ref={stepContainerRef}
        className="flex w-full flex-col items-center gap-4"
        aria-label="Step 1: Basic Story Details"
      >
        <ImageInput
          value={coverImage}
          label="Cover Image"
          onImageChange={handleCoverImageChange}
          onError={handleCoverImageError}
          error={coverImageError}
          key="cover-image-input"
        />

        {/* Story's Title */}
        <TextInput
          label="Title"
          value={title}
          required
          variant="col"
          placeholder="e.g. Vinland Saga"
          onChange={handleTitleChange}
          error={titleError}
        />

        {/* Reading Status */}
        <SelectInput
          label="Reading Status"
          variant="col"
          data={readingStatusOptions}
          defaultIndex={0}
          value={readingStatus}
          onChange={(value) => setReadingStatus(value)}
        />

        {/* Story's Chapter */}
        <div
          className={`w-full ${readingStatus === "Plan to Read" ? "pointer-events-none opacity-50" : ""}`}
        >
          <CounterInput
            label="Current Chapter"
            value={currentChapter || 1}
            min={0}
            max={9999}
            onChange={(val) => setCurrentChapter(val)}
          />
        </div>
      </section>
    );
  };

  const renderStep2 = () => {
    return (
      <section
        className="flex w-full flex-col items-center gap-4"
        aria-label="Step 2: Extra Story Details"
      >
        {/* Date Picker */}
        {readingStatus !== "Plan to Read" && (
          <DatePickerInput
            value={date}
            variant="col"
            autoFillToday
            error={dateError}
            onChange={setDate}
            label="Started Reading"
            helperText="Pick or type the date you began reading"
          />
        )}

        {/* Story link */}
        <TextInput
          label="Story Link"
          icon="IconLink"
          variant="col"
          placeholder="https://"
          value={storyLink}
          onChange={(e) => setStoryLink(e.target.value)}
        />

        {/* Story's platform */}
        <ComboxInput
          label="Platform"
          helperText="Select or add where you are reading the story!"
          data={platformOptions}
          variant="col"
          placeholder="Search platforms..."
          value={platform}
          onChange={(option) => setPlatform(option.value)}
        />
      </section>
    );
  };

  const renderStep3 = () => {
    return (
      <section
        className="flex w-full flex-col items-center gap-4"
        aria-label="Step 2: Extra Story Details"
      >
        {/* Story Type */}
        <ComboxInput
          label="Story Type"
          helperText="Select or add what kind of story this is!"
          data={storyTypeOptions}
          variant="col"
          placeholder="Search types..."
          value={storyType}
          onChange={(option) => setStoryType(option.value)}
        />

        {/* Story Tags */}
        <MultiSelectInput
          label="Tags"
          data={tagsOptions}
          icon="IconTag"
          hoverIcon="IconTagMinus"
          value={selectedTags}
          onChange={(selected) => setSelectedTags(selected)}
          beLowerCased
        />
      </section>
    );
  };

  const goBackToStep1 = () => setStep(1);
  const goBackToStep2 = () => setStep(2);

  const handleAddAnother = () => {
    setTitle("");
    setDate("");
    setPlatform("");
    setStoryLink("");
    setStoryType("");
    setReadingStatus("");
    setCoverImage(null);
    setSelectedTags([]);
    setCurrentChapter(1);
    setTitleError(null);
    setDateError(null);
    setSubmitError(null);
    clearError?.();
    setStep(1);
    setMode("form");
  };

  const renderEndOfForm = () => (
    <section className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-base" role="status" aria-live="polite">
        A new story added to your collection!
      </p>

      <img
        src="/gifs/clapping.gif"
        alt="Animated hands clapping to celebrate the new story being added"
        className="w-4/5 rounded-lg"
      />

      <div className="mt-2 flex w-full flex-col gap-3">
        <button
          type="button"
          ref={successPrimaryRef}
          className="modalBtn primary"
          aria-label="View Story Page"
          onClick={onClose /* or route to the new story */}
        >
          View Story
        </button>

        <button
          type="button"
          className="modalBtn secondary"
          aria-label="Add Another Story"
          onClick={handleAddAnother}
        >
          Add Another Story
        </button>
      </div>
    </section>
  );

  const renderStepButtons = () => {
    if (step === 1) {
      return (
        <button
          type="submit"
          className="modalBtn primary mt-6"
          aria-label={`Continue to step ${step + 1} of the Add Story form`}
        >
          Continue
        </button>
      );
    }

    if (step === 2) {
      return (
        <div className="flex h-fit w-full items-end gap-5">
          <button
            type="button"
            onClick={goBackToStep1}
            aria-label="Back to step 1 of the Add Story form"
            className="modalBtn secondary h-fit"
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit" // Change from "button" to "submit"
            className="modalBtn primary mt-6 h-fit"
            aria-label={`Continue to step ${step + 1} of the Add Story form`}
          >
            Continue
          </button>
        </div>
      );
    }

    return (
      <>
        {(submitError || storyError) && (
          <section
            id="formError"
            role="alert"
            aria-live="polite"
            className="validationBox"
          >
            <p>{submitError ?? storyError}</p>
          </section>
        )}
        <div className="mt-6 flex w-full gap-5">
          <button
            type="button"
            onClick={goBackToStep2}
            aria-label="Back to step 1 of the Add Story form"
            className="modalBtn secondary"
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className="modalBtn primary"
            aria-label="Add this story to your library"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoaderCircle
                  className="h-6 w-6 animate-spin"
                  aria-hidden="true"
                />
                <span className="sr-only">Adding...</span>
              </div>
            ) : (
              "Add Story"
            )}
          </button>
        </div>
      </>
    );
  };

  const heading = mode === "success" ? "Story Added!" : "Add A New Story";

  return (
    <>
      <ModalWrapper heading={heading} onClose={onClose}>
        {mode === "success" ? (
          renderEndOfForm()
        ) : (
          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
            {step === 1 && renderStep1()}

            {step === 2 && renderStep2()}

            {step === 3 && renderStep3()}

            {renderStepButtons()}
          </form>
        )}
      </ModalWrapper>
    </>
  );
}
