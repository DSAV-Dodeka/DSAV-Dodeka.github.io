import Header from "../../../../components/Header";
import "./Donateurs_info.scss";
import geld from "$images/commissies/quico/commissie.webp";

function Donateurs_info(props: { text: string }) {
  return (
    <div className="donateurs_1">
      <div className="donateurs_2">
        <Header text="Draag bij aan Dodeka" position="right" />
        <p className="donateurs_3">
          {props.text.split("\n").map((item, index) => (
            <span key={"donateurs" + index}>
              {item}
              <br />
            </span>
          ))}
        </p>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSeBuHmuPLmTTTmjKEoCPj6B9PXG5PlG_Ql-0dla4NNY7Hr2Uw/viewform" target="_blank" rel="noopener noreferrer">
        <button className="schrijfInButton" id="submit_button" type="button">
          Word donateur!
        </button>
      </a>
      </div>
      <img src={geld} alt="" className="donateurs_4" />
    </div>
  );
}
export default Donateurs_info;
