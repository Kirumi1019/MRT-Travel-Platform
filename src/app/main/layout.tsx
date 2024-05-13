import Navbar from "./_components/Navbar";

type Props = {
    children: React.ReactNode;
  };
  
  function mainLayout({ children }: Props) {
    return (
      <main className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden ">
        <nav className="flex w-1/5 h-full  overflow-y-scroll border-r bg-slate-100 pb-10">
          <Navbar/>
        </nav>
        <div className="w-full overflow-y-scroll overflow-x-scroll">{children}</div>
      </main>
    );
  }
  
  export default mainLayout;
  