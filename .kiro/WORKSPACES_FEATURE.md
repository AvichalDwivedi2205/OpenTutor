# Workspaces Feature

This document describes the newly implemented workspaces feature for the OpenUni application.

## Overview

The workspaces feature provides a centralized way to organize learning materials, notes, and resources. It includes a collapsible sidebar for easy navigation between different sections of the application.

## Features Implemented

### 1. Workspaces Page (`/workspaces`)
- **Empty State**: When no workspaces exist, displays a centered "Create Workspace" button
- **Workspace List**: Grid layout showing all workspaces with search functionality
- **Search**: Real-time filtering of workspaces by name
- **Navigation**: Click on any workspace to navigate to its detail page

### 2. Individual Workspace Page (`/workspace/[id]`)
- **Workspace Overview**: Shows workspace details, type, and description
- **Roadmaps Section**: Displays learning roadmaps with progress tracking
- **Sidebar Content**: Recent notes and indexed books
- **Quick Actions**: Easy access to create notes and chat with Drona

### 3. New Workspace Creation (`/workspaces/new`)
- **Form Interface**: Name, type (personal/course), and description fields
- **Workspace Types**: 
  - Personal: For individual learning and notes
  - Course: For structured learning with roadmaps
- **Validation**: Required fields and form submission handling

### 4. Collapsible Sidebar
The sidebar is present across all pages and includes three main sections:

#### Workspaces Section
- All Workspaces (links to `/workspaces`)
- Create New (links to `/workspaces/new`)

#### Drona Chatbot Section
- Chat with Drona (links to `/drona`)
- Chat History (placeholder for future implementation)

#### Indexed Books Section
- My Library (links to `/books`)
- Upload Book (placeholder for future implementation)

### 5. Supporting Pages

#### Drona Chatbot Page (`/drona`)
- Chat interface with welcome message
- Message input with send functionality (placeholder)
- Consistent sidebar navigation

#### Books Library Page (`/books`)
- Grid layout of indexed books
- Search functionality
- Book status indicators (indexed/processing)
- Upload book action button

## Technical Implementation

### Styling
- Uses Tailwind CSS v4 with custom width utilities
- Consistent glass morphism design with backdrop blur
- Dark mode support throughout
- Responsive design for mobile and desktop

### Components
- Framer Motion animations for smooth transitions
- Collapsible sidebar with AnimatePresence
- Consistent navigation patterns
- Loading states and form validation

### Data Structure
The implementation uses mock data that aligns with the existing database schema:
- Workspaces with type, name, and metadata
- Roadmaps with progress tracking
- Books with indexing status
- Notes with workspace associations

## File Structure

```
src/app/
├── workspaces/
│   ├── page.tsx              # Main workspaces listing
│   └── new/
│       └── page.tsx          # Create new workspace
├── workspace/
│   └── [id]/
│       └── page.tsx          # Individual workspace view
├── drona/
│   └── page.tsx              # Drona chatbot interface
└── books/
    └── page.tsx              # Books library
```

## Next Steps

1. **API Integration**: Replace mock data with actual database queries
2. **Authentication**: Integrate with Clerk for user-specific workspaces
3. **Real-time Features**: Implement actual chat functionality for Drona
4. **File Upload**: Add book upload and processing functionality
5. **Roadmap Management**: Build out the roadmap creation and management features
6. **Notes Integration**: Connect with the existing notes system

## Usage

1. Navigate to `/workspaces` to see all workspaces
2. Click "Create Workspace" to add a new workspace
3. Click on any workspace to view its details
4. Use the sidebar to navigate between different sections
5. Toggle the sidebar using the menu button in the header

The feature is fully responsive and includes proper loading states, error handling, and accessibility considerations.