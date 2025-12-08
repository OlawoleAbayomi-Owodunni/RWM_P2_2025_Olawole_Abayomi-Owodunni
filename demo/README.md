# Demo App - @ayola/stats-visualizer

Interactive demo and showcase of all chart components from the @ayola/stats-visualizer library.

## Features

- Live Charts - All components rendered with real-time data
- Theme Toggle - Switch between light and dark modes
- Responsive - Works perfectly on mobile and desktop
- Interactive Controls - Generate data, filter by date range, adjust settings
- Real-Time Updates - See changes instantly as you interact
- Modal Details - Click bars to see session details

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## What You'll See

### Charts Displayed
1. **SessionsOverDays** - Line chart showing session frequency trends
2. **AvgRatingPerTask** - Bar chart comparing task ratings (click bars for details)
3. **SessionRatingsPerTask** - Stacked bar chart of rating distribution
4. **TasksPerMonth** - Monthly task completion tracking
5. **DailyStreakTracker** - Current/longest streak with history

### Interactive Features
- **Generate Data Button** - Creates realistic sample sessions
- **Clear Data Button** - Resets all charts
- **Date Range Filter** - Last 7/14/30 days or custom range
- **Rating Threshold** - Filter sessions by minimum rating
- **Task Filter** - Multi-select specific tasks
- **Theme Toggle** - System theme detection or manual override

## Component Integration

All charts are imported from `@ayola/stats-visualizer`:

```svelte
<script lang="ts">
  import { 
    SessionsOverDays, 
    AvgRatingPerTask, 
    aggregateByWeek 
  } from '@ayola/stats-visualizer';
  import type { SessionData } from '@ayola/stats-visualizer';
</script>
```

## Project Structure

```
demo/
├── src/
│   ├── routes/
│   │   └── +page.svelte       # Main demo page with all charts
│   ├── lib/
│   │   └── utils.ts           # Data generation helpers
│   └── app.css                # Global styles
├── package.json
└── vite.config.ts
```

## Data Generation

The demo includes utilities to generate realistic session data:

```typescript
// Generate 50 sessions across multiple tasks
const sessions = generateSessions(50, ['reading', 'coding', 'writing']);

// Generate task metadata
const tasks = generateTasks(['reading', 'coding', 'writing']);
```

All generated data matches the `SessionData` interface exactly.

## Customization

### Try Different Data
Edit the data generation parameters in `+page.svelte`:

```typescript
// Generate more or fewer sessions
const sessions = generateSessions(100, taskIds); // More data
const sessions = generateSessions(10, taskIds);  // Less data

// Change tasks
const tasks = generateTasks(['task-1', 'task-2', 'task-3', 'custom-task']);
```

### Adjust Chart Configuration
```svelte
<SessionsOverDays 
  data={filteredSessions}
  config={{
    title: 'Your Title',
    theme: 'dark',
    height: 400,
    responsive: true
  }}
/>
```

### Modify Styling
Edit `app.css` to customize colors, spacing, and layout.

## Testing the Library

Use this demo to:
- ✅ Verify all components work correctly
- ✅ Test responsiveness on different screen sizes
- ✅ Explore filtering and data transformation
- ✅ See real-world usage examples
- ✅ Validate component interactions

## Integration Tips

### Using in Your Own Project

```bash
# Install from npm
npm install @ayola/stats-visualizer

# Or from GitHub
npm install git+https://github.com/OlawoleAbayomi-Owodunni/RWM_P2_2025_Olawole_Abayomi-Owodunni.git
```

Then import components:

```svelte
<script lang="ts">
  import { SessionsOverDays, aggregateByWeek } from '@ayola/stats-visualizer';
  import type { SessionData } from '@ayola/stats-visualizer';
</script>

<SessionsOverDays data={yourSessions} config={{ title: 'Analytics' }} />
```

## Documentation Links

- [Main README](../packages/stats-visualizer/README.md) - Full user guide
- [Quick Start](../packages/stats-visualizer/QUICK_START.md) - Get running in 5 minutes
- [API Reference](../packages/stats-visualizer/API_REFERENCE.md) - Complete function reference
- [Developer Guide](../packages/stats-visualizer/DEVELOPER_GUIDE.md) - For contributors

## Troubleshooting

### Charts not showing?
- Ensure data array is populated (click "Generate Data")
- Check browser console for errors
- Verify SessionData format matches interface

### Performance slow?
- Reduce number of generated sessions
- Use date range filters to limit data
- Check network tab for asset loading

### Theme not applying?
- Hard refresh browser (Ctrl+Shift+R)
- Check browser DevTools for CSS errors
- Verify `prefers-color-scheme` media query support

## Built With

- [Svelte](https://svelte.dev) - UI framework
- [SvelteKit](https://kit.svelte.dev) - App framework
- [Vite](https://vitejs.dev) - Build tool
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [@ayola/stats-visualizer](../packages/stats-visualizer) - Chart components