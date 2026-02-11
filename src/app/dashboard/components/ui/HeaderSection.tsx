export default function HeaderSection({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
