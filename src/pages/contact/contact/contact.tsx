import PageTitle from "$components/PageTitle";
import Contactinfo from "./components/Contactinfo";
import Socials from "./components/Socials";
import Maps from "$components/Maps";
import Questions from "./components/Questions";
import Text from "$content/FAQ.json";
import "./Contact.scss";

function Contact() {
  return (
    <div>
      <PageTitle title="Contact" />
      <div id="contact" className="mb-8 lg:mb-16">
        <div id="contact_info">
          <Contactinfo />
          <Socials />
        </div>
        <div id="contact_map">
          <Maps />
        </div>
      </div>
      <div id="faq">
        <PageTitle title="Frequently asked questions" />
        <Questions questions={Text.questions} />
      </div>
    </div>
  );
}

export default Contact;
