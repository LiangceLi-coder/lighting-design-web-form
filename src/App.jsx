import MultiStepForm from './pages/MultiStepForm';
import Coverpage from './components/CoverPage';
import {Element} from 'react-scroll';
import Footer from './components/Footer';
// import FinishPage from './pages/FinishPage';

function App() {
  return (
    <div style={{}}>
      <Coverpage />
      <Element name='form-section'>
        <MultiStepForm />
      </Element>
      <Footer />
      {/* <FinishPage/> */}
    </div>
  );
}

export default App;