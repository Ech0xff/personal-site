export default function CollectionBody({
  title,
  description,
  children,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-4 px-4">
      <h1 className="pt-10 font-bold text-4xl">{title}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      {children}
    </div>
  );
}
