type ErrorProps = {
  children: React.ReactNode;
};

export function Error({ children }: ErrorProps) {
  return (
    <p className="text-red-800 dark:text-red-400" role="alert">
      {children}
    </p>
  );
}
