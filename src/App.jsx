import MultiStepForm from './pages/MultiStepForm';
import Coverpage from './components/CoverPage';
import {Element} from 'react-scroll';

function App() {
  return (
    <div>
      <Coverpage />
      <Element name='form-section'>
        <MultiStepForm />
      </Element>
      
    </div>
  );
}

export default App;