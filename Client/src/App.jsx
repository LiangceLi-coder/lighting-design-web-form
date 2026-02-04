import Header from "./components/Header";
import MultiStepForm from "./pages/MultiStepForm";
import Coverpage from "./components/CoverPage";
import { Element } from "react-scroll";
import Footer from "./components/Footer";
// import FinishPage from './pages/FinishPage';

function App() {
  return (
    <div className="site-shell">
      <span className="ambient-orb orb-one" />
      <span className="ambient-orb orb-two" />
      <span className="ambient-orb orb-three" />

      <Header />
      <Coverpage />

      <Element name="form-section">
        <MultiStepForm />
      </Element>

      <Footer />
      {/* <FinishPage/> */}
    </div>
  );
}

export default App;
