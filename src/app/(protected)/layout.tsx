import Navbar from "./_components/Navbar";

const ProtectedLayout = ({
 children
}: {
 children: React.ReactNode;
}) => {
  return (
    <div className="flex h-full w-full gap-y-10 flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Navbar />
      {children}
    </div>
  );
}

export default ProtectedLayout;