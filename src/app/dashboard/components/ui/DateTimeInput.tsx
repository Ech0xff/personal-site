"use client";

type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export default function DateTimeInput({
  value,
  onChange,
  label = "Published Time",
  wrapperClassName,
  labelClassName,
  inputClassName,
}: DateTimeInputProps) {
  return (
    <div className={wrapperClassName}>
      <label
        className={
          labelClassName ||
          "mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        }
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="datetime-local"
          className={
            inputClassName ||
            "w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
          }
        />
      </div>
    </div>
  );
}
