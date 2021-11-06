import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Preview from "./pages/Preview";

const App = () => (
  <BrowserRouter>
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">
        <i className="fab fa-react" /> DATA ANONYMIZER
      </h4>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/preview/:filename/" component={Preview} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
