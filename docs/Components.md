# Components Documentation

## Overview

HireNow uses a component-based architecture with reusable UI components following React Native best practices. All components use TypeScript and follow the design system defined in `constants/theme.ts`.

## UI Components (`/components/ui/`)

### Button

A versatile button component with multiple variants and states.

**Props:**
- `title: string` - Button text
- `onPress: () => void` - Press handler
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` - Visual style (default: 'primary')
- `disabled?: boolean` - Disable interaction (default: false)
- `loading?: boolean` - Show loading indicator (default: false)
- `fullWidth?: boolean` - Expand to full width (default: false)

**Variants:**
- **primary** - Teal background with white text
- **secondary** - Dark teal background with white text
- **outline** - Transparent with teal border
- **ghost** - Transparent with teal text

**Example:**
```tsx
<Button
  title="Apply Now"
  onPress={() => console.log('Applied')}
  variant="primary"
  fullWidth
/>

<Button
  title="Cancel"
  onPress={() => console.log('Cancelled')}
  variant="outline"
/>
```

### Card

A flexible container component with optional padding and elevation.

**Props:**
- `children: React.ReactNode` - Card content
- `style?: ViewStyle` - Additional styles
- `padded?: boolean` - Add internal padding (default: true)
- `elevated?: boolean` - Add shadow elevation (default: true)

**Example:**
```tsx
<Card elevated>
  <Text>Card content</Text>
</Card>

<Card style={{ marginBottom: 16 }} padded={false}>
  <Image source={imageSource} />
</Card>
```

### Input

A text input component with label and error handling.

**Props:**
- `label?: string` - Input label
- `error?: string` - Error message
- `containerStyle?: object` - Container styles
- `...TextInputProps` - All React Native TextInput props

**Example:**
```tsx
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
/>
```

## Layout Components (`/components/layout/`)

### Header

Application header with navigation buttons and actions.

**Props:**
- `title: string` - Header title
- `subtitle?: string` - Optional subtitle
- `showFavoritesButton?: boolean` - Show favorites icon (default: false)
- `showSettingsButton?: boolean` - Show settings icon (default: false)
- `showBackButton?: boolean` - Show back button (default: false)
- `onBackPress?: () => void` - Custom back handler

**Example:**
```tsx
<Header
  title="Job Search"
  subtitle="Find your dream job"
  showFavoritesButton
  showSettingsButton
/>

<Header
  title="Job Details"
  showBackButton
  onBackPress={() => router.back()}
/>
```

### Screen

Wrapper component for consistent screen layout with safe areas.

**Props:**
- `children: React.ReactNode` - Screen content
- `style?: ViewStyle` - Additional styles

**Example:**
```tsx
<Screen>
  <Header title="Search" />
  <SearchBar />
  <JobList />
</Screen>
```

## Job Components (`/components/job/`)

### JobCard

Card component for displaying job listings with favorite functionality.

**Props:**
- `job: Job` - Job data object
- `isFavorite?: boolean` - Favorite state (default: false)
- `isApplied?: boolean` - Applied state (default: false)
- `onFavoritePress?: () => void` - Favorite toggle handler
- `showFavorite?: boolean` - Show favorite button (default: true)

**Features:**
- Displays job title, company, location, salary
- Shows job type badge with color coding
- Truncates description to 2 lines
- Navigates to job details on press
- Optional favorite button

**Example:**
```tsx
<JobCard
  job={job}
  isFavorite={favorites.includes(job.id)}
  onFavoritePress={() => toggleFavorite(job.id)}
/>

<JobCard
  job={job}
  isApplied={appliedJobs.includes(job.id)}
  showFavorite={false}
/>
```

### FavoriteButton

Heart icon button for toggling favorite status.

**Props:**
- `isFavorite: boolean` - Current favorite state
- `onPress: () => void` - Press handler
- `size?: number` - Icon size (default: 24)

**Example:**
```tsx
<FavoriteButton
  isFavorite={isFavorite}
  onPress={() => setIsFavorite(!isFavorite)}
  size={20}
