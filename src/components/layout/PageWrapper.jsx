import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-mint">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-56 px-4 md:px-12 py-6 md:py-10 pb-24 md:pb-10">
          <div className="w-full max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
