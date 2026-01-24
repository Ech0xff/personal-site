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
    <div className="w-full flex flex-col gap-4 px-4">
      <h1 className="text-4xl font-bold pt-10">{title}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm">{description}</p>
      {children}
    </div>
  );
}
