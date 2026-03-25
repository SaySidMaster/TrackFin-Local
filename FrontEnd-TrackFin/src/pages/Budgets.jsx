import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";

function Budgets() {
  return (
    <div className="pageBloc">
        <Banner title="Budgets" callToAction={<CallToAction1 title="Nouveau budget" iconSrc={addIcon} action={() => {}} />}/>

    </div>
  );
}

export default Budgets;