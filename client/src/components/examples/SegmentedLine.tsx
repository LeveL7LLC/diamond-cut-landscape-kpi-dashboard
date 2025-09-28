import SegmentedLine from '../SegmentedLine';

export default function SegmentedLineExample() {
  const sampleSegments = [
    { value: "segment1", label: "Angi", color: "#22c55e", proportion: 0.35 },
    { value: "segment2", label: "Nextdoor", color: "#60a5fa", proportion: 0.25 },
    { value: "segment3", label: "Google Ads", color: "#f59e0b", proportion: 0.20 },
    { value: "segment4", label: "Google LSA", color: "#a78bfa", proportion: 0.20 }
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Lead Sources Distribution</h3>
        <SegmentedLine segments={sampleSegments} />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Taller Version (12px)</h3>
        <SegmentedLine segments={sampleSegments} height={12} />
      </div>
    </div>
  );
}