import Navbar from "../components/client/navbar";


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <Navbar />
        {children}
     </div>
  );
}