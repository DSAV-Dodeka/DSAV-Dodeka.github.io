import Header from "../../../components/Header";
import "./Baanatletiek.scss";
import baanatletiek from "$images/trainingen/baanatletiek.jpg";

function Baanatletiek(props: { text: string }) {
  return (
    <div className="baanatletiek_1">
      <img src={baanatletiek} alt="" className="baanatletiek_2" />
      <div className="baanatletiek_3">
        <Header text="Baanatletiek" position="left" />
        <p className="baanatletiek_4">
          {props.text.split("\n").map((item, index) => (
            <span key={"baan" + index}>
              {item}
              <br />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
export default Baanatletiek;
