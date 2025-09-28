# Corporate KPI Dashboard Design Guidelines

## Design Approach
**System-Based Approach**: Material Design with enterprise customizations for data-heavy, continuous display applications. The dashboard prioritizes function over form with clear data visualization and minimal cognitive load for at-a-glance comprehension.

## Design Principles
- **Glanceable Information**: All KPIs readable from 10+ feet away
- **Minimal Distraction**: Subtle animations, focus on data clarity
- **Continuous Display**: Optimized for 24/7 TV operation
- **Dark Mode Priority**: Reduces eye strain and TV burn-in

## Core Design Elements

### A. Color Palette
**Dark Mode Foundation**:
- Background: `220 9% 4%` (neutral-950)
- Panel: `220 9% 9%` with 80% opacity (neutral-900/80)
- Text: `0 0% 98%` (neutral-100)
- Borders: `220 9% 15%` (neutral-800)

**Accent Colors**:
- Primary Success: `142 71% 45%` (emerald-500)
- Secondary Info: `213 94% 68%` (blue-400)
- Warning: `38 92% 50%` (amber-500)
- Danger: `0 84% 60%` (red-500)
- Purple Accent: `249 58% 73%` (violet-400)

### B. Typography
**Primary Font**: System fonts (Inter fallback)
- Headers: 32px, semibold, tight tracking
- KPI Values: 24-28px, semibold
- Labels: 14px, regular, neutral-400
- Micro Text: 10-12px for timestamps/metadata

### C. Layout System
**Spacing Units**: Tailwind units of 2, 4, and 8
- Component padding: `p-4`
- Grid gaps: `gap-4` or `gap-8`
- Margins: `m-2`, `m-4`, `m-8`
- Icon containers: `p-2`

**Grid System**: CSS Grid with responsive breakpoints optimized for large displays (1920x1080+)

### D. Component Library

**Core Components**:
- **KPI Tiles**: Rounded-2xl panels with icon, label, value, and optional sub-metrics
- **Thermometer Gauges**: Horizontal progress bars for percentage-based KPIs
- **Chart Containers**: Responsive containers for Recharts visualizations
- **Date Range Selectors**: Dropdown controls with preset options
- **Filter Controls**: Multi-select dropdowns for data filtering

**Data Display**:
- **Bar Charts**: For lead sources, booking rates by CSR
- **Line Charts**: For trend analysis over time
- **Area Charts**: For cumulative metrics
- **Pie Charts**: For service mix and distribution
- **Tables**: For detailed breakdowns with alternating row colors

**Navigation & Controls**:
- Subtle border styling: `border-neutral-700`
- Hover states: `hover:border-neutral-500`
- Active states: Background opacity changes
- No complex animations - simple opacity/color transitions

### E. Animations
**Minimal Animation Strategy**:
- Data refresh: Subtle fade transitions (200ms)
- Chart updates: Built-in Recharts animations only
- No page transitions or complex motion
- Focus on data stability over visual flair

## TV Display Optimizations
- **High Contrast**: Ensure 4.5:1 minimum contrast ratios
- **Large Touch Targets**: 44px minimum for any interactive elements
- **Readable Typography**: Minimum 14px for body text, 24px for key metrics
- **Anti-Burn-in**: Rotate dashboard views every 30 minutes
- **Performance**: Optimize for continuous rendering without memory leaks

## Data Visualization Standards
- **Consistent Color Mapping**: Each data series maintains the same color across all charts
- **Clear Legends**: Always visible, positioned strategically
- **Responsive Charts**: Scale appropriately for different screen sizes
- **Loading States**: Skeleton screens with matching panel styling
- **Error States**: Clear messaging with retry options

This design system prioritizes clarity, performance, and continuous operation while maintaining a professional corporate aesthetic suitable for executive viewing.