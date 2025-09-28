interface SegmentData {
  value: string;
  label: string;
  color: string;
  proportion: number; // 0-1, represents the percentage of the total
}

interface SegmentedLineProps {
  segments: SegmentData[];
  height?: number;
}

export default function SegmentedLine({ segments, height = 8 }: SegmentedLineProps) {
  // Calculate total and ensure proportions sum to 1
  const total = segments.reduce((sum, seg) => sum + seg.proportion, 0);
  const normalizedSegments = total > 0 ? segments.map(seg => ({
    ...seg,
    proportion: seg.proportion / total
  })) : segments;

  return (
    <div className="w-full rounded-full overflow-hidden bg-muted/30" style={{ height }}>
      <div className="flex h-full">
        {normalizedSegments.map((segment, index) => (
          <div
            key={segment.value}
            className="h-full"
            style={{
              width: `${segment.proportion * 100}%`,
              backgroundColor: segment.color,
            }}
            title={`${segment.label}: ${(segment.proportion * 100).toFixed(1)}%`}
          />
        ))}
      </div>
    </div>
  );
}