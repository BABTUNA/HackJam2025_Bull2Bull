# Lost & Found Map Application

## Project Overview

A web application for reporting and viewing lost and found items on an interactive map using MapLibre (open-source mapping solution). Users can add lost or found items with location data, view them on a map, and filter/search through items.

## Application Plan

### Step-by-Step Implementation Plan

#### Phase 1: Project Setup & Dependencies
1. **Install Required Packages**
   - `maplibre-gl` - Open-source map library (no API key required)
   - `react-map-gl` - React wrapper for MapLibre
   - Additional UI libraries if needed (e.g., TailwindCSS, Shadcn)

2. **Configure MapLibre**
   - Set up MapLibre GL JS with React
   - Configure map styles (use open-source tile servers)
   - Ensure proper CSS imports for MapLibre

#### Phase 2: Core Data Structure
1. **Define TypeScript Types**
   ```typescript
   - ItemType: 'lost' | 'found'
   - LostAndFoundItem interface:
     * id: string
     * type: ItemType
     * title: string
     * description: string
     * location: { lat: number, lng: number }
     * date: string (ISO format)
     * contact?: string
     * imageUrl?: string
   ```

2. **State Management**
   - Use React useState for items array
   - Manage selected item state
   - Handle form visibility state

#### Phase 3: Map Component
1. **MapView Component**
   - Render MapLibre map with initial viewport
   - Handle map click events to add new items
   - Display markers for lost (red) and found (green) items
   - Show popups when markers are clicked
   - Implement map controls (zoom, pan)

2. **Marker System**
   - Different markers for lost vs found items
   - Clickable markers that show item details
   - Visual distinction between item types

#### Phase 4: Item Management UI
1. **Item List Component**
   - Sidebar or panel showing all items
   - Filter by type (All/Lost/Found)
   - Click item to highlight on map
   - Display item summary (title, type, date)

2. **Item Form Component**
   - Modal or inline form for adding items
   - Form fields:
     * Type selector (Lost/Found)
     * Title (required)
     * Description (required)
     * Location (auto-filled from map click or manual entry)
     * Contact information (optional)
     * Image URL (optional)
   - Form validation
   - Submit handler to add item to state

#### Phase 5: User Interactions
1. **Adding Items**
   - Click on map → opens form with location pre-filled
   - Fill form → submit → item appears on map
   - New marker appears immediately

2. **Viewing Items**
   - Click marker → shows popup with details
   - Click item in list → map centers on item, shows popup
   - Filter items → map updates markers

3. **Map Navigation**
   - Pan and zoom controls
   - Search/filter functionality
   - Reset view button

#### Phase 6: Styling & UX
1. **UI Design**
   - Use TailwindCSS for all styling
   - Responsive design (mobile-friendly)
   - Modern, clean interface
   - Accessible components (ARIA labels, keyboard navigation)

2. **Visual Elements**
   - Header with app title and "Add Item" button
   - Sidebar with item list and filters
   - Map takes remaining space
   - Loading states
   - Empty states

#### Phase 7: Additional Features (Optional)
1. **Search Functionality**
   - Search items by title/description
   - Filter by date range
   - Filter by location area

2. **Item Details**
   - Full item detail view
   - Edit/Delete items
   - Image display

3. **Persistence**
   - Local storage for items
   - Or backend API integration (future)

### Technical Implementation Details

#### Map Configuration
- **Map Style**: Use open-source MapLibre styles (e.g., `https://demotiles.maplibre.org/style.json`)
- **Initial View**: Center on a default location (e.g., San Francisco)
- **Zoom Level**: Appropriate default zoom (e.g., 12)
- **Controls**: Attribution, zoom controls, fullscreen (optional)

#### Component Structure
```
App
├── Header
│   └── Add Item Button
├── Main Content
│   ├── Sidebar
│   │   ├── Filter Buttons
│   │   └── ItemList
│   └── MapContainer
│       ├── MapView
│       │   ├── Map (MapLibre)
│       │   ├── Markers
│       │   └── Popups
│       └── Instructions Overlay
└── ItemForm (Modal)
    └── Form Fields
```

