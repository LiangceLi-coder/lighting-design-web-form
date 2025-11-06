import MultiStepForm from './pages/MultiStepForm';
import Coverpage from './components/CoverPage';
import {Element} from 'react-scroll';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{}}>
      <Coverpage />
      <Element name='form-section'>
        <MultiStepForm />
      </Element>
      <Footer />
    </div>
  );
}

export default App;