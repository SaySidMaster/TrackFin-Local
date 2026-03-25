import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import ListActionBanner from "../components/ListActionBanner";
import exportIcon from "../assets/icons/exporter.svg";

function Statistiques( { filter } ) {
  return (
    <div className="pageBloc">
      <Banner title="Statistiques" actionBanner={<ListActionBanner filter={filter} />} callToAction={<CallToAction1 title="Exporter" iconSrc={exportIcon} action={() => {}} />}/>
    </div>
  );
}

export default Statistiques;