import "./Epargne.css";

import EpargneSummary from "./components/EpargneSummary";
import ContributionHistory from "./components/ContributionHistory";
import GroupBalances from "./components/GroupBalances";

const Epargne = () => {
  return (
    <main className="epargne-content">

      <div className="epargne-title">
        <h1>Mon épargne</h1>
        <p>
  Consultez votre épargne et vos cotisations.
</p>
      </div>

      <EpargneSummary />
      <GroupBalances />

      <div className="epargne-bottom">
        <ContributionHistory />
        
      </div>

    </main>
  );
};

export default Epargne;