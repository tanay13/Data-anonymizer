import Typewriter from "typewriter-effect";
import Styles from "./Typing.module.css";

export default function Typing() {
  return (
    <div className={Styles.typewriter}>
      <Typewriter
        className={Styles.type}
        options={{
          strings: ["DATA ANONYMIZATION", "DATA MASKING"],
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  );
}
