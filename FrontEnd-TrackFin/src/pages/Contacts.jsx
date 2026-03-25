import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";

function Contacts() {
  return (
    <div className="pageBloc">
      <Banner title="Clients & Fournisseurs" callToAction={<CallToAction1 title="Nouveau contact" iconSrc={addIcon} action={() => {}} />}/>
    </div>
  );
}

export default Contacts;