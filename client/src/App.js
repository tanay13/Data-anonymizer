import Styles from "./App.module.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Preview from "./pages/Preview";
import SideBar from "./components/SideBar";
import Form from "./pages/Form";

const App = () => (
  <BrowserRouter forceRefresh={true}>
    <div className={Styles.container}>
      <SideBar></SideBar>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/CPA" component={Form} exact />
        <Route path="/NCPA" component={Form} exact />
        <Route path="/NEBR" component={Form} exact />
        <Route path="/CNCPA" component={Form} exact />
        <Route path="/preview/:filename/" component={Preview} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
