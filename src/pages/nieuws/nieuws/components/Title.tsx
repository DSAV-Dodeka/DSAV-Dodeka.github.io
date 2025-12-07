import "./Title.scss";

interface TitleProps {
  title: string;
  position: "left" | "right";
}

function Title(props: TitleProps) {
  return (
    <div className="title_class_1">
      <h1
        className={
          "title_class_2" +
          (props.position === "left" ? " textLeft" : " textRight")
        }
      >
        {props.title}
      </h1>
    </div>
  );
}

export default Title;