/>
```

## Search Components

### SearchBar

Input component for job search with debounced updates.

**Props:**
- `value: string` - Current search value
- `onChange: (value: string) => void` - Change handler
- `placeholder?: string` - Input placeholder
- `onClear?: () => void` - Clear button handler

**Features:**
- Debounced input (300ms delay)
- Clear button when not empty
- Search icon
- Responsive design

**Example:**
```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search jobs..."
  onClear={() => setSearchQuery('')}
/>
```

### FilterChips

Horizontal scrollable chips for job type filtering.

**Props:**
- `selectedType?: JobType` - Currently selected type
- `onSelect: (type: JobType | undefined) => void` - Selection handler

**Features:**
- All job types with localized labels
- Color-coded selection
- Smooth scrolling
- Deselect on already selected

**Example:**
```tsx
<FilterChips
  selectedType={selectedType}
  onSelect={setSelectedType}
/>
```

### QuickFilters

Pre-defined location and technology filters.

**Props:**
- `filters: string[]` - Filter options
- `selectedFilters: string[]` - Currently selected
- `onToggle: (filter: string) => void` - Toggle handler

**Features:**
- Pills with close buttons
- Horizontal scrolling
- Animated transitions
- Customizable filter sets

**Example:**
```tsx
<QuickFilters
  filters={['Київ', 'Львів', 'Віддалено', 'React', 'TypeScript']}
  selectedFilters={activeFilters}
  onToggle={toggleFilter}
/>
```

### SortButton

Dropdown button for sorting options.

**Props:**
- `value: SortOption` - Current sort value
- `onChange: (option: SortOption) => void` - Change handler

**Sort Options:**
- `relevant` - Most relevant
- `recent` - Most recent
- `salary-high` - Highest salary
- `salary-low` - Lowest salary

**Example:**
```tsx
<SortButton
  value={sortBy}
  onChange={setSortBy}
/>
```

### SearchStats

Component displaying search result statistics.

**Props:**
- `count: number` - Number of results
- `query?: string` - Search query
- `loading?: boolean` - Loading state

**Example:**
```tsx
<SearchStats
  count={jobs.length}
  query="React Developer"
  loading={isLoading}
/>
```

## Utility Components

### EmptyState

Component for displaying empty states with helpful messages.

**Props:**
- `title: string` - Empty state title
- `description?: string` - Descriptive text
- `action?: { label: string; onPress: () => void }` - Optional action button

**Example:**
```tsx
<EmptyState
  title="No jobs found"
  description="Try adjusting your search criteria"
  action={{
    label: 'Clear filters',
    onPress: clearFilters
  }}
/>
```

## Design System Integration

All components use the centralized design system:

```typescript
// colors
colors.primary     // #0F766E (Teal)
colors.surface     // #FFFFFF
colors.background  // #F8FAFC
colors.text        // #0F172A

// typography
typography.xs      // 12px
typography.sm      // 14px
typography.base    // 16px
typography.lg      // 18px
typography.xl      // 20px

// spacing
spacing.xs         // 4px
spacing.sm         // 8px
spacing.md         // 16px
spacing.lg         // 24px
spacing.xl         // 32px
```

## Component Guidelines

1. **Consistency**: All components follow the same prop patterns and styling
2. **Accessibility**: Include hitSlop for touch targets, proper labels
3. **Performance**: Use React.memo where appropriate, avoid unnecessary re-renders
4. **TypeScript**: All props are fully typed with interfaces
5. **Theming**: Use theme constants, avoid hardcoded values
6. **Responsive**: Components adapt to different screen sizes

## Usage Examples

### Complete Job List Screen

```tsx
export function JobListScreen() {
  const { jobs, loading, search } = useJobs();
  const { favorites, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<JobType>();

  return (
    <Screen>
      <Header title="Jobs" showFavoritesButton />
      
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search jobs..."
      />
      
      <FilterChips
        selectedType={selectedType}
        onSelect={setSelectedType}
      />
      
      {loading ? (
        <ActivityIndicator />
      ) : jobs.length > 0 ? (
        jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            isFavorite={favorites.includes(job.id)}
            onFavoritePress={() => toggleFavorite(job.id)}
          />
        ))
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try different search criteria"
        />
      )}
    </Screen>
  );
}
```
