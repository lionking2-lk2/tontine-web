import "./Epargne.css";

import EpargneSummary from "./components/EpargneSummary";
import ContributionHistory from "./components/ContributionHistory";
import NextContribution from "./components/NextContribution";

const Epargne = () => {
  return (
    <main className="epargne-content">

      <div className="epargne-title">
        <h1>Mon épargne</h1>
        <p>
          Consultez votre épargne, vos cotisations et vos prochaines échéances.
        </p>
      </div>

      <EpargneSummary />

      <div className="epargne-bottom">
        <ContributionHistory />
        <NextContribution />
      </div>

    </main>
  );
};

export default Epargne;