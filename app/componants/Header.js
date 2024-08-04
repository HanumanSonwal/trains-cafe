export default function Header() {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center">
          <img src="/images/logo.svg" alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold ml-2">Trains-Cafe</h1>
        </div>
        <button className="text-black-500 font-bold">Login</button>
      </header>
    );
  }
  