import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import Styles from "./SideBar.module.css";

export default function SideBar() {
  return (
    <ProSidebar className={Styles.sidebar}>
      <div className={Styles.menuPar}>
        <div className={Styles.menuBut}>
          {" "}
          <Link
            className={Styles.menuI}
            to={{
              pathname: `/`,
            }}
          >
            HOME
          </Link>{" "}
        </div>{" "}
        <div className={Styles.menuBut}>
          {" "}
          <Link
            className={Styles.menuI}
            to={{
              pathname: `/CPA`,
            }}
          >
            Context-preserving anonymization
          </Link>{" "}
        </div>
        <div className={Styles.menuBut}>
          {" "}
          <Link
            className={Styles.menuI}
            to={{
              pathname: `/NEBR`,
            }}
          >
            Named entity-based replacement
          </Link>{" "}
        </div>
        <div className={Styles.menuBut}>
          {" "}
          <Link
            className={Styles.menuI}
            to={{
              pathname: `/NCPA`,
            }}
          >
            Non-context preserving anonymization
          </Link>{" "}
        </div>
        <div className={Styles.menuBut}>
          {" "}
          <Link
            className={Styles.menuI}
            to={{
              pathname: `/CNCPA`,
            }}
          >
            Combined, non-context preserving anonymization
          </Link>{" "}
        </div>
        <div className={Styles.menuBut}>
          {" "}
          <Link
            className={Styles.menuI}
            to={{
              pathname: `/settings`,
            }}
          >
            Settings
          </Link>{" "}
        </div>
      </div>
    </ProSidebar>
  );
}
