import Button from "#components/ui/button.component";
export default function SubmitButton({
  pending,
  label,
}: {
  pending: boolean;
  label: string;
}) {
  return (
    <Button type="submit" loading={pending}>
      {label}
    </Button>
  );
}
