import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="page-shell pb-16 lg:pb-0">
      <Navbar />
      <main className="container-arthrix section">{children}</main>
    </div>
  );
}