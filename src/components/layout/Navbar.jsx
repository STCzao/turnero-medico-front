import logo from '../../assets/Diseño sin título.png'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep text-white shadow-md h-16 overflow-hidden">
      <div className="px-6 h-full flex items-center">
        <img src={logo} alt="Clínica Meridian" className="h-24 md:h-32 w-auto mt-3" />
      </div>
    </header>
  )
}
