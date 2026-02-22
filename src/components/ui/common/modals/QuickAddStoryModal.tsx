"use client";
import { useEffect, useRef, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import confetti from "canvas-confetti";
import TextInput from "../../smallUI/inputs/TextInput";
import SelectInput from "../../smallUI/inputs/SelectInput";
import CounterInput from "../../smallUI/inputs/CounterInput";
import { getUser } from "@/hooks/getUser";
import { getStories } from "@/hooks/getStories";
import { LoaderCircle } from "lucide-react";

type ModalProps = {
  onClose: () => void;
};

export default function QuickAddStoryModal({ onClose }: ModalProps) {
  const [mode, setMode] = useState<"form" | "success">("form");

  const { user } = getUser();

  const {
    quickAddStory,
    loading,
    error: storyError,
    clearError,
    titleExists,
  } = getStories(user);

  // options
  const readingStatusOptions = [
    "Currently Reading",
    "Completed",
    "On Hold",
    "Dropped",
    "Plan to Read",
  ];

  // form fields
  const [title, setTitle] = useState("");
  const [readingStatus, setReadingStatus] = useState(readingStatusOptions[0]);
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [storyLink, setStoryLink] = useState("");

  // errors
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const successPrimaryRef = useRef<HTMLButtonElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

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

  // Still unsure if we need this
  // useEffect(() => {
  //   if (mode === "form" && formRef.current) {
  //     const firstFocusable = formRef.current.querySelector<HTMLElement>(
  //       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  //     );

  //     firstFocusable?.focus();
  //   }
  // }, [mode]);

  const handleFormFieldChange = () => {
    if (submitError || storyError) {
      setSubmitError(null);
      clearError?.();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) {
      setTitleError(null);
    }
  };

  const handleReadingStatusChange = (value: string) => {
    setReadingStatus(value);
    handleFormFieldChange();
  };

  const handleCurrentChapterChange = (value: number) => {
    setCurrentChapter(value);
    handleFormFieldChange();
  };

  const handleStoryLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoryLink(e.target.value);
    handleFormFieldChange();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // reset errors
    setTitleError(null);
    setSubmitError(null);
    clearError?.();

    // validate title
    if (title.trim() === "") {
      setTitleError("At least give the story a name... ㅠㅠ");
      return;
    }

    const alreadyExists = await titleExists(title);
    if (alreadyExists) {
      setTitleError("This title already exists in your library!");
      return;
    }

    if (!user) {
      setSubmitError("You need to be logged in to add a story.");
      return;
    }

    let finalCurrentChapter = currentChapter;
    if (readingStatus === "Plan to Read") {
      finalCurrentChapter = null;
    }

    const { data, error } = await quickAddStory({
      title: title.trim(),
      status: readingStatus,
      current_chap: finalCurrentChapter,
      url: storyLink,
    });

    if (error || !data) {
      setSubmitError(error ?? "Something went wrong adding your story.");
      return;
    }

    setMode("success");
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    const focusedElement = document.activeElement as HTMLElement;

    if (focusedElement && focusedElement.tagName === "BUTTON") {
      const isSubmit = (focusedElement as HTMLButtonElement).type === "submit";

      if (isSubmit) {
        return;
      }
    }

    e.preventDefault();
  };

  const renderForm = () => {
    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
        className="flex w-full flex-col items-center gap-4"
        aria-label="Quick add story form"
      >
        {/* Story Title */}
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
          onChange={handleReadingStatusChange}
        />

        {/* Current Chapter */}

        <div
          className={`w-full ${readingStatus === "Plan to Read" ? "pointer-events-none opacity-50" : ""}`}
        >
          <CounterInput
            label="Current Chapter"
            value={currentChapter || 0}
            min={0}
            max={9999}
            onChange={handleCurrentChapterChange}
          />
        </div>

        {/* Story Link */}
        <TextInput
          label="Story Link"
          icon="IconLink"
          variant="col"
          placeholder="https://"
          value={storyLink}
          onChange={handleStoryLinkChange}
        />

        {(submitError || storyError) && (
          <section
            id="formError"
            role="alert"
            aria-live="polite"
            className="validationBox"
          >
            <p> {submitError ?? storyError}</p>
          </section>
        )}

        <button
          type="submit"
          className="modalBtn primary"
          aria-label="Quick add this story to your library"
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
      </form>
    );
  };

  const resetForm = () => {
    setTitle("");
    setReadingStatus(readingStatusOptions[0]);
    setCurrentChapter(1);
    setStoryLink("");
    setTitleError(null);
    setSubmitError(null);
    clearError?.();
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
          onClick={resetForm}
        >
          Add Another Story
        </button>
      </div>
    </section>
  );

  const heading = mode === "success" ? "Story Added!" : "Quick Story Add";

  return (
    <ModalWrapper heading={heading} onClose={onClose}>
      {mode === "form" ? renderForm() : renderEndOfForm()}
    </ModalWrapper>
  );
}