#### State Management Flow
1. User clicks map → `handleMapClick` → sets form location → opens form
2. User fills form → `handleAddItem` → creates item → adds to items array
3. Items array updates → Map re-renders with new marker
4. User clicks marker → `handleMarkerClick` → shows popup
5. User filters items → updates filtered items → map shows filtered markers

### Pseudocode for Key Functions

```typescript
// Add new item
const handleAddItem = (itemData) => {
  - Create new item object with unique ID
  - Add to items array
  - Close form
  - Clear form location
}

// Handle map click
const handleMapClick = (event) => {
  - Extract lat/lng from event
  - Set form location state
  - Open form modal
}

// Handle marker click
const handleMarkerClick = (item) => {
  - Set selected item
  - Show popup with item details
  - Optionally center map on item
}

// Filter items
const handleFilterChange = (filterType) => {
  - Update filter state
  - Filter items array based on type
  - Map automatically updates markers
}
```

---

# Front-End Development Guidelines

## Role & Expertise

You are a **Senior Front-End Developer** and an **Expert** in:
- ReactJS
- NextJS
- JavaScript
- TypeScript
- HTML
- CSS
- Modern UI/UX frameworks (TailwindCSS, Shadcn, Radix)

You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

## Core Principles

### Requirements & Planning
- **Follow the user's requirements carefully & to the letter**
- **First think step-by-step** - describe your plan for what to build in pseudocode, written out in great detail
- **Confirm, then write code!**

### Code Quality Standards
- Always write **correct, best practice, DRY principle** (Don't Repeat Yourself), **bug-free, fully functional and working code**
- Code should be aligned to the **Code Implementation Guidelines** listed below
- **Focus on easy and readable code, over being performant**
- **Fully implement all requested functionality**
- **Leave NO todo's, placeholders or missing pieces**
- **Ensure code is complete! Verify thoroughly finalized**
- **Include all required imports**, and ensure proper naming of key components
- **Be concise** - Minimize any other prose

### Honesty & Clarity
- If you think there might not be a correct answer, **say so**
- If you do not know the answer, **say so**, instead of guessing

## Coding Environment

The following technologies are used in this project:
- **ReactJS**
- **NextJS**
- **JavaScript**
- **TypeScript**
- **TailwindCSS**
- **HTML**
- **CSS**

## Code Implementation Guidelines

### Control Flow
- **Use early returns whenever possible** to make the code more readable

### Styling
- **Always use Tailwind classes for styling HTML elements**
- **Avoid using CSS or style tags** when Tailwind classes can be used instead
- **Use "class:" instead of the tertiary operator in class tags** whenever possible

### Naming Conventions
- **Use descriptive variable and function/const names**
- **Event functions should be named with a "handle" prefix:**
  - `handleClick` for `onClick`
  - `handleKeyDown` for `onKeyDown`
  - `handleSubmit` for `onSubmit`
  - etc.

### Function Declarations
- **Use consts instead of functions** for function declarations
  - ✅ `const toggle = () => { ... }`
  - ❌ `function toggle() { ... }`
- **Define a type if possible** for better TypeScript support

### Accessibility
- **Implement accessibility features on elements**
- For interactive elements (like buttons, links), include:
  - `tabindex="0"` for keyboard navigation
  - `aria-label` for screen readers
  - `onClick` and `onKeyDown` handlers
  - Similar accessibility attributes as needed

### TypeScript
- **Use TypeScript types and interfaces** whenever possible
- **Avoid using `any` type** - use proper types or `unknown` if type is truly unknown
- **Define types for props, state, and function parameters**

### Code Organization
- **Group related code together**
- **Keep components small and focused**
- **Extract reusable logic into custom hooks or utility functions**
- **Use meaningful file and folder names**

## Example Code Patterns

### ✅ Good Example

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-md ${
        disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={label}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

### ❌ Bad Example

```typescript
function Button(props: any) {
  return (
    <button
      style={{ padding: '8px 16px', backgroundColor: '#blue' }}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
```

## Summary

Follow these guidelines to ensure:
- ✅ Clean, readable, and maintainable code
- ✅ Consistent coding style across the project
- ✅ Better accessibility and user experience
- ✅ Type safety with TypeScript
- ✅ Best practices and modern React patterns

