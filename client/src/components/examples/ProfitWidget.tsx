import ProfitWidget from '../ProfitWidget';

export default function ProfitWidgetExample() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ProfitWidget
        label="Gross Profit"
        value={0.46}
        mom={0.024}
        data-testid="profit-gross"
      />
      <ProfitWidget
        label="Net Profit"
        value={0.20}
        mom={-0.008}
        data-testid="profit-net"
      />
    </div>
  );
}