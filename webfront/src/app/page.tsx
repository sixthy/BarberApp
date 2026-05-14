import Header from "./components/nav";
import Body from "./components/body";
import Services from "./components/services";
import Booking from "./components/booking";
import Footer from "./components/footer";


export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="w-full bg-black text-white">
        <Body />
        <Services />
        <Booking />
      </main>
      <Footer />
    </div >
  );
}
